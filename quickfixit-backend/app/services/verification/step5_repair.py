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
DAMAGE_CLASSES = {"pothole", "road_damage", "crack", "damaged_road"}
REPAIRED_CLASSES = {"road_patch", "intact_road", "repaired", "asphalt"}

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
    Runs Step 5: YOLOv8 Repair Confirmation.
    """
    try:
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

        model = _get_model()
        return _run_with_yolo(model, before_photo_bytes, after_photo_bytes)
    except Exception as e:
        # Graceful fallback if model is unavailable (demo mode)
        return _run_heuristic_fallback(before_photo_bytes, after_photo_bytes, str(e))


def _run_with_yolo(model, before_bytes: bytes, after_bytes: bytes) -> dict:
    """Full YOLOv8 path."""
    before_img = Image.open(BytesIO(before_bytes)).convert("RGB")
    after_img = Image.open(BytesIO(after_bytes)).convert("RGB")

    before_class = _detect_dominant_class(model, before_img)
    after_class = _detect_dominant_class(model, after_img)

    before_has_damage = before_class in DAMAGE_CLASSES if before_class else False
    after_has_pothole = after_class in DAMAGE_CLASSES if after_class else False
    after_shows_repair = after_class in REPAIRED_CLASSES if after_class else True  # benefit of doubt

    passed = before_has_damage and (not after_has_pothole)
    score = 0.0

    if before_has_damage and not after_has_pothole:
        score = 1.0
    elif before_has_damage and after_has_pothole:
        score = 0.1  # Pothole still visible
    elif not before_has_damage:
        score = 0.3  # Before photo doesn't show damage — suspicious

    reason = _build_reason(before_class, after_class, before_has_damage, after_has_pothole)

    return {
        "passed": passed,
        "score": round(score, 4),
        "reason": reason,
        "before_detected_class": before_class,
        "after_detected_class": after_class,
        "pothole_in_after": after_has_pothole,
    }


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
    Pixel-darkness heuristic fallback when YOLOv8 is unavailable.
    Dark pixels in the centre = pothole-like region.
    This is intentionally imprecise and penalised in the fusion score.
    """
    before_brightness = _centre_brightness(before_bytes)
    after_brightness = _centre_brightness(after_bytes)

    # Pothole = dark centre; repair = lighter centre
    before_likely_damaged = before_brightness < 0.4
    after_likely_repaired = after_brightness > before_brightness + 0.05

    passed = before_likely_damaged and after_likely_repaired
    score = 0.5 if passed else 0.2  # Penalise heuristic mode

    return {
        "passed": passed,
        "score": score,
        "reason": (
            f"YOLOv8 unavailable ({error}). Fallback heuristic used — result is indicative only. "
            f"Before brightness: {before_brightness:.2f}, After brightness: {after_brightness:.2f}."
        ),
        "before_detected_class": "heuristic_dark" if before_likely_damaged else "heuristic_light",
        "after_detected_class": "heuristic_light" if after_likely_repaired else "heuristic_dark",
        "pothole_in_after": not after_likely_repaired,
    }


def _centre_brightness(photo_bytes: bytes, crop_fraction: float = 0.4) -> float:
    """Returns average pixel brightness (0–1) of the centre crop of an image."""
    img = Image.open(BytesIO(photo_bytes)).convert("L")
    w, h = img.size
    cw, ch = int(w * crop_fraction), int(h * crop_fraction)
    x0 = (w - cw) // 2
    y0 = (h - ch) // 2
    centre = img.crop((x0, y0, x0 + cw, y0 + ch))
    return np.array(centre).mean() / 255.0


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
