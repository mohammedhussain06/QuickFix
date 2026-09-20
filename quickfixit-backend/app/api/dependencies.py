"""
app/api/dependencies.py — Shared FastAPI dependencies.

Centralises all reusable Depends() factories so that individual
route files don't import from each other.

Rules:
  - These dependencies are purely about request context extraction.
  - No business logic here — that lives in services/.
"""

from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, require_role


# ── Re-export for convenient single import in route files ─────────────────────
async def get_session(db: AsyncSession = Depends(get_db)) -> AsyncSession:
    """Yields an async database session for the current request."""
    return db


# ── Role-gated current user shortcuts ────────────────────────────────────────
def citizen_required():
    """Dependency: only citizens and above can access."""
    return Depends(require_role("citizen", "contractor", "officer", "admin"))


def contractor_required():
    """Dependency: only contractors can access."""
    return Depends(require_role("contractor"))


def officer_required():
    """Dependency: only officers and admins can access."""
    return Depends(require_role("officer", "admin"))


def admin_required():
    """Dependency: only admins can access."""
    return Depends(require_role("admin"))


# ── Current user UUID helper ──────────────────────────────────────────────────
def get_current_user_id(current_user: dict = Depends(get_current_user)) -> UUID:
    """Extracts the UUID of the currently authenticated user from their JWT payload."""
    return UUID(current_user["sub"])
