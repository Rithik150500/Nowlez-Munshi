"""The WhatsApp front door. Deliberately tiny: it resolves the user by phone
and calls the SAME munshi_core.ask_munshi() the web route uses. No RQ/Redis
worker (overkill for the prototype) — see whatsapp/handler.py."""
