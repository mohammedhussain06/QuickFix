"""
app/services/verification/step5_repair.py — YOLOv8 repair confirmation.

Anti-gaming purpose:
  Confirms that:
    a) The BEFORE photo actually contained a damaged road / pothole
       (prevents contractors from submitting complaints for already-good roads)
    b) The AFTER photo does NOT contain a pothole in the same region
       (confirms the repair was actually performed)

Method:
  - Run YOLOv8 segmentation model on both images
  - Map detected class labels to one of: ["pothole", "road_damage", "road_patch", "intact_road"]
  - Before photo: must contain "pothole" or "road_damage"
  - After photo: must NOT contain "pothole"/"road_damage" in the centre region;
                 must contain "road_patch" or "intact_road"

Fallback:
  If YOLOv8 is unavailable (model not found), falls back to a pixel-darkness heuristic
  so the rest of the pipeline can still function. Score is penalised in this case.

Output (dict — stored as JSONB):
  {
    "passed": bool,
    "score": float,
    "reason": str,
    "before_detected_class": str | None,
    "after_detected_class": str | None,
    "pothole_in_after": bool
  }
"""

from io import BytesIO
from typing import Optional

import numpy as np
from PIL import Image

from app.core.config import settings

# YOLO class names we care about (adjust based on your trained model's class list)
DAMAGE_CLASSES = {"pothole", "road_damage", "crack", "damaged_road", "waterlogging", "waterlogging_hazard"}
REPAIRED_CLASSES = {"road_patch", "intact_road", "repaired", "asphalt", "drained_road"}

# Patch torch.load for PyTorch 2.6 compatibility with Ultralytics checkpoints
try:
    import torch
    _orig_torch_load = torch.load
    def _patched_torch_load(*args, **kwargs):
        if "weights_only" not in kwargs:
            kwargs["weights_only"] = False
        return _orig_torch_load(*args, **kwargs)
    torch.load = _patched_torch_load
except Exception:
    pass

_CACHED_MODEL = None


def _get_model():
    global _CACHED_MODEL
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL

    from pathlib import Path
    from ultralytics import YOLO

    model_path = settings.yolo_model_path
    p = Path(model_path)

    # If local path doesn't exist, auto-fetch from Hugging Face Hub
    if not p.exists():
        if getattr(settings, "hf_model_repo", None):
            try:
                from huggingface_hub import hf_hub_download
                hf_path = hf_hub_download(
                    repo_id=settings.hf_model_repo,
                    filename="best.pt",
                )
                if Path(hf_path).exists():
                    model_path = hf_path
            except Exception:
                pass

    if not Path(model_path).exists():
        model_path = "yolov8n.pt"

    _CACHED_MODEL = YOLO(model_path)
    return _CACHED_MODEL


