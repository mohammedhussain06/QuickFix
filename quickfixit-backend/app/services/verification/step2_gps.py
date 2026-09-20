"""
app/services/verification/step2_gps.py — GPS distance check via Haversine formula.

Anti-gaming purpose:
  If a contractor photographs a different (already-fixed) pothole nearby,
  the GPS coordinates captured by the app at photo-time will not match
  the GPS of the original pothole report.

Check:
  Haversine distance between (before_lat, before_lng) and (after_lat, after_lng).
  If distance > gps_tolerance_meters → HARD REJECT (no fusion bypass possible).

Output (dict — stored as JSONB):
  {
    "passed": bool,
    "score": float,       # Continuous: 1.0 at 0m distance, 0.0 at/beyond tolerance
    "reason": str,
    "distance_meters": float
  }
"""

import math

from app.core.config import settings


def run(
    before_lat: float,
    before_lng: float,
    after_lat: float,
    after_lng: float,
) -> dict:
    """
    Runs Step 2: GPS Distance Check.

    Args:
        before_lat/lng: GPS coordinates of the original pothole complaint.
        after_lat/lng:  GPS coordinates captured when the after-photo was taken.

    Returns:
        A dict with step result fields.
    """
    distance_m = _haversine(before_lat, before_lng, after_lat, after_lng)
    tolerance = settings.gps_tolerance_meters

    passed = distance_m <= tolerance

    # Continuous score: 1.0 at exact match, linearly decays to 0.0 at tolerance
    score = max(0.0, 1.0 - (distance_m / tolerance)) if tolerance > 0 else (1.0 if passed else 0.0)

    reason = (
        f"GPS coordinates match (distance: {distance_m:.1f}m, tolerance: {tolerance}m)."
        if passed
        else (
            f"GPS MISMATCH: After-photo taken {distance_m:.1f}m away from the reported pothole. "
            f"Maximum allowed: {tolerance}m. Possible different location."
        )
    )

    return {
        "passed": passed,
        "score": round(score, 4),
        "reason": reason,
        "distance_meters": round(distance_m, 2),
    }


def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Haversine formula — calculates the great-circle distance in metres
    between two GPS coordinates.
    """
    R = 6_371_000  # Earth radius in metres
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
