"""
alembic/versions/001_initial_schema.py — Initial database schema migration.

Creates all tables:
  - users
  - complaints (with PostGIS geometry)
  - repairs
  - verifications
  - audit_logs

Run with: alembic upgrade head
"""

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable PostGIS extension
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    # ── users ─────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(20), nullable=False, server_default="citizen"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # ── complaints ────────────────────────────────────────────────────────────
    op.create_table(
        "complaints",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("citizen_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="pending"),
        sa.Column("location", Geometry(geometry_type="POINT", srid=4326), nullable=True),
        sa.Column("address_text", sa.Text, nullable=True),
        sa.Column("gps_lat", sa.Float, nullable=False),
        sa.Column("gps_lng", sa.Float, nullable=False),
        sa.Column("heading", sa.Float, nullable=True),
        sa.Column("tilt", sa.Float, nullable=True),
        sa.Column("before_photo_url", sa.Text, nullable=True),
        sa.Column("before_photo_hash", sa.String(64), nullable=True),
        sa.Column("severity_score", sa.Float, nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_complaints_citizen_id", "complaints", ["citizen_id"])
    op.create_index("ix_complaints_status", "complaints", ["status"])

    # ── repairs ───────────────────────────────────────────────────────────────
    op.create_table(
        "repairs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("complaint_id", UUID(as_uuid=True), sa.ForeignKey("complaints.id"), nullable=False),
        sa.Column("contractor_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("after_photo_url", sa.Text, nullable=True),
        sa.Column("after_photo_hash", sa.String(64), nullable=True),
        sa.Column("after_gps_lat", sa.Float, nullable=True),
        sa.Column("after_gps_lng", sa.Float, nullable=True),
        sa.Column("after_heading", sa.Float, nullable=True),
        sa.Column("after_tilt", sa.Float, nullable=True),
        sa.Column("sla_deadline", sa.DateTime(timezone=True), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_repairs_complaint_id", "repairs", ["complaint_id"])
    op.create_index("ix_repairs_contractor_id", "repairs", ["contractor_id"])

    # ── verifications ─────────────────────────────────────────────────────────
    op.create_table(
        "verifications",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("repair_id", UUID(as_uuid=True), sa.ForeignKey("repairs.id"), nullable=False, unique=True),
        sa.Column("step1_integrity", JSONB, nullable=True),
        sa.Column("step2_gps", JSONB, nullable=True),
        sa.Column("step3_angle", JSONB, nullable=True),
        sa.Column("step4_landmarks", JSONB, nullable=True),
        sa.Column("step5_repair", JSONB, nullable=True),
        sa.Column("step6_fusion", sa.Float, nullable=True),
        sa.Column("outcome", sa.String(20), nullable=True),
        sa.Column("rejection_reason", sa.Text, nullable=True),
        sa.Column("officer_override", sa.Boolean, server_default="false"),
        sa.Column("officer_notes", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_verifications_outcome", "verifications", ["outcome"])

    # ── audit_logs ────────────────────────────────────────────────────────────
    op.create_table(
        "audit_logs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("actor_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("action", sa.String(60), nullable=False),
        sa.Column("entity_type", sa.String(30), nullable=False),
        sa.Column("entity_id", UUID(as_uuid=True), nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("sha256_payload", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_audit_logs_action", "audit_logs", ["action"])
    op.create_index("ix_audit_logs_entity_id", "audit_logs", ["entity_id"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("verifications")
    op.drop_table("repairs")
    op.drop_table("complaints")
    op.drop_table("users")
    op.execute("DROP EXTENSION IF EXISTS postgis")
