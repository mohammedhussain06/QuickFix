"""
app/core/database.py — Async database engine and session factory.

Responsibilities:
  - Creates the async SQLAlchemy engine
  - Provides an async session factory
  - Provides Base class for all ORM models
  - Provides `create_db_tables()` called on startup
  - Nothing else — no models, no business logic
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text


from app.core.config import settings

# ── Engine ────────────────────────────────────────────────────────────────────
if "sqlite" in settings.database_url:
    engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
    )


# ── Session factory ───────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,        # keep objects usable after commit
    autoflush=False,
)

# ── Declarative Base ──────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """All ORM models must inherit from this Base."""
    pass


# ── Startup helper ────────────────────────────────────────────────────────────
async def create_db_tables() -> None:
    """
    Creates all tables defined in models/ if they don't exist.
    Also applies lightweight ALTER TABLE migrations for columns added after
    initial table creation (safe to run repeatedly — errors are suppressed).
    In production, prefer Alembic migrations instead.
    """
    # Import all models so Base.metadata knows about them
    import app.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # ── Lightweight column migrations for existing DBs ────────────────────────
    # These ALTER TABLE statements are no-ops if the column already exists.
    _migrations = [
        "ALTER TABLE users ADD COLUMN phone VARCHAR(30)",
        "ALTER TABLE users ADD COLUMN crew_id VARCHAR(50)",
    ]
    async with engine.begin() as conn:
        for stmt in _migrations:
            try:
                await conn.execute(text(stmt))
            except Exception:
                pass  # Column already exists — silently continue



# ── Dependency: yields a DB session per request ───────────────────────────────
async def get_db() -> AsyncSession:
    """FastAPI dependency — provides one async session per HTTP request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ── Demo data seeder (idempotent) ─────────────────────────────────────────────
async def seed_demo_data() -> None:
    """
    Creates the three demo accounts expected by the frontend if they don't exist.
    Safe to call on every startup — skips any user whose email already exists.

    Credentials:
      Citizen   — email: citizen@quickfixit.gov   / phone: +91 98201 54829 / pw: password123
      Contractor — email: contractor@apex.com      / crew_id: APEX-CREW-04  / pw: password123
      Officer   — email: officer@bmc.gov.in        / crew_id: BMC-ENG-8402  / pw: password123
    """
    from sqlalchemy import select
    from app.models.user import User
    from app.core.security import hash_password

    demo_users = [
        {
            "email": "citizen@quickfixit.gov",
            "full_name": "Elena Vasquez",
            "role": "citizen",
            "phone": "+91 98201 54829",
            "crew_id": None,
            "password": "password123",
        },
        {
            "email": "contractor@apex.com",
            "full_name": "Rajesh Shinde",
            "role": "contractor",
            "phone": "+91 98334 10294",
            "crew_id": "APEX-CREW-04",
            "password": "password123",
        },
        {
            "email": "officer@bmc.gov.in",
            "full_name": "Dr. Arvind Kulkarni",
            "role": "officer",
            "phone": "+91 98190 28471",
            "crew_id": "BMC-ENG-8402",
            "password": "password123",
        },
    ]

    async with AsyncSessionLocal() as session:
        for data in demo_users:
            existing = await session.scalar(select(User).where(User.email == data["email"]))
            if existing:
                continue  # already seeded — skip
            user = User(
                email=data["email"],
                full_name=data["full_name"],
                role=data["role"],
                phone=data["phone"],
                crew_id=data["crew_id"],
                password_hash=hash_password(data["password"]),
            )
            session.add(user)
        await session.commit()