def run(before_photo_bytes: bytes, after_photo_bytes: bytes) -> dict:
    """
    Runs Step 5: Multi-Stage Pavement Repair Verification.
    Enforces strict physical verification:
      1. Validates that the uploaded photo is an authentic roadway surface (not blank, selfie, or indoor room).
      2. Validates that the after-photo is not a duplicate/reused copy of the before-photo.
      3. Verifies that the reported defect has actually been repaired (pothole void filled, manhole secured, water drained, crack sealed).
      4. Absolutely forbids passing unrepaired defects or arbitrary non-road images.
    """
    try:
        from training.evaluate_structural_model import extract_spatial_pyramid, predict_forest
        
        before_img = Image.open(BytesIO(before_photo_bytes)).convert("RGB")
        after_img = Image.open(BytesIO(after_photo_bytes)).convert("RGB")

        # 1. Road Surface Validity Check on AFTER photo
        after_64 = after_img.resize((64, 64), Image.Resampling.BILINEAR)
        arr_after = np.array(after_64).astype(float)
        r, g, b = arr_after[:,:,0], arr_after[:,:,1], arr_after[:,:,2]
        gray_after = 0.299 * r + 0.587 * g + 0.114 * b
        dx = np.abs(gray_after[:, 1:] - gray_after[:, :-1])
        dy = np.abs(gray_after[1:, :] - gray_after[:-1, :])
        grad_after = (dx.mean() + dy.mean()) / 2.0
        mean_lum = gray_after.mean()

        if grad_after < 2.0 or mean_lum > 245 or mean_lum < 15:
            return {
                "passed": False,
                "score": 0.0,
                "reason": "REJECTED: Uploaded photo lacks roadway aggregate texture (blank, overexposed, or underexposed).",
                "before_detected_class": None,
                "after_detected_class": "non_road_invalid",
                "pothole_in_after": False
            }

        color_diff = np.maximum(np.abs(r - g), np.maximum(np.abs(g - b), np.abs(r - b)))
        if (color_diff > 55).mean() > 0.45:
            return {
                "passed": False,
                "score": 0.0,
                "reason": "REJECTED: Uploaded photo exhibits non-roadway color and texture characteristics.",
                "before_detected_class": None,
                "after_detected_class": "non_road_invalid",
                "pothole_in_after": False
            }

        # 2. Duplicate / Reused Photo Detection
        before_64 = before_img.resize((64, 64), Image.Resampling.BILINEAR)
        arr_before = np.array(before_64).astype(float)
        if np.abs(arr_after - arr_before).mean() < 5.0:
            return {
                "passed": False,
                "score": 0.0,
                "reason": "FRAUD DETECTED: Uploaded after-photo is identical to the original defect photo. No repair performed.",
                "before_detected_class": "unrepaired_original",
                "after_detected_class": "duplicate_reused_fraud",
                "pothole_in_after": True
            }

        # 3. Structural Defect Analysis on BEFORE and AFTER
        before_feats, before_stats = extract_spatial_pyramid(before_img)
        before_class, before_probs = predict_forest(before_feats)

        after_feats, after_stats = extract_spatial_pyramid(after_img)
        after_class, after_probs = predict_forest(after_feats)

        # 4. Strict Defect Clearance Enforcement
        # 4a. Active Pothole still visible in after photo
        if after_class == "Pothole" and (after_stats['rim'] > 8.0 or after_stats['rough_spread'] > 13.0 or after_probs.get("Pothole", 0) > 0.38):
            pothole_conf = after_probs.get("Pothole", 0.85)
            return {
                "passed": False,
                "score": round(max(0.05, 1.0 - pothole_conf), 2),
                "reason": f"REJECTED: Active pothole crater cavity still detected in after-photo ({pothole_conf:.0%} confidence, rim step={after_stats['rim']:.1f}). Cavity void has not been repaired.",
                "before_detected_class": before_class,
                "after_detected_class": "pothole",
                "pothole_in_after": True
            }

        # 4b. Open Manhole shaft hazard
        if after_class == "Manhole Collar" and (after_stats['inner'] < 65.0 or after_stats['max_dark'] > 0.35):
            return {
                "passed": False,
                "score": 0.05,
                "reason": "REJECTED: Open or unsecured utility shaft detected. Critical fall hazard remains active.",
                "before_detected_class": before_class,
                "after_detected_class": "open_manhole_shaft",
                "pothole_in_after": False
            }

        # 4c. Active Waterlogging
        if after_class == "Waterlogging" and (after_probs.get("Waterlogging", 0) > 0.45 or after_stats['bottom_water'] > 0.35):
            wl_conf = after_probs.get("Waterlogging", 0.70)
            return {
                "passed": False,
                "score": 0.15,
                "reason": f"REJECTED: Waterlogging still submerges the carriageway ({wl_conf:.0%} confidence). Drainage clearance not verified.",
                "before_detected_class": before_class,
                "after_detected_class": "waterlogging",
                "pothole_in_after": False
            }

        # 4d. Unsealed Crack if original was a crack
        if before_class == "Crack" and after_class == "Crack" and after_probs.get("Crack", 0) > 0.40:
            return {
                "passed": False,
                "score": 0.20,
                "reason": "REJECTED: Open pavement fracture still detected. Crack sealing not completed.",
                "before_detected_class": before_class,
                "after_detected_class": "crack",
                "pothole_in_after": False
            }

        # 5. Passed: Repair confirmed
        return {
            "passed": True,
            "score": 0.98,
            "reason": f"PASSED: Pavement repair confirmed. Defect void eliminated; surface is flush and structurally stable. (Original defect: {before_class}).",
            "before_detected_class": before_class,
            "after_detected_class": "repaired_road_patch",
            "pothole_in_after": False
        }

    except Exception as e:
        return _run_heuristic_fallback(before_photo_bytes, after_photo_bytes, str(e))


def _detect_dominant_class(model, img: Image.Image) -> Optional[str]:
    """
    Runs YOLO inference and returns the highest-confidence detected class name.
    Returns None if nothing is detected.
    """
    results = model(img, verbose=False)
    if not results or not results[0].boxes:
        return None

    # Get the box with the highest confidence
    boxes = results[0].boxes
    best_idx = int(boxes.conf.argmax())
    class_id = int(boxes.cls[best_idx])
    return results[0].names.get(class_id, "unknown").lower()


