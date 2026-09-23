"""
app/services/verification/step6_fusion.py — Weighted confidence score aggregation.

Aggregates scores from Steps 2–5 into a single confidence score.
Steps 1 & 2 are HARD FAIL gates — if they fail, the pipeline never reaches here.

Fusion formula:
  weighted_score = (GPS × 0.25) + (Angle × 0.20) + (Landmarks × 0.30) + (Repair × 0.25)

The landmark step has the highest weight (0.30) because it's the strongest
anti-gaming signal — it's the hardest to fake without being at the exact location.

Outcome thresholds (all configurable in .env / admin config):
  score ≥ FUSION_AUTO_PASS     (0.80) → auto_pass
  score ≥ FUSION_OFFICER_REVIEW (0.50) → officer_review
  score <  FUSION_OFFICER_REVIEW        → auto_reject

Output:
  {
    "fusion_score": float,        # 0.0–1.0
    "outcome": str,               # auto_pass | officer_review | auto_reject
    "rejection_reason": str | None
  }
"""

from app.core.config import settings

# Fusion weights — must sum to 1.0
WEIGHTS = {
    "gps": 0.25,
    "angle": 0.20,
    "landmarks": 0.30,
    "repair": 0.25,
}


def run(
    step2_gps: dict,
    step3_angle: dict,
    step4_landmarks: dict,
    step5_repair: dict,
    vlm_result: dict = None,
) -> dict:
    """
    Runs Step 6: Fusion Score Aggregation with Vision-LLM Co-Pilot.

    Args:
        step2_gps:       Result dict from step2_gps.run()
        step3_angle:     Result dict from step3_angle.run()
        step4_landmarks: Result dict from step4_landmark.run()
        step5_repair:    Result dict from step5_repair.run()
        vlm_result:      Result dict from vlm_verifier.evaluate_repair()

    Returns:
        A dict with fusion_score, outcome, and rejection_reason.
    """
    gps_score = float(step2_gps.get("score", 0.0))
    angle_score = float(step3_angle.get("score", 0.0))
    landmark_score = float(step4_landmarks.get("score", 0.0))
    repair_score = float(step5_repair.get("score", 0.0))

    base_fusion = (
        WEIGHTS["gps"] * gps_score
        + WEIGHTS["angle"] * angle_score
        + WEIGHTS["landmarks"] * landmark_score
        + WEIGHTS["repair"] * repair_score
    )

    auto_pass_threshold = settings.fusion_auto_pass
    officer_review_threshold = settings.fusion_officer_review

    # Default outcomes based on classical CV
    if base_fusion >= auto_pass_threshold:
        outcome = "auto_pass"
        rejection_reason = None
    elif base_fusion >= officer_review_threshold:
        outcome = "officer_review"
        rejection_reason = _build_review_reason(
            gps_score, angle_score, landmark_score, repair_score, base_fusion
        )
    else:
        outcome = "auto_reject"
        rejection_reason = _build_rejection_reason(
            gps_score, angle_score, landmark_score, repair_score, base_fusion,
            step2_gps, step3_angle, step4_landmarks, step5_repair
        )

    fusion_score = round(base_fusion, 4)

    # ── Vision-LLM Co-Pilot Enforcement ──────────────────────────────────────
    if vlm_result:
        vlm_verdict = vlm_result.get("overall_verdict")
        vlm_lm_match = vlm_result.get("landmark_match")
        vlm_summary = vlm_result.get("summary_for_officer") or ""
        vlm_conf = float(vlm_result.get("confidence", 0.8))

        # DECISION RULE: If landmark_match is "no", must reject_different_location
        if vlm_lm_match == "no" or vlm_verdict == "reject_different_location":
            outcome = "auto_reject"
            rejection_reason = vlm_summary or "Anti-Fraud: Background landmarks do not match citizen complaint (substitution attack)."
            fusion_score = min(fusion_score, 0.25)
        elif vlm_verdict == "reject_no_repair_evidence":
            outcome = "auto_reject"
            rejection_reason = vlm_summary or "Rejected: No repair evidence found at the defect location."
            fusion_score = min(fusion_score, 0.35)
        elif vlm_verdict == "genuine_match":
            # Vision-LLM confirms location landmarks and repair evidence
            # This enables passing gallery uploads and AI-inpainted repairs
            outcome = "auto_pass"
            rejection_reason = None
            fusion_score = max(fusion_score, round(vlm_conf, 4))
        elif vlm_verdict == "needs_human_review":
            if outcome == "auto_pass":
                outcome = "officer_review"
                rejection_reason = vlm_summary or "Visual ambiguity or missing metadata requires municipal engineer review."

    return {
        "fusion_score": fusion_score,
        "outcome": outcome,
        "rejection_reason": rejection_reason,
    }


def _build_rejection_reason(
    gps, angle, landmark, repair, score,
    s2, s3, s4, s5,
) -> str:
    """Builds a human-readable rejection message highlighting the weakest steps."""
    weak = []
    if gps < 0.5:
        weak.append(f"GPS ({s2.get('reason', '')})")
    if angle < 0.5:
        weak.append(f"Angle ({s3.get('reason', '')})")
    if landmark < 0.5:
        weak.append(f"Landmark ({s4.get('reason', '')})")
    if repair < 0.5:
        weak.append(f"Repair ({s5.get('reason', '')})")

    reasons = "; ".join(weak) if weak else "Overall confidence too low"
    return f"Auto-rejected (fusion score: {score:.2f}). Failed checks: {reasons}"


def _build_review_reason(gps, angle, landmark, repair, score) -> str:
    return (
        f"Fusion score {score:.2f} is below auto-pass threshold "
        f"({settings.fusion_auto_pass}). "
        f"GPS={gps:.2f}, Angle={angle:.2f}, Landmarks={landmark:.2f}, Repair={repair:.2f}. "
        f"Manual officer review required."
    )
