"""
app/services/verification/step1_integrity.py — Duplicate photo detection & timestamp check.

Anti-gaming purpose:
  Prevents a contractor from reusing an old repair photo that already passed verification,
  or submitting a photo taken before the pothole was even reported.

Checks:
  1. Perceptual hash (pHash) of the after-photo vs. ALL known hashes in the DB
     → Hamming distance < threshold means the photo is a known duplicate → REJECT
  2. EXIF timestamp of the after-photo must be >= complaint.created_at
     → A photo taken before the pothole was reported is impossible to be a repair → REJECT

Output (dict — stored as JSONB in the verification table):
  {
    "passed": bool,
    "score": float,          # 1.0 if passed, 0.0 if hard fail
    "reason": str,
    "hamming_distance": int | None,
    "is_duplicate": bool,
    "timestamp_valid": bool
  }
"""

from datetime import datetime, timezone
from io import BytesIO
from typing import Optional

import imagehash
from PIL import Image, ExifTags

from app.core.config import settings


def run(
    after_photo_bytes: bytes,
    after_photo_hash: str,          # pre-computed pHash string
    all_known_hashes: list[str],    # pHash strings of ALL photos already in DB
    complaint_created_at: datetime,
) -> dict:
    """
    Runs Step 1: Integrity Check.

    Args:
        after_photo_bytes:    Raw bytes of the contractor's submitted after-photo.
        after_photo_hash:     Pre-computed pHash of the after-photo.
        all_known_hashes:     List of all pHash strings already stored in the DB.
        complaint_created_at: When the original pothole complaint was submitted.

    Returns:
        A dict with step result fields.
    """
    result = {
        "passed": False,
        "score": 0.0,
        "reason": "",
        "hamming_distance": None,
        "is_duplicate": False,
        "timestamp_valid": False,
    }

    # ── Check 1: pHash duplicate detection ───────────────────────────────────
    after_hash = imagehash.hex_to_hash(after_photo_hash)
    threshold = settings.phash_hamming_threshold

    min_distance: Optional[int] = None
    for known_hash_str in all_known_hashes:
        known_hash = imagehash.hex_to_hash(known_hash_str)
        distance = after_hash - known_hash   # Hamming distance
        if min_distance is None or distance < min_distance:
            min_distance = distance

    result["hamming_distance"] = min_distance
    is_duplicate = min_distance is not None and min_distance < threshold
    result["is_duplicate"] = is_duplicate

    if is_duplicate:
        result["reason"] = (
            f"Duplicate photo detected (Hamming distance {min_distance} < threshold {threshold}). "
            f"This image matches a previously submitted photo — submission rejected."
        )
        return result  # Hard fail — no need to check further

    # ── Check 2: EXIF timestamp validation ───────────────────────────────────
    timestamp_valid = _check_exif_timestamp(after_photo_bytes, complaint_created_at)
    result["timestamp_valid"] = timestamp_valid

    if not timestamp_valid:
        result["reason"] = (
            "Photo timestamp precedes the complaint creation date. "
            "The after-photo was taken before the pothole was even reported."
        )
        return result  # Hard fail

    # ── All checks passed ─────────────────────────────────────────────────────
    result["passed"] = True
    result["score"] = 1.0
    result["reason"] = "Photo is unique and timestamp is valid."
    return result


def _check_exif_timestamp(photo_bytes: bytes, complaint_created_at: datetime) -> bool:
    """
    Reads the EXIF DateTimeOriginal tag and checks it's after complaint creation.
    Returns True if timestamp is valid or if EXIF data is not available.
    (Absence of EXIF is not penalised — many apps strip metadata.)
    """
    try:
        img = Image.open(BytesIO(photo_bytes))
        exif_data = img._getexif()
        if not exif_data:
            return True  # No EXIF — give benefit of the doubt

        # Map EXIF tag IDs to names
        exif = {ExifTags.TAGS.get(k, k): v for k, v in exif_data.items()}
        dt_str = exif.get("DateTimeOriginal") or exif.get("DateTime")

        if not dt_str:
            return True  # No timestamp in EXIF — pass

        # EXIF format: "YYYY:MM:DD HH:MM:SS"
        photo_time = datetime.strptime(dt_str, "%Y:%m:%d %H:%M:%S").replace(
            tzinfo=timezone.utc
        )
        return photo_time >= complaint_created_at

    except Exception:
        # If we can't read EXIF, don't penalise — focus on GPS/landmark checks
        return True
