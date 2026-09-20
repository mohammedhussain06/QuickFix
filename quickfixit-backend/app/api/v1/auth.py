"""
app/api/v1/auth.py — Authentication endpoints.

Endpoints:
  POST /auth/register   — self-register as citizen or contractor
  POST /auth/login      — get access + refresh JWT (accepts email, phone, or crew ID)
  GET  /auth/me         — return profile for the current access token
  POST /auth/refresh    — rotate tokens
  POST /auth/logout     — blacklist refresh token

Rule: NO business logic here. All logic delegated to AuthService.
"""

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.dependencies import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    body: RegisterRequest,
    db: AsyncSession = Depends(get_session),
):
    """Register a new citizen or contractor account."""
    return await AuthService(db).register(body)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_session),
):
    """Authenticate and receive access + refresh tokens. Accepts email, phone, or crew ID."""
    return await AuthService(db).login(body)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Return the profile of the currently authenticated user."""
    user = await db.get(User, UUID(current_user["sub"]))
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    # Pydantic UserResponse.id is str; SQLAlchemy stores it as UUID — convert explicitly
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=getattr(user, "phone", None),
        crew_id=getattr(user, "crew_id", None),
    )



@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(body: RefreshRequest):
    """Exchange a valid refresh token for a new token pair."""
    return await AuthService.refresh(body)


@router.post("/logout", status_code=204)
async def logout(body: RefreshRequest):
    """Blacklist the refresh token to invalidate the session."""
    await AuthService.logout(body.refresh_token)

