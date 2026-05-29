"""Pluggable blob storage. Default = local filesystem; swap for S3-compatible later."""
from __future__ import annotations

from pathlib import Path

from nm_core.config import get_settings


class LocalStorage:
    def __init__(self, base_dir: str) -> None:
        self.base = Path(base_dir)

    def put(self, key: str, data: bytes) -> str:
        path = self.base / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return str(path)

    def get(self, key: str) -> bytes:
        return (self.base / key).read_bytes()

    def exists(self, key: str) -> bool:
        return (self.base / key).exists()


def get_storage() -> LocalStorage:
    return LocalStorage(get_settings().STORAGE_DIR)
