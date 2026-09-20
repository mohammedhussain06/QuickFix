"""
app/core/security.py — Authentication and authorisation utilities.

Responsibilities:
  - JWT token creation and decoding
  - Password hashing and verification (bcrypt)
  - RBAC dependency factory: require_role(...)
  - Token blacklist check via Redis
  - Nothing else — no DB queries, no business logic
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

try:
    import redis.asyncio as aioredis
except ImportError:
    aioredis = None

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings

# ── Password hashing (bcrypt direct) ─────────────────────────────────────────


def hash_password(plain: str) -> str:
    """Returns a bcrypt hash of the plain-text password."""
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Returns True if plain matches the hashed password."""
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


# ── JWT ───────────────────────────────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def create_access_token(user_id: UUID, role: str) -> str:
    """Creates a short-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": str(user_id), "role": role, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(user_id: UUID) -> str:
    """Creates a long-lived JWT refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.refresh_token_expire_days
    )
    payload = {"sub": str(user_id), "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    """
    Decodes and validates a JWT token.
    Raises HTTPException 401 on any failure.
    """
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── Token blacklist (Redis in production, in-memory for demo/local) ────────────
_in_memory_blacklist: set[str] = set()
_redis_client: Optional[object] = None


async def get_redis():
    global _redis_client
    if aioredis is None or not settings.redis_url:
        return None
    if _redis_client is None:
        try:
            _redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
        except Exception:
            return None
    return _redis_client


async def blacklist_token(token: str, expires_in_seconds: int) -> None:
    """Adds a refresh token to the blacklist on logout."""
    r = await get_redis()
    if r is not None:
        try:
            await r.setex(f"blacklist:{token}", expires_in_seconds, "1")
            return
        except Exception:
            pass
    _in_memory_blacklist.add(token)


async def is_token_blacklisted(token: str) -> bool:
    r = await get_redis()
    if r is not None:
        try:
            return await r.exists(f"blacklist:{token}") == 1
        except Exception:
            pass
    return token in _in_memory_blacklist



# ── Current user dependency ───────────────────────────────────────────────────
async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    FastAPI dependency: decodes the Bearer token and returns the payload.
    Use in endpoints via:  current_user = Depends(get_current_user)
    """
    if await is_token_blacklisted(token):
        raise HTTPException(status_code=401, detail="Token has been revoked")
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Expected access token")
    return payload


# ── RBAC dependency factory ───────────────────────────────────────────────────
def require_role(*allowed_roles: str):
    """
    Returns a FastAPI dependency that enforces role-based access.

    Usage:
        @router.get("/admin-only")
        async def admin_endpoint(user=Depends(require_role("admin"))):
            ...
    """
    async def _check(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {list(allowed_roles)}",
            )
        return current_user
    return _check
