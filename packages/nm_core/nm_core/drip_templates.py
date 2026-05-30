"""Plain-text drip email templates (subject, body) keyed by the DRIP_CALENDAR keys.

Greenfield emails are plain text (nm_core.email has no HTML engine), so the legacy
.html files become simple subject/body pairs. The catch-up email summarizes the D1-3
feature overview for users who activate late."""
from __future__ import annotations

_T: dict[str, tuple[str, str]] = {
    "d1_active": ("You're tracking your first case 🎉",
                  "Great start! Nowlez Munshi now watches this case and alerts you on any "
                  "change — new orders, hearing dates, disposal. Add more with a CNR anytime."),
    "d1_inactive": ("Add your first case in 30 seconds",
                    "Welcome to Nowlez Munshi. Send a CNR (or a cause-list photo) and we'll "
                    "track every change for you. Reply to this email if you need a hand."),
    "d2_active": ("Ask the AI Munshi about your cases",
                  "Try asking the Munshi a question about any case you track — it answers "
                  "with citations, on web and WhatsApp."),
    "d2_inactive": ("Your case book, organized",
                    "Track all your matters in one place. Add a case by its CNR to begin."),
    "d3_active": ("Never miss a hearing",
                  "Turn on digests to get tomorrow's listed hearings each evening."),
    "d3_inactive": ("A clerk that never sleeps",
                    "Nowlez Munshi refreshes your cases daily and flags what changed. "
                    "Add a case to see it work."),
    "d7_active_pricing": ("Do more with a paid plan",
                          "You're getting value from Nowlez Munshi — a paid plan lifts your "
                          "case and chamber limits and unlocks search + documents."),
    "d7_inactive_reengage": ("Still there? Your Munshi is ready",
                             "Add a case whenever you're ready — it takes 30 seconds and we "
                             "handle the rest."),
    "d25_active_refer": ("Refer a colleague, both get rewarded",
                         "Share your referral code from Settings — when a colleague subscribes, "
                         "you both get bonus days."),
    "d27_active_plan": ("The right plan for your practice",
                        "Based on how you use Nowlez Munshi, here's the plan we'd recommend. "
                        "Review your options in Billing."),
    "catch_up": ("Here's what you can do with Nowlez Munshi",
                 "Now that you're tracking cases, a quick tour: cross-channel change alerts, "
                 "the AI Munshi with citations, tomorrow-hearing digests, and in-browser "
                 "document editing. Reply anytime with questions."),
}


def render(key: str) -> tuple[str, str] | None:
    """Return (subject, body) for a template key, or None if unknown."""
    return _T.get(key)
