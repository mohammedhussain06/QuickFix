"""
app/schemas/auth.py — Request/response schemas for authentication endpoints.

Completely independent of SQLAlchemy — these are pure Pydantic models
used for API validation and serialisation only.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Body for POST /auth/register"""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default="citizen", pattern="^(citizen|contractor|officer)$")


class LoginRequest(BaseModel):
    """
    Body for POST /auth/login.
    Accepts either an email address or a short identifier (phone, crew ID, officer badge).
    """
    identifier: str = Field(..., description="Email, phone number, or crew/officer ID")
    password: str


class TokenResponse(BaseModel):
    """Returned on successful login or token refresh"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Body for POST /auth/refresh"""
    refresh_token: str


class UserResponse(BaseModel):
    """Public user info returned after registration or in /auth/me"""
    id: str
    email: str
    full_name: str
    role: str
    # Optional profile fields surfaced to the frontend
    ward: Optional[str] = None
    avatar: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    crew_id: Optional[str] = None

    model_config = {"from_attributes": True}
