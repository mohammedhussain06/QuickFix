"""
training/evaluate_model.py — Evaluate the fine-tuned pothole model.

Tests the trained model on:
  1. A single image (visual preview with bounding boxes)
  2. The full test set (mAP50, precision, recall metrics)
  3. The 4 pipeline demo test cases (genuine, fraud, wrong angle, duplicate)

Usage:
    # Evaluate on test set
    python training/evaluate_model.py

    # Evaluate on a single image
    python training/evaluate_model.py --image path/to/pothole.jpg

    # Show what the model detects in a before/after pair
    python training/evaluate_model.py --before before.jpg --after after.jpg
"""

import argparse
from pathlib import Path

# ── PyTorch 2.6+ compatibility patch ──────────────────────────────────────────
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

from ultralytics import YOLO


ROOT = Path(__file__).parent.parent
DEFAULT_MODEL = ROOT / "models" / "pothole_yolov8" / "weights" / "best.pt"
DATASET_YAML = ROOT / "training" / "dataset.yaml"

# Class label mapping matching dataset.yaml
CLASS_NAMES = {0: "pothole", 1: "road_damage", 2: "road_patch", 3: "intact_road"}
DAMAGE_CLASSES = {"pothole", "road_damage"}
REPAIR_CLASSES = {"road_patch", "intact_road"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=str(DEFAULT_MODEL), help="Path to trained weights")
    parser.add_argument("--image", default=None, help="Single image to evaluate")
    parser.add_argument("--before", default=None, help="Before photo for pair evaluation")
    parser.add_argument("--after", default=None, help="After photo for pair evaluation")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold")
    return parser.parse_args()


def load_model(model_path: str) -> YOLO:
    path = Path(model_path)
    if not path.exists():
        print(f"❌ Model not found: {path}")
        print("   Run: python training/train_yolo.py first")
        raise SystemExit(1)
    print(f"✅ Loaded model: {path}")
    return YOLO(str(path))


def evaluate_test_set(model: YOLO):
    """Runs YOLOv8 validation on the full test set and prints metrics."""
    print("\n📊 Evaluating on test set...")
    metrics = model.val(data=str(DATASET_YAML), split="test", verbose=True)

    print("\n" + "=" * 50)
    print("  Test Set Metrics")
    print("=" * 50)
    print(f"  mAP50:         {metrics.seg.map50:.4f}")
    print(f"  mAP50-95:      {metrics.seg.map:.4f}")
    print(f"  Precision:     {metrics.seg.mp:.4f}")
    print(f"  Recall:        {metrics.seg.mr:.4f}")

    # Per-class breakdown
    print("\n  Per-class mAP50:")
    for i, name in CLASS_NAMES.items():
        try:
            class_map = metrics.seg.maps[i]
            print(f"    {name:15s}: {class_map:.4f}")
        except (IndexError, AttributeError):
            pass

    # Pass/fail guidance
    if metrics.seg.map50 >= 0.70:
        print("\n  ✅ Model is production-ready (mAP50 ≥ 0.70)")
    elif metrics.seg.map50 >= 0.50:
        print("\n  ⚠️  Model is acceptable for demo (mAP50 ≥ 0.50)")
    else:
        print("\n  ❌ Model needs more training (mAP50 < 0.50)")
        print("     Try: more epochs, larger model (yolov8s-seg), or more data")


def evaluate_single_image(model: YOLO, image_path: str, conf: float):
    """Runs inference on a single image and shows detected classes."""
    print(f"\n🔍 Evaluating: {image_path}")
    results = model(image_path, conf=conf, verbose=False)

    if not results or not results[0].boxes:
        print("  No detections above confidence threshold")
        return

    print("  Detections:")
    for box in results[0].boxes:
        class_id = int(box.cls)
        class_name = CLASS_NAMES.get(class_id, f"class_{class_id}")
        confidence = float(box.conf)
        print(f"    {class_name:15s}  confidence: {confidence:.2%}")

    # Save annotated image
    out_path = Path(image_path).stem + "_annotated.jpg"
    results[0].save(filename=out_path)
    print(f"  💾 Annotated image saved: {out_path}")


def evaluate_pair(model: YOLO, before_path: str, after_path: str, conf: float):
    """
    Simulates Step 5 of the verification pipeline on a before/after photo pair.
    Shows what the pipeline would decide.
    """
    print("\n🔬 Pair Evaluation (Step 5 Simulation)")
    print("=" * 50)

    def get_top_class(image_path: str) -> tuple[str | None, float]:
        results = model(image_path, conf=conf, verbose=False)
        if not results or not results[0].boxes:
            return None, 0.0
        boxes = results[0].boxes
        best_idx = int(boxes.conf.argmax())
        class_id = int(boxes.cls[best_idx])
        return CLASS_NAMES.get(class_id, "unknown"), float(boxes.conf[best_idx])

    before_class, before_conf = get_top_class(before_path)
    after_class, after_conf = get_top_class(after_path)

    print(f"  BEFORE photo → detected: '{before_class}' ({before_conf:.1%} confidence)")
    print(f"  AFTER  photo → detected: '{after_class}'  ({after_conf:.1%} confidence)")

    before_damaged = before_class in DAMAGE_CLASSES if before_class else False
    after_has_pothole = after_class in DAMAGE_CLASSES if after_class else False

    print("\n  Pipeline Decision:")
    if not before_damaged:
        print("  ❌ FAIL — Before photo does not show road damage")
        print("          (complaint may be invalid)")
    elif after_has_pothole:
        print("  ❌ FAIL — After photo still shows pothole/damage")
        print("          (repair not confirmed)")
    else:
        print("  ✅ PASS — Pothole confirmed in before, absent in after")
        print("          (repair confirmed by Step 5)")


def main():
    args = parse_args()
    model = load_model(args.model)

    if args.before and args.after:
        evaluate_pair(model, args.before, args.after, args.conf)
    elif args.image:
        evaluate_single_image(model, args.image, args.conf)
    else:
        evaluate_test_set(model)


if __name__ == "__main__":
    main()
