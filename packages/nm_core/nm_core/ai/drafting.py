"""Legal-document drafting: render AI-emitted docx-js JS to a DOCX via a sandboxed
Node subprocess (ported from the legacy Nowlez drafting feature).

The agent reads the docx-js reference + a matching template (``read_docx_js_reference``
/ ``read_docx_template`` tools), then emits docx-js JavaScript; ``runner.js`` executes
it in a restricted Node ``vm`` (only ``require('docx')``; no fs/process/child_process)
and packs the result. Security posture carried over verbatim: code-size cap, an
owner-only temp file, a memory-capped + wall-clock-timed subprocess, and storage-path
containment. The tool is disabled when no Node runtime is available, so the offline
test suite stays green without Node.
"""
from __future__ import annotations

import logging
import os
import re
import shutil
import stat
import subprocess
import tempfile
import uuid
from pathlib import Path

from nm_core.config import get_settings
from nm_core.storage import get_storage

logger = logging.getLogger("nm_core.ai.drafting")

_RUNNER = Path(__file__).parent / "docx_runner" / "runner.js"
_DOCX_DEP = Path(__file__).parent / "docx_runner" / "node_modules" / "docx"
_REFERENCE = Path(__file__).parent / "reference" / "docx-js-reference.md"
_TEMPLATES_DIR = Path(__file__).parent / "reference" / "templates"
_SAFE_TITLE_RE = re.compile(r"[^A-Za-z0-9 _-]+")


def is_available() -> bool:
    """True only if drafting can actually run: a Node runtime, the runner, AND its
    installed `docx` dep. The dep check matters because the wheel ships the runner but
    NOT node_modules (installed via `npm install` at deploy) — without it, the runner
    fails at `require('docx')`. Gating on the dep keeps the tool (and its tests)
    correctly disabled until the deps are present."""
    bin_ = get_settings().DOCX_NODE_BIN
    return (
        bool(bin_)
        and shutil.which(bin_) is not None
        and _RUNNER.exists()
        and _DOCX_DEP.is_dir()
    )


def read_reference() -> str:
    """The docx-js API reference + template catalog the agent reads before drafting."""
    if not _REFERENCE.exists():
        return ""
    return _REFERENCE.read_text(encoding="utf-8")


def list_templates() -> list[str]:
    return sorted(p.stem for p in _TEMPLATES_DIR.glob("*.js"))


def read_template(template_id: str) -> str | None:
    """Read a reference template by id, with path-traversal containment. None if absent."""
    template_id = (template_id or "").strip()
    if not template_id:
        return None
    path = (_TEMPLATES_DIR / f"{template_id}.js").resolve()
    if not path.is_relative_to(_TEMPLATES_DIR.resolve()) or not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def _safe_title(title: str) -> str:
    cleaned = _SAFE_TITLE_RE.sub("", title or "").strip() or "document"
    return cleaned[:80]


class DraftError(Exception):
    """Drafting failed (bad code, runner error, timeout, or Node unavailable)."""


def render_docx(js_code: str) -> bytes:
    """Run docx-js JS through the sandboxed Node runner and return the DOCX bytes.

    Raises DraftError on oversize input, a missing runtime, or any runner failure."""
    settings = get_settings()
    if not js_code:
        raise DraftError("no document code provided")
    if len(js_code.encode("utf-8")) > settings.DOCX_MAX_CODE_SIZE_BYTES:
        raise DraftError(
            f"document code exceeds {settings.DOCX_MAX_CODE_SIZE_BYTES // 1024}KB limit"
        )
    if not is_available():
        raise DraftError("document drafting is unavailable (no Node runtime)")

    tmp_js = tmp_out = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".js", prefix="nm_draft_", delete=False, encoding="utf-8"
        ) as f:
            f.write(js_code)
            tmp_js = f.name
        try:
            os.chmod(tmp_js, stat.S_IRUSR | stat.S_IWUSR)  # owner-only
        except OSError:
            pass  # non-POSIX
        tmp_out = tempfile.NamedTemporaryFile(suffix=".docx", delete=False).name

        try:
            proc = subprocess.run(
                [
                    settings.DOCX_NODE_BIN,
                    f"--max-old-space-size={settings.DOCX_SUBPROCESS_MAX_MEMORY_MB}",
                    str(_RUNNER), tmp_js, tmp_out,
                ],
                capture_output=True, text=True,
                timeout=settings.DOCX_SUBPROCESS_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired as e:
            raise DraftError("document generation timed out") from e
        if proc.returncode != 0:
            logger.warning("docx runner failed: %s", proc.stderr[:200])
            raise DraftError(f"document generation failed: {proc.stderr[:200]}")

        data = Path(tmp_out).read_bytes()
        if not data:
            raise DraftError("document generation produced no output")
        return data
    finally:
        for p in (tmp_js, tmp_out):
            if p:
                try:
                    os.unlink(p)
                except OSError:
                    pass


def draft_and_store(js_code: str, *, account_id: uuid.UUID, title: str) -> dict:
    """Render the DOCX and persist it via the storage layer. Returns metadata."""
    data = render_docx(js_code)
    key = f"drafts/{account_id}/{_safe_title(title)}-{uuid.uuid4().hex[:8]}.docx"
    get_storage().put(key, data)
    return {"storage_key": key, "filename": f"{_safe_title(title)}.docx", "bytes": len(data)}
