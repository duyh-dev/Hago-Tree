"""Bridge to the optional `westie` helpers bundled with Hago Tree.

The production code assumes a `westie` package is available (shipped as a
vendored folder or installed dependency) that exposes UI widgets and auth
helpers. This adapter keeps imports optional so the Kivy app still runs in
local dev without the package, while documenting how to use it in production.
"""
from __future__ import annotations

from typing import Any, Callable, Optional

try:
    import westie  # type: ignore
    from westie.auth import login_with_credentials  # type: ignore
    from westie.widgets import GlassCard, PillButton  # type: ignore
except Exception:  # pragma: no cover - defensive import guard
    westie = None
    GlassCard = None
    PillButton = None

    def login_with_credentials(email: str, password: str) -> Optional[dict]:  # type: ignore
        return None


def using_westie() -> bool:
    return westie is not None


def ensure_login(email: str, password: str, fallback: Callable[[str, str], Any]) -> Any:
    """Try `westie` auth first, otherwise use the provided fallback."""
    if westie and login_with_credentials:
        return login_with_credentials(email, password)
    return fallback(email, password)
