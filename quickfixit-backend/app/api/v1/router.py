"""
app/api/v1/router.py — Aggregates all v1 sub-routers.

A single import in main.py mounts everything under /api/v1.
Adding a new portal = add one include_router line here.
"""

from fastapi import APIRouter

from app.api.v1 import auth, complaints, contractor, officer, admin, verification_api

api_router = APIRouter()

api_router.include_router(auth.router,             prefix="/auth",         tags=["Auth"])
api_router.include_router(complaints.router,       prefix="/complaints",   tags=["Citizen — Complaints"])
api_router.include_router(contractor.router,       prefix="/contractor",   tags=["Contractor — Jobs"])
api_router.include_router(officer.router,          prefix="/officer",      tags=["Officer — Review"])
api_router.include_router(admin.router,            prefix="/admin",        tags=["Admin"])
api_router.include_router(verification_api.router, prefix="/verification", tags=["Verification — AI Analyst"])
