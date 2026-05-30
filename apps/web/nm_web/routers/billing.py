"""Billing: tier/usage status, Razorpay webhook (sets tier), checkout stub."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.billing import (
    TIERS,
    SubscriptionRepository,
    _count_cases,
    _count_members,
    coupons,
    effective_tier,
    start_trial,
)
from nm_core.billing.razorpay import verify_webhook
from nm_core.billing.webhook import process_webhook
from nm_core.config import get_settings
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.db.models.user import User
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api", tags=["billing"])


class CheckoutBody(BaseModel):
    tier: str


class CouponQuery(BaseModel):
    code: str


@router.get("/billing")
def billing(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    account = ensure_personal_account(db, user)
    tier = effective_tier(db, account.id)
    limits = TIERS[tier]
    cases = _count_cases(db, account.id)
    members = _count_members(db, account.id)
    return {
        "account_id": str(account.id),
        "tier": tier,
        "enforced": True,
        "limits": {"max_cases": limits["max_cases"], "max_members": limits["max_members"],
                   "features": sorted(limits["features"])},
        "usage": {"cases": cases, "members": members},
        "at_case_limit": limits["max_cases"] is not None and cases >= limits["max_cases"],
        "at_member_limit": limits["max_members"] is not None and members >= limits["max_members"],
    }


@router.get("/billing/invoices")
def invoices(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """The user's Munshi postpaid invoices, newest first."""
    rows = db.execute(
        select(MunshiInvoice)
        .where(MunshiInvoice.user_id == user.id)
        .order_by(MunshiInvoice.cycle_end.desc())
    ).scalars().all()
    return {"invoices": [
        {"id": str(i.id), "cycle_start": i.cycle_start.isoformat(),
         "cycle_end": i.cycle_end.isoformat(), "case_count": i.case_count,
         "amount_inr": i.amount_inr, "status": i.status,
         "paid_at": i.paid_at.isoformat() if i.paid_at else None}
        for i in rows
    ]}


@router.post("/billing/validate-coupon")
def validate_coupon(
    body: CouponQuery, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    """Preview a coupon (does not consume a use). 404 if invalid/expired/exhausted."""
    coupon = coupons.validate_coupon(db, body.code)
    if coupon is None:
        raise HTTPException(status_code=404, detail="invalid or expired coupon")
    return {"code": coupon.code, "discount_percent": coupon.discount_percent}


@router.post("/billing/trial")
def start_trial_endpoint(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    """Start a 30-day Chambers trial — once per account (idempotent if one ever existed)."""
    account = ensure_personal_account(db, user)
    if SubscriptionRepository(db).get_latest(account.id) is not None:
        raise HTTPException(status_code=409, detail="a subscription or trial already exists")
    sub = start_trial(db, account.id)
    return {"tier": sub.tier, "status": sub.status,
            "period_end": sub.period_end.isoformat() if sub.period_end else None}


@router.post("/billing/checkout")
def checkout(
    body: CheckoutBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    if body.tier not in TIERS:
        raise HTTPException(status_code=422, detail="unknown tier")
    account = ensure_personal_account(db, user)
    s = get_settings()
    if not s.RAZORPAY_KEY_ID:
        # No Razorpay configured (dev): report the intent; real checkout needs keys.
        return {"status": "unconfigured", "tier": body.tier, "account_id": str(account.id)}
    # A real integration creates a Razorpay subscription with
    # notes={account_id, tier}; the activation webhook then flips the tier.
    return {"status": "checkout", "tier": body.tier, "key_id": s.RAZORPAY_KEY_ID,
            "notes": {"account_id": str(account.id), "tier": body.tier}}


@router.post("/billing/webhook")
async def webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    body = await request.body()
    sig = request.headers.get("X-Razorpay-Signature")
    if not verify_webhook(body, sig, get_settings().RAZORPAY_WEBHOOK_SECRET):
        raise HTTPException(status_code=403, detail="bad signature")
    payload = await request.json()
    event_id = request.headers.get("X-Razorpay-Event-Id")
    action = process_webhook(db, event_id=event_id, payload=payload)
    return {"ok": True, "action": action}
