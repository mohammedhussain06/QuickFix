"""
app/core/storage.py — Photo upload and retrieval.

Demo mode  (storage_backend="local"):
  - Saves photos to a local folder (./uploaded_photos)
  - Returns a direct file:// path as the URL
  - Zero dependencies — no MinIO, no S3

Production mode (storage_backend="minio"):
  - Uploads to MinIO/S3
  - Returns pre-signed time-limited URLs

Switching between modes: just change STORAGE_BACKEND in .env
"""

import io
import uuid
import shutil
from pathlib import Path
from typing import Optional

from app.core.config import settings


# ── LOCAL FILESYSTEM BACKEND (demo) ──────────────────────────────────────────

def _ensure_local_dir() -> Path:
    """Creates the local photo storage directory if it doesn't exist."""
    path = Path(settings.local_storage_path)
    path.mkdir(parents=True, exist_ok=True)
    return path


def _upload_local(file_bytes: bytes) -> str:
    """Saves photo bytes to local disk. Returns the relative file path as key."""
    folder = _ensure_local_dir()
    filename = f"{uuid.uuid4()}.jpg"
    file_path = folder / filename
    file_path.write_bytes(file_bytes)
    return str(file_path)   # stored as the "object key" in DB


def _get_url_local(object_key: str, **kwargs) -> str:
    """For local storage — just return the path as-is (or a /static/ URL)."""
    return f"/static/photos/{Path(object_key).name}"


def _download_local(object_key: str) -> bytes:
    """Reads photo bytes from local disk."""
    return Path(object_key).read_bytes()


# ── MINIO / S3 BACKEND (production) ──────────────────────────────────────────

_minio_client: Optional[object] = None


def _get_minio_client():
    global _minio_client
    if _minio_client is None:
        from minio import Minio
        from minio.error import S3Error
        _minio_client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_root_user,
            secret_key=settings.minio_root_password,
            secure=settings.minio_use_ssl,
        )
        bucket = settings.minio_bucket_photos
        if not _minio_client.bucket_exists(bucket):
            _minio_client.make_bucket(bucket)
    return _minio_client


def _upload_minio(file_bytes: bytes) -> str:
    client = _get_minio_client()
    object_key = f"photos/{uuid.uuid4()}.jpg"
    client.put_object(
        bucket_name=settings.minio_bucket_photos,
        object_name=object_key,
        data=io.BytesIO(file_bytes),
        length=len(file_bytes),
        content_type="image/jpeg",
    )
    return object_key


def _get_url_minio(object_key: str, expires_seconds: int = 3600) -> str:
    from datetime import timedelta
    client = _get_minio_client()
    return client.presigned_get_object(
        bucket_name=settings.minio_bucket_photos,
        object_name=object_key,
        expires=timedelta(seconds=expires_seconds),
    )


def _download_minio(object_key: str) -> bytes:
    client = _get_minio_client()
    response = client.get_object(settings.minio_bucket_photos, object_key)
    return response.read()


# ── Public API (auto-routes based on STORAGE_BACKEND setting) ─────────────────

def upload_photo(file_bytes: bytes, content_type: str = "image/jpeg") -> str:
    """Upload a photo. Returns an object key/path stored in the DB."""
    if settings.storage_backend == "local":
        return _upload_local(file_bytes)
    return _upload_minio(file_bytes)


def get_presigned_url(object_key: str, expires_seconds: int = 3600) -> str:
    """Get a URL to access a stored photo."""
    if settings.storage_backend == "local":
        return _get_url_local(object_key)
    return _get_url_minio(object_key, expires_seconds)


def download_photo(object_key: str) -> bytes:
    """Download raw photo bytes (used by the CV pipeline)."""
    if settings.storage_backend == "local":
        return _download_local(object_key)
    return _download_minio(object_key)
