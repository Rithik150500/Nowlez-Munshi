"""munshi_core — the single, channel-agnostic "brain" of Nowlez Munshi.

`ask_munshi()` is written ONCE here and called by BOTH the web route
(`app/routers/munshi.py`) and the WhatsApp handler (`whatsapp/handler.py`).
That shared entry point is the whole architectural point of the product:
one AI legal clerk, the same answer wherever the user is.
"""
from .core import ask_munshi
from .types import AnswerResult, Citation

__all__ = ["ask_munshi", "AnswerResult", "Citation"]
