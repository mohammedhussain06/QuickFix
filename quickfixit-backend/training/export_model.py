"""
training/export_model.py — Export the fine-tuned model to ONNX for production.

Why export to ONNX?
  - Runs faster than PyTorch (.pt) in production (no Python overhead)
  - Can be deployed on servers without a full CUDA setup
  - Works with OpenCV DNN module for even lighter inference
  - Can be converted to TensorRT for GPU-optimised inference

Usage:
    python training/export_model.py
    python training/export_model.py --format onnx --imgsz 640
"""

import argparse
from pathlib import Path

from ultralytics import YOLO

ROOT = Path(__file__).parent.parent
DEFAULT_MODEL = ROOT / "models" / "pothole_yolov8" / "weights" / "best.pt"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=str(DEFAULT_MODEL))
    parser.add_argument(
        "--format", default="onnx",
        choices=["onnx", "torchscript", "tflite", "coreml"],
        help="Export format"
    )
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument(
        "--dynamic", action="store_true", default=True,
        help="Dynamic axes for variable batch size"
    )
    parser.add_argument(
        "--simplify", action="store_true", default=True,
        help="Simplify ONNX model graph"
    )
    return parser.parse_args()


def export(args):
    model_path = Path(args.model)
    if not model_path.exists():
        print(f"❌ Model not found: {model_path}")
        print("   Run: python training/train_yolo.py first")
        return

    print(f"📦 Loading: {model_path}")
    model = YOLO(str(model_path))

    print(f"🚀 Exporting to {args.format.upper()}...")
    exported_path = model.export(
        format=args.format,
        imgsz=args.imgsz,
        dynamic=args.dynamic,
        simplify=args.simplify,
        opset=17,         # ONNX opset version (17 = latest stable)
    )

    print(f"\n✅ Exported model: {exported_path}")
    print("\n📝 Update .env:")
    print(f"   YOLO_MODEL_PATH={exported_path}")
    print("\n📝 Update step5_repair.py to load ONNX:")
    print("   model = YOLO('models/pothole_yolov8/weights/best.onnx')")


if __name__ == "__main__":
    args = parse_args()
    export(args)
