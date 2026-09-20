"""
main.py — Application entrypoint.

Responsibilities:
  - Creates the FastAPI application instance
  - Registers all API routers
  - Configures CORS, lifespan events, and global middleware
  - Mounts /static/photos for serving uploaded photos
  - Nothing else — all logic lives in api/, services/, or core/
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import create_db_tables, seed_demo_data


# ── Lifespan: runs on startup and shutdown ────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialise DB tables and seed demo accounts. Shutdown: clean up."""
    await create_db_tables()
    await seed_demo_data()
    yield
    # Add cleanup logic here if needed (e.g., close connection pools)


# ── FastAPI instance ──────────────────────────────────────────────────────────
app = FastAPI(
    title="QuickFix It API",
    description=(
        "Transparent pothole complaint-to-repair tracking platform with "
        "computer-vision-based anti-gaming verification."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS middleware ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount all versioned API routes ────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")

# ── Serve uploaded photos as static files ─────────────────────────────────────
_photos_dir = Path("uploaded_photos")
_photos_dir.mkdir(exist_ok=True)
app.mount("/static/photos", StaticFiles(directory=str(_photos_dir)), name="photos")


from fastapi.responses import RedirectResponse

# ── Root redirect ─────────────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to interactive API documentation."""
    return RedirectResponse(url="/docs")


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    """Simple liveness probe — used by Docker Compose and load balancers."""
    return {"status": "ok", "version": "1.0.0"}
