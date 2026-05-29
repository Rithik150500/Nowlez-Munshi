"""Dialect-portable column types.

Postgres is the production dialect; SQLite is the unit-test dialect. ``UUIDType``
is a ``TypeDecorator`` (not a plain ``with_variant``) so UUIDs round-trip as real
``uuid.UUID`` objects on SQLite — essential for identity-map correctness in tests.
"""
from __future__ import annotations

import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.types import JSON, TypeDecorator


class _UUIDType(TypeDecorator):
    """Native ``UUID`` on Postgres; ``String(36)`` with str<->UUID coercion on SQLite."""

    impl = UUID(as_uuid=True)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "sqlite":
            return dialect.type_descriptor(String(36))
        return dialect.type_descriptor(UUID(as_uuid=True))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "sqlite":
            return str(value) if isinstance(value, uuid.UUID) else value
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "sqlite" and isinstance(value, str):
            return uuid.UUID(value)
        return value


UUIDType = _UUIDType()
JSONBType = JSONB().with_variant(JSON(), "sqlite")
INETType = INET().with_variant(String(45), "sqlite")
