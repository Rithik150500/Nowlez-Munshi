"""Tiny i18n catalog (EN/HI) shared by the bot and exposed to the web SPA.

t(key, locale, **kw) returns the formatted string; unknown locales fall back to 'en',
unknown keys return the key itself (so missing translations are visible, not crashes).
"""
from __future__ import annotations

DEFAULT_LOCALE = "en"
SUPPORTED = ("en", "hi")

# Bot reply strings.
_BOT: dict[str, dict[str, str]] = {
    "help": {
        "en": (
            "🧑‍⚖️ *Nowlez Munshi*\n"
            "• Send a *CNR* (16 chars) to track a case\n"
            "• /saved — your case book\n"
            "• /today, /this_week — upcoming hearings\n"
            "• /forget <CNR> — stop tracking\n"
            "• /snooze <CNR> <days> — pause alerts\n"
            "• /alerts <CNR> <all|orders_only|hearings_only|digest_only>\n"
            "• /digest_on, /digest_off\n"
            "• /search — find a case by party / number on the web\n"
            "• send a *case QR photo* to track it\n"
            "• /web — open your case book on the web"
        ),
        "hi": (
            "🧑‍⚖️ *Nowlez Munshi*\n"
            "• केस ट्रैक करने के लिए *CNR* (16 अक्षर) भेजें\n"
            "• /saved — आपकी केस बुक\n"
            "• /today, /this_week — आगामी सुनवाई\n"
            "• /forget <CNR> — ट्रैक करना बंद करें\n"
            "• /web — वेब पर अपनी केस बुक खोलें"
        ),
    },
    "tracking_now": {
        "en": "✅ Tracking now. I'll alert you on changes.",
        "hi": "✅ ट्रैकिंग शुरू। बदलावों पर सूचित करूँगा।",
    },
    "no_cases": {
        "en": "No cases yet. Send a CNR to start tracking.",
        "hi": "अभी कोई केस नहीं। ट्रैक करने के लिए CNR भेजें।",
    },
    "not_found": {
        "en": "No case found for {cnr}. Double-check the CNR.",
        "hi": "{cnr} के लिए कोई केस नहीं मिला। CNR जाँचें।",
    },
    "unknown_cmd": {"en": "Unknown command {cmd}. Send /help.",
                    "hi": "अज्ञात कमांड {cmd}। /help भेजें।"},
    "opted_out": {
        "en": ("🔕 You've been opted out of WhatsApp alerts. You won't get proactive "
               "messages from Nowlez Munshi. Reply START anytime to turn them back on."),
        "hi": ("🔕 आपने WhatsApp अलर्ट बंद कर दिए हैं। अब Nowlez Munshi से सूचनाएँ नहीं आएँगी। "
               "फिर से चालू करने के लिए कभी भी START भेजें।"),
    },
    "opted_in": {
        "en": "🔔 Welcome back! WhatsApp alerts are on again.",
        "hi": "🔔 वापसी पर स्वागत है! WhatsApp अलर्ट फिर से चालू हैं।",
    },
    # Onboarding: bilingual welcome (shown above the language-picker buttons,
    # before the user has chosen a language).
    "welcome": {
        "en": ("🧑‍⚖️ Welcome to *Nowlez Munshi* — your case clerk on WhatsApp.\n"
               "नमस्ते! Choose your language / अपनी भाषा चुनें:"),
        "hi": ("🧑‍⚖️ *Nowlez Munshi* में आपका स्वागत है — WhatsApp पर आपका केस मुंशी।\n"
               "Choose your language / अपनी भाषा चुनें:"),
    },
    "onboard_done": {
        "en": ("Great — you're all set! 🎉\n\n"
               "Here's what a tracked case looks like:\n\n"
               "*Sample v. State*\nDLND010000012024\nDistrict Court, Delhi\n"
               "Next hearing: 12 Jun 2026\n\n"
               "📩 Now send me a *CNR* (16 characters) to track your first case."),
        "hi": ("बढ़िया — सब तैयार है! 🎉\n\n"
               "एक ट्रैक किया गया केस ऐसा दिखता है:\n\n"
               "*Sample v. State*\nDLND010000012024\nजिला न्यायालय, दिल्ली\n"
               "अगली सुनवाई: 12 जून 2026\n\n"
               "📩 अब अपना पहला केस ट्रैक करने के लिए *CNR* (16 अक्षर) भेजें।"),
    },
}

# Web SPA UI strings.
_WEB: dict[str, dict[str, str]] = {
    "cases": {"en": "Case book", "hi": "केस बुक"},
    "search": {"en": "Search", "hi": "खोज"},
    "calendar": {"en": "Calendar", "hi": "कैलेंडर"},
    "ask": {"en": "Ask Munshi", "hi": "मुंशी से पूछें"},
    "documents": {"en": "Documents", "hi": "दस्तावेज़"},
    "alerts": {"en": "Alerts", "hi": "अलर्ट"},
    "chamber": {"en": "Chamber", "hi": "चैंबर"},
    "logout": {"en": "Logout", "hi": "लॉग आउट"},
    "track": {"en": "Track", "hi": "ट्रैक"},
}


def _norm(locale: str | None) -> str:
    return locale if locale in SUPPORTED else DEFAULT_LOCALE


def t(key: str, locale: str | None = None, **kw: object) -> str:
    entry = _BOT.get(key)
    if entry is None:
        return key
    template = entry.get(_norm(locale)) or entry.get(DEFAULT_LOCALE) or key
    return template.format(**kw) if kw else template


def web_catalog(locale: str | None = None) -> dict[str, str]:
    loc = _norm(locale)
    return {k: (v.get(loc) or v[DEFAULT_LOCALE]) for k, v in _WEB.items()}
