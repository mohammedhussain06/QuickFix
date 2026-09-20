"""
app/services/verification/step4_landmark.py — Background landmark matching.

Anti-gaming purpose (THE KEY ANTI-FRAUD STEP):
  This is what stops a contractor from photographing a DIFFERENT already-fixed pothole
  even if they spoof the GPS and take a correct-angled photo. The background landmarks
  (curbs, signs, buildings, road markings) will NOT match the original scene.

Method:
  1. Mask the centre of both images (where the pothole would be) to exclude it.
     We want to match the BACKGROUND, not the pothole/repair itself.
  2. Detect ORB/SIFT keypoints in the background region of both images.
  3. Match keypoints using BFMatcher with Lowe's ratio test.
  4. Apply RANSAC to remove outlier matches (noise/coincidental matches).
  5. Compute inlier_ratio = RANSAC_inliers / total_good_matches.
     - High ratio → same background scene → same location
     - Low ratio → different background → DIFFERENT LOCATION

Output (dict — stored as JSONB):
  {
    "passed": bool,
    "score": float,         # = inlier_ratio (0–1)
    "reason": str,
    "match_count": int,     # total ORB/SIFT good matches
    "inlier_count": int,    # matches surviving RANSAC
    "inlier_ratio": float   # inlier_count / match_count
  }
"""

from io import BytesIO
from typing import Optional

import cv2
import numpy as np
from PIL import Image

from app.core.config import settings


# How much of the image centre to mask (as fraction of image dimensions)
CENTRE_MASK_FRACTION = 0.35


def run(before_photo_bytes: bytes, after_photo_bytes: bytes) -> dict:
    """
    Runs Step 4: Landmark Feature Matching.

    Args:
        before_photo_bytes: Raw bytes of the original pothole report photo.
        after_photo_bytes:  Raw bytes of the contractor's repair photo.

    Returns:
        A dict with step result fields.
    """
    before_gray = _to_gray_masked(before_photo_bytes)
    after_gray = _to_gray_masked(after_photo_bytes)

    # ── Feature detection: ORB (fast, licence-free alternative to SIFT) ───────
    orb = cv2.ORB_create(nfeatures=1000)
    kp1, des1 = orb.detectAndCompute(before_gray, None)
    kp2, des2 = orb.detectAndCompute(after_gray, None)

    if des1 is None or des2 is None or len(kp1) < 8 or len(kp2) < 8:
        return {
            "passed": False,
            "score": 0.0,
            "reason": "Not enough landmark features detected in one or both photos.",
            "match_count": 0,
            "inlier_count": 0,
            "inlier_ratio": 0.0,
        }

    # ── Matching with Lowe's ratio test ───────────────────────────────────────
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
    raw_matches = bf.knnMatch(des1, des2, k=2)
    good_matches = [m for m, n in raw_matches if m.distance < 0.75 * n.distance]

    if len(good_matches) < 4:
        return {
            "passed": False,
            "score": 0.0,
            "reason": "Too few landmark feature matches — likely a different location.",
            "match_count": len(good_matches),
            "inlier_count": 0,
            "inlier_ratio": 0.0,
        }

    # ── RANSAC to filter outliers ─────────────────────────────────────────────
    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

    _, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

    inlier_count = int(mask.ravel().tolist().count(1)) if mask is not None else 0
    inlier_ratio = inlier_count / len(good_matches) if good_matches else 0.0

    # ── Evaluate against thresholds ───────────────────────────────────────────
    min_matches = settings.landmark_min_matches
    min_ratio = settings.landmark_min_inlier_ratio
    passed = inlier_count >= min_matches and inlier_ratio >= min_ratio

    reason = (
        f"Landmarks match: {inlier_count} inliers ({inlier_ratio:.1%}). Same location confirmed."
        if passed
        else (
            f"LANDMARK MISMATCH: Only {inlier_count} inlier matches ({inlier_ratio:.1%}). "
            f"Required: ≥{min_matches} matches at ≥{min_ratio:.0%} inlier ratio. "
            f"Background scene does not match — possible different location."
        )
    )

    return {
        "passed": passed,
        "score": round(inlier_ratio, 4),
        "reason": reason,
        "match_count": len(good_matches),
        "inlier_count": inlier_count,
        "inlier_ratio": round(inlier_ratio, 4),
    }


def _to_gray_masked(photo_bytes: bytes) -> np.ndarray:
    """
    Converts photo to grayscale and masks the centre region (where pothole would be).
    This forces the feature matcher to focus on BACKGROUND landmarks only.
    """
    img = Image.open(BytesIO(photo_bytes)).convert("RGB")
    arr = np.array(img)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

    h, w = gray.shape
    cx, cy = w // 2, h // 2
    mask_w = int(w * CENTRE_MASK_FRACTION)
    mask_h = int(h * CENTRE_MASK_FRACTION)

    # Black out the centre (pothole region) so it doesn't contribute to matching
    gray[cy - mask_h:cy + mask_h, cx - mask_w:cx + mask_w] = 0

    return gray