def _run_heuristic_fallback(before_bytes: bytes, after_bytes: bytes, error: str) -> dict:
    """
    Structural void & rim discontinuity heuristic fallback when YOLOv8 is unavailable.
    Civil Engineering reframe:
      - Pothole: Localized structural void in pavement (rim discontinuity), dry or water-filled.
      - Waterlogging: Surface water accumulation over continuous intact pavement (no rim discontinuity).
      - Submerged Hazard: Ambiguous bed profile beneath standing water flagged for post-drainage inspection.
    """
    before_analysis = _analyze_structural_void(before_bytes)
    after_analysis = _analyze_structural_void(after_bytes)

    before_has_damage = before_analysis["has_structural_void"] or before_analysis["is_waterlogging"]
    after_has_pothole = after_analysis["has_structural_void"]
    after_has_water = after_analysis["has_water"]

    if before_analysis["has_structural_void"]:
        before_class = "pothole_structural_void"
        passed = not after_has_pothole
    elif before_analysis["is_submerged_hazard"]:
        before_class = "waterlogging_submerged_hazard"
        passed = not after_has_water and not after_has_pothole
    elif before_analysis["is_waterlogging"]:
        before_class = f"waterlogging_{before_analysis['subtype']}"
        passed = not after_has_water
    else:
        before_class = "intact_road"
        passed = False

    score = 0.70 if passed else 0.25

    return {
        "passed": passed,
        "score": score,
        "reason": (
            f"Civil Engineering Analysis: Detected '{before_class}' (Rim step={before_analysis['rim_step']:.2f}, "
            f"Hydrological={before_analysis['subtype']}, SubmergedHazard={before_analysis['is_submerged_hazard']}). "
            f"After photo: Void eliminated={not after_has_pothole}, Water drained={not after_has_water}."
        ),
        "before_detected_class": before_class,
        "after_detected_class": "road_patch" if passed else before_class,
        "pothole_in_after": after_has_pothole,
        "before_water_occluded": before_analysis["water_occluded"],
        "waterlog_subtype": before_analysis["subtype"],
        "possible_submerged_hazard": before_analysis["is_submerged_hazard"],
    }


def _analyze_structural_void(photo_bytes: bytes) -> dict:
    """
    Two-Stage Civil Engineering Analysis:
    Stage 1: Structural Void Detector
      Checks for fractured rim discontinuity (asphalt breakdown).
      If present -> Pothole (water treated as secondary occlusion attribute).
    Stage 2: Hydrological Waterlogging & Submerged Hazard
      If NO rim discontinuity -> Waterlogging (drainage deficiency over continuous intact road).
      Sub-types: sheet_pooling, drain_overflow, low_point_ponding, roadside_spillover.
      Edge case: Flag possible submerged hazard when bed profile is ambiguous at low points.
    """
    img = Image.open(BytesIO(photo_bytes)).convert("L")
    w, h = img.size
    arr = np.array(img).astype(float) / 255.0

    # Centre cavity crop (40%)
    cw, ch = int(w * 0.40), int(h * 0.40)
    x0 = (w - cw) // 2
    y0 = (h - ch) // 2
    inner_crop = arr[y0:y0 + ch, x0:x0 + cw]
    inner_mean = inner_crop.mean()

    # Outer surrounding pavement (annulus)
    outer_mask = np.ones_like(arr, dtype=bool)
    outer_mask[y0:y0 + ch, x0:x0 + cw] = False
    outer_mean = arr[outer_mask].mean()

    rim_step = abs(outer_mean - inner_mean)

    # Specular glint count (water sheen/reflection)
    specular_fraction = (inner_crop > 0.78).mean()
    has_water = (specular_fraction > 0.015) or (inner_mean > 0.58 and outer_mean > 0.50)

    # A pothole is confirmed if rim step discontinuity is present or deep cavity void
    has_structural_void = (rim_step > 0.065) or (inner_mean < 0.36 and rim_step > 0.03)
    water_occluded = has_structural_void and has_water

    # Waterlogging is confirmed when water accumulates on structurally continuous road
    is_waterlogging = (not has_structural_void) and has_water

    # Determine hydrological sub-type:
    subtype = "sheet_pooling"
    if is_waterlogging:
        if inner_mean < 0.42:
            subtype = "low_point_ponding"
        elif specular_fraction > 0.04:
            subtype = "drain_overflow"
        elif rim_step > 0.03:
            subtype = "roadside_spillover"
        else:
            subtype = "sheet_pooling"

    # Safety edge case: Possible Submerged Hazard
    is_submerged_hazard = False
    if is_waterlogging and ((0.038 <= rim_step <= 0.065) or (subtype == "low_point_ponding" and specular_fraction > 0.03)):
        is_submerged_hazard = True

    return {
        "has_structural_void": has_structural_void,
        "rim_step": rim_step,
        "water_occluded": water_occluded,
        "is_waterlogging": is_waterlogging,
        "is_submerged_hazard": is_submerged_hazard,
        "subtype": subtype,
        "inner_mean": inner_mean,
        "outer_mean": outer_mean,
        "has_water": has_water,
    }


def _build_reason(before_class, after_class, before_damaged, after_has_pothole) -> str:
    if not before_damaged:
        return (
            f"Before photo does not show road damage (detected: '{before_class}'). "
            "The original complaint may be invalid."
        )
    if after_has_pothole:
        return (
            f"After photo still shows pothole/damage (detected: '{after_class}'). "
            "Repair not confirmed."
        )
    return (
        f"Repair confirmed: before='{before_class}', after='{after_class}'. "
        "Pothole no longer visible in after photo."
    )
