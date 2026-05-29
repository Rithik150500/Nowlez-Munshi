"""Billing: tier/usage status, Razorpay webhook (sets tier), checkout stub."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core.billing import (
    TIERS,
    SubscriptionRepository,
    _count_cases,
    _count_members,
    effective_tier,
)
from nm_core.billing.razorpay import extract_account_and_tier, verify_webhook
from nm_core.config import get_settings
from nm_core.db.models.user import User
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api", tags=["billing"])


class CheckoutBody(BaseModel):
    tier: str


@router.get("/billing")
def billing(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    account = ensure_personal_account(db, user)
    tier = effective_tier(db, account.id)
    limits = TIERS[tier]
    return {
        "account_id": str(account.id),
        "tier": tier,
        "enforced": True,
        "limits": {"max_cases": limits["max_cases"], "max_members": limits["max_members"],
                   "features": sorted(limits["features"])},
        "usage": {"cases": _count_cases(db, account.id), "members": _count_members(db, account.id)},
    }


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
    found = extract_account_and_tier(payload)
    if found:
        account_id, tier = found
        SubscriptionRepository(db).set_tier(uuid.UUID(account_id), tier, provider_ref="razorpay")
    return {"ok": True}
