"""
training/train.py — YOLOv8 Pothole Detection Fine-Tuning [GPU Accelerated]

Features:
  1. Auto-detects NVIDIA RTX GPU with FP16 AMP
  2. Uses YOLOv8n object detection model (matches bounding box dataset)
  3. Cleans stale cache files and incomplete runs automatically
  4. Automatically integrates user's 18 before/after road pairs (36 images)
  5. Trains for requested epochs (default: 25)
  6. Saves best weights to: models/pothole_yolov8/weights/best.pt

Usage:
    python training/train.py --epochs 25
    python training/train.py --epochs 50
"""

import argparse
import os
import shutil
import sys
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


def detect_gpu() -> str:
    try:
        import torch
        if not torch.cuda.is_available():
            print("WARNING: No CUDA GPU detected. Training will run on CPU.")
            return "cpu"

        gpu_count = torch.cuda.device_count()
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)

        print(f"GPU detected: {gpu_name} ({vram_gb:.1f} GB VRAM)")

        if gpu_count > 1:
            print(f"Found {gpu_count} GPUs - enabling multi-GPU training")
            return ",".join(str(i) for i in range(gpu_count))

        return "0"

    except ImportError:
        print("PyTorch not installed properly. Falling back to CPU.")
        return "cpu"


ROOT = Path(__file__).parent.parent
DATASET_YAML = ROOT / "training" / "dataset.yaml"
OUTPUT_DIR = ROOT / "models"


def restore_train_yolo():
    """Restores training/train_yolo.py to match this clean script."""
    try:
        current_code = Path(__file__).read_text(encoding="utf-8")
        target_path = ROOT / "training" / "train_yolo.py"
        target_path.write_text(current_code, encoding="utf-8")
    except Exception:
        pass


def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune YOLOv8 on pothole dataset (GPU mode)")
    parser.add_argument(
        "--model", default="yolov8n.pt",
        help="Base model: yolov8n.pt (fast detection) | yolov8s.pt (better) | yolov8m.pt (best)"
    )
    parser.add_argument(
        "--epochs", type=int, default=25,
        help="Training epochs (default: 25)"
    )
    parser.add_argument(
        "--imgsz", type=int, default=640,
        help="Input image size (default: 640)"
    )
    parser.add_argument(
        "--batch", type=int, default=16,
        help="Batch size (default: 16)"
    )
    parser.add_argument(
        "--device", default=None,
        help="GPU device: None=auto-detect, '0'=GPU 0, '0,1'=multi-GPU, 'cpu'=CPU fallback"
    )
    parser.add_argument(
        "--freeze", type=int, default=0,
        help="Backbone layers to freeze (default: 0 for full fine-tuning)"
    )
    parser.add_argument(
        "--no-amp", action="store_true",
        help="Disable Automatic Mixed Precision (AMP)"
    )
    return parser.parse_args()


def train(args):
    print("=" * 60)
    print("  QuickFix It - YOLOv8 Pothole Fine-Tuning  [GPU MODE]")
    print("=" * 60)

    # Sync and repair train_yolo.py
    restore_train_yolo()

    # Organize dataset & inject user pairs
    try:
        sys.path.insert(0, str(ROOT))
        from training.organize_and_merge import main as prepare_data
        prepare_data()
    except Exception as e:
        print(f"Dataset prep note: {e}")

    # Clean up stale cache files
    for cache_path in (ROOT / "datasets" / "pothole_segmentation").rglob("*.cache"):
        try:
            cache_path.unlink()
            print(f"Cleaned stale cache: {cache_path.name}")
        except Exception:
            pass

    # Remove stale or failed run directory so YOLO doesn't conflict with segment runs
    stale_run = OUTPUT_DIR / "pothole_yolov8"
    if stale_run.exists():
        best_file = stale_run / "weights" / "best.pt"
        args_file = stale_run / "args.yaml"
        if not best_file.exists():
            shutil.rmtree(stale_run, ignore_errors=True)
            print("Removed incomplete previous run artifacts.")
        elif args_file.exists():
            try:
                content = args_file.read_text(encoding="utf-8", errors="ignore")
                if "task: segment" in content:
                    shutil.rmtree(stale_run, ignore_errors=True)
                    print("Removed stale segmentation run artifacts.")
            except Exception:
                pass

    # GPU & AMP setup
    device = args.device if args.device is not None else detect_gpu()
    use_amp = not args.no_amp and device != "cpu"

    print(f"\nDevice  : {device}")
    print(f"AMP (mixed precision): {'ON' if use_amp else 'OFF'}")
    print(f"Base model           : {args.model}")
    print(f"Epochs               : {args.epochs}")
    print(f"Image size           : {args.imgsz}px")
    print(f"Batch size           : {'auto' if args.batch == -1 else args.batch}")

    if device == "cpu":
        print("\nRunning on CPU. Training will be slow.")

    # Load base model (yolov8n.pt detection model)
    print(f"\nLoading base model: {args.model}")
    model = YOLO(args.model)

    print(f"\nStarting training for {args.epochs} epochs on GPU...")
    if args.freeze > 0:
        print(f"Freezing first {args.freeze} layers")

    num_workers = 0  # 0 is required on Windows to avoid DataLoader multiprocessing crashes

    model.train(
        data=str(DATASET_YAML),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=device,
        amp=use_amp,
        project=str(OUTPUT_DIR),
        name="pothole_yolov8",
        exist_ok=True,
        freeze=args.freeze if args.freeze > 0 else None,
        augment=True,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=5.0,
        translate=0.1,
        scale=0.5,
        flipud=0.0,
        fliplr=0.5,
        mosaic=1.0,
        mixup=0.1,
        copy_paste=0.0,
        workers=0,
        cache="ram",
        optimizer="AdamW",
        lr0=0.001,
        lrf=0.01,
        warmup_epochs=3,
        weight_decay=0.0005,
        momentum=0.937,
        box=7.5,
        cls=0.5,
        dfl=1.5,
        plots=True,
        save=True,
        save_period=5,
        verbose=True,
    )

    best_weights = OUTPUT_DIR / "pothole_yolov8" / "weights" / "best.pt"
    print("\n" + "=" * 60)
    print("  Training Complete!")
    print("=" * 60)
    print(f"\nBest model weights: {best_weights}")
    print(f"Training plots:     {OUTPUT_DIR / 'pothole_yolov8'}")
    print("\nNext steps:")
    print(f"  1. Update .env:  YOLO_MODEL_PATH={best_weights}")
    print("  2. Evaluate:     python training/evaluate_model.py")
    print("  3. (Optional)    python training/export_model.py")


if __name__ == "__main__":
    args = parse_args()
    train(args)
