"""
app/services/verification/step3_angle.py — Camera angle and perspective check.

Anti-gaming purpose:
  Even if a contractor is at the right GPS location, photographing from a
  completely different angle (e.g., 90° rotated) may hide that the repaired
  area doesn't actually match the reported pothole. The homography check
  ensures the road surface was photographed from the same perspective.

Checks:
  1. Heading (compass) delta:  |before_heading - after_heading| vs. tolerance
  2. Tilt (phone pitch) delta: |before_tilt - after_tilt| vs. tolerance
  3. Homography matrix:        OpenCV findHomography on the full image pair;
                               the reprojection error measures perspective change.
                               Low error = same viewpoint.

Output (dict — stored as JSONB):
  {
    "passed": bool,
    "score": float,
    "reason": str,
    "heading_diff": float | None,
    "tilt_diff": float | None,
    "homography_score": float | None   # normalised 0–1 (1 = identical perspective)
  }
"""

from io import BytesIO
from typing import Optional

import cv2
import numpy as np
from PIL import Image

from app.core.config import settings


def run(
    before_photo_bytes: bytes,
    after_photo_bytes: bytes,
    before_heading: Optional[float],
    after_heading: Optional[float],
    before_tilt: Optional[float],
    after_tilt: Optional[float],
) -> dict:
    """
    Runs Step 3: Angle / Perspective Check.
    """
    result = {
        "passed": False,
        "score": 0.0,
        "reason": "",
        "heading_diff": None,
        "tilt_diff": None,
        "homography_score": None,
    }

    scores = []

    # ── Check 1: Heading delta ────────────────────────────────────────────────
    if before_heading is not None and after_heading is not None:
        heading_diff = abs(_angle_diff(before_heading, after_heading))
        result["heading_diff"] = round(heading_diff, 2)
        heading_score = max(0.0, 1.0 - heading_diff / settings.heading_tolerance_degrees)
        scores.append(heading_score)
    else:
        result["heading_diff"] = None
        scores.append(0.7)  # neutral if sensor data not available

    # ── Check 2: Tilt delta ───────────────────────────────────────────────────
    if before_tilt is not None and after_tilt is not None:
        tilt_diff = abs(before_tilt - after_tilt)
        result["tilt_diff"] = round(tilt_diff, 2)
        tilt_score = max(0.0, 1.0 - tilt_diff / settings.tilt_tolerance_degrees)
        scores.append(tilt_score)
    else:
        result["tilt_diff"] = None
        scores.append(0.7)  # neutral if sensor data not available

    # ── Check 3: Homography reprojection error ────────────────────────────────
    homography_score = _compute_homography_score(before_photo_bytes, after_photo_bytes)
    result["homography_score"] = round(homography_score, 4)
    scores.append(homography_score)

    # ── Aggregate ─────────────────────────────────────────────────────────────
    final_score = sum(scores) / len(scores)
    result["score"] = round(final_score, 4)
    result["passed"] = final_score >= 0.4  # soft threshold; fusion step makes final call

    result["reason"] = (
        f"Angle check passed (score: {final_score:.2f})."
        if result["passed"]
        else f"Angle/perspective mismatch (score: {final_score:.2f}). "
             f"Heading diff: {result['heading_diff']}°, Tilt diff: {result['tilt_diff']}°."
    )
    return result


def _angle_diff(a: float, b: float) -> float:
    """Computes the shortest circular difference between two compass angles (0–360)."""
    diff = abs(a - b) % 360
    return diff if diff <= 180 else 360 - diff


def _compute_homography_score(before_bytes: bytes, after_bytes: bytes) -> float:
    """
    Computes a homography matrix between the two images using ORB keypoints.
    Returns a score 0–1 where 1 means identical perspective.

    Method:
      - Detect ORB keypoints in both images
      - Match with BFMatcher + ratio test
      - Compute homography via RANSAC
      - Use the number of inliers as a proxy for perspective similarity
    """
    try:
        before_gray = _to_gray(before_bytes)
        after_gray = _to_gray(after_bytes)

        orb = cv2.ORB_create(nfeatures=500)
        kp1, des1 = orb.detectAndCompute(before_gray, None)
        kp2, des2 = orb.detectAndCompute(after_gray, None)

        if des1 is None or des2 is None or len(kp1) < 4 or len(kp2) < 4:
            return 0.5  # Not enough features — neutral score

        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        matches = bf.knnMatch(des1, des2, k=2)

        # Lowe's ratio test
        good = [m for m, n in matches if m.distance < 0.75 * n.distance]

        if len(good) < 4:
            return 0.3  # Can't compute homography

        src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
        dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

        _, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

        if mask is None:
            return 0.3

        inlier_ratio = mask.ravel().tolist().count(1) / len(good)
        return round(inlier_ratio, 4)

    except Exception:
        return 0.5  # Fail gracefully — don't crash the pipeline


def _to_gray(photo_bytes: bytes) -> np.ndarray:
    """Converts raw photo bytes to an OpenCV grayscale array."""
    img = Image.open(BytesIO(photo_bytes)).convert("RGB")
    arr = np.array(img)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
