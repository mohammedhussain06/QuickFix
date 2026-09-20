"""
app/services/auth_service.py — Authentication business logic.

Responsibilities:
  - Register new users
  - Authenticate users and issue JWTs
  - Refresh and revoke tokens
  - Admin user management (list, update, deactivate)

All DB queries are here. API routes call this service and receive
plain Python objects or Pydantic models back.
"""

from datetime import timedelta, timezone, datetime
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InvalidCredentialsError, NotFoundError
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    blacklist_token,
)
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse
from app.schemas.admin import AdminUserResponse, UserManageRequest


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ── Register ──────────────────────────────────────────────────────────────
    async def register(self, body: RegisterRequest) -> UserResponse:
        """Creates a new user account. Raises 409 if email already exists."""
        # Check for existing email
        existing = await self.db.scalar(select(User).where(User.email == body.email))
        if existing:
            from fastapi import HTTPException
            raise HTTPException(status_code=409, detail="Email already registered")

        user = User(
            email=body.email,
            full_name=body.full_name,
            password_hash=hash_password(body.password),
            role=body.role,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return UserResponse.model_validate(user)

    # ── Login ─────────────────────────────────────────────────────────────────
    async def login(self, body: LoginRequest) -> TokenResponse:
        """
        Validates credentials and returns a JWT token pair.
        Accepts email, phone number, or crew/badge ID as the identifier.
        """
        ident = body.identifier.strip()

        # Try exact email match first
        user = await self.db.scalar(select(User).where(User.email == ident))

        # Then try phone number (stored in profile or as alt field on User if available)
        if not user:
            user = await self.db.scalar(select(User).where(User.phone == ident))

        # Then try crew_id / badge_id columns if they exist on the model
        if not user:
            try:
                user = await self.db.scalar(select(User).where(User.crew_id == ident))
            except Exception:
                pass

        if not user or not verify_password(body.password, user.password_hash):
            raise InvalidCredentialsError()
        if not user.is_active:
            raise InvalidCredentialsError()

        access = create_access_token(user.id, user.role)
        refresh = create_refresh_token(user.id)
        return TokenResponse(access_token=access, refresh_token=refresh)


    # ── Refresh tokens ────────────────────────────────────────────────────────
    @staticmethod
    async def refresh(body: RefreshRequest) -> TokenResponse:
        """Validates refresh token and returns a new token pair."""
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            from fastapi import HTTPException
            raise HTTPException(status_code=401, detail="Expected refresh token")

        user_id = UUID(payload["sub"])
        # NOTE: In a full implementation, look up the user's current role from DB
        # For now we re-use the same role from the refresh payload if stored,
        # or default to citizen (extend payload to include role for production)
        access = create_access_token(user_id, payload.get("role", "citizen"))
        new_refresh = create_refresh_token(user_id)

        # Blacklist the used refresh token (one-time use)
        exp = payload.get("exp", 0)
        remaining = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
        await blacklist_token(body.refresh_token, remaining)

        return TokenResponse(access_token=access, refresh_token=new_refresh)

    # ── Logout ────────────────────────────────────────────────────────────────
    @staticmethod
    async def logout(refresh_token: str) -> None:
        """Blacklists the refresh token immediately."""
        payload = decode_token(refresh_token)
        exp = payload.get("exp", 0)
        remaining = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
        await blacklist_token(refresh_token, remaining)

    # ── Admin: list users ─────────────────────────────────────────────────────
    async def list_users(
        self, role: str | None, page: int, page_size: int
    ) -> list[AdminUserResponse]:
        query = select(User)
        if role:
            query = query.where(User.role == role)
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.scalars(query)
        return [AdminUserResponse.model_validate(u) for u in result.all()]

    # ── Admin: update user ────────────────────────────────────────────────────
    async def update_user(self, user_id: UUID, body: UserManageRequest) -> AdminUserResponse:
        user = await self.db.get(User, user_id)
        if not user:
            raise NotFoundError("User")
        if body.full_name is not None:
            user.full_name = body.full_name
        if body.role is not None:
            user.role = body.role
        if body.is_active is not None:
            user.is_active = body.is_active
        await self.db.flush()
        await self.db.refresh(user)
        return AdminUserResponse.model_validate(user)

    # ── Admin: deactivate user ────────────────────────────────────────────────
    async def deactivate_user(self, user_id: UUID) -> None:
        user = await self.db.get(User, user_id)
        if not user:
            raise NotFoundError("User")
        user.is_active = False
