"""
app/models/__init__.py

Imports all ORM models so that:
  1. SQLAlchemy's Base.metadata knows about every table
  2. Alembic's env.py can auto-detect schema changes
"""

from app.models.user import User
from app.models.complaint import Complaint
from app.models.repair import Repair
from app.models.verification import Verification
from app.models.audit_log import AuditLog

__all__ = ["User", "Complaint", "Repair", "Verification", "AuditLog"]
