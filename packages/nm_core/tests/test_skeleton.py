"""Skeleton guard: the core package and every bounded context import cleanly."""
import importlib

import pytest

CONTEXTS = [
    "config", "db", "observability", "identity", "ecourts",
    "cases", "messaging", "notifications", "billing", "ai",
]


def test_core_imports():
    assert importlib.import_module("nm_core").__version__ == "0.1.0"


@pytest.mark.parametrize("name", CONTEXTS)
def test_context_imports(name):
    importlib.import_module(f"nm_core.{name}")
