"""
training/download_dataset.py — Downloads pothole dataset and merges your custom images.

Options:
  1. Direct Download (1,243 images — NO API Key required) [Recommended]
  2. Use your uploaded Before/After images only (Immediate, no download)
  3. Roboflow Account (Requires free Roboflow API key)

Usage:
    python training/download_dataset.py
"""

import os
import shutil
import sys
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent.parent
DEST_DIR = ROOT / "datasets" / "pothole_segmentation"
ZIP_URL = "https://github.com/jaygala24/pothole-detection/releases/download/v1.0.0/Pothole.Dataset.IVCNZ.zip"


def download_direct():
    """Downloads YOLO pothole dataset directly from GitHub releases without needing any API key."""
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    zip_path = DEST_DIR / "dataset.zip"

    print("📥 Downloading 1,243-image Pothole Dataset (no API key needed)...")
    print(f"   URL: {ZIP_URL}")

    def report_hook(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            percent = min(100.0, downloaded * 100 / total_size)
            mb = downloaded / (1024 * 1024)
            total_mb = total_size / (1024 * 1024)
            sys.stdout.write(f"\r   Progress: {percent:.1f}% ({mb:.1f}/{total_mb:.1f} MB)")
            sys.stdout.flush()

    try:
        urllib.request.urlretrieve(ZIP_URL, zip_path, reporthook=report_hook)
        print("\n📦 Extracting dataset...")
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(DEST_DIR)
        zip_path.unlink(missing_ok=True)
        print("✅ Pothole dataset extracted successfully!")
    except Exception as e:
        print(f"\n❌ Direct download error: {e}")
        print("   Falling back to your custom uploaded images only...")


def download_roboflow():
    try:
        from roboflow import Roboflow
    except ImportError:
        print("❌ roboflow not installed. Run: pip install roboflow")
        return

    print("\n🔑 To get your free API key (takes 10 seconds):")
    print("   1. Go to https://app.roboflow.com (Sign in with Google)")
    print("   2. Click Settings (gear icon) → Roboflow API → Copy Key\n")

    api_key = input("Paste your Roboflow API key: ").strip()
    if not api_key:
        print("❌ No key entered.")
        return

    print("📥 Connecting to Roboflow...")
    try:
        rf = Roboflow(api_key=api_key)
        # Official IIT Madras Indian Pothole Dataset
        print("🇮🇳 Downloading official IIT Madras Indian Road Pothole Dataset...")
        project = rf.workspace("indian-institute-of-technology-madras-xamot").project("pothole-detection-huf2x")
        project.version(1).download(
            model_format="yolov8",
            location=str(DEST_DIR),
            overwrite=True,
        )
    except Exception as e:
        print(f"❌ Download error: {e}")
        print("Falling back to your 18 Indian before/after road pairs...")



def merge_user_images():
    print("\n🔄 Merging your custom before/after images into the dataset...")
    try:
        from training.add_user_images import main as run_merge
        run_merge()
    except Exception as e:
        print(f"⚠️ Note while merging user images: {e}")


def main():
    print("=" * 60)
    print("  QuickFix It — Pothole Training Dataset Downloader")
    print("=" * 60)
    print("\nChoose dataset to train on:")
    print("  [1] IIT Madras Official Indian Pothole Dataset (via Roboflow, requires free key)")
    print("  [2] Your 18 Indian Before/After Pairs Only (Instant, NO KEY NEEDED) [Fastest]")
    print("  [3] Direct Download Generic Potholes (1,243 images, NO KEY NEEDED)")

    choice = input("\nEnter choice [1, 2, or 3, default 1]: ").strip() or "1"

    if choice == "1":
        download_roboflow()
    elif choice == "2":
        print("⏩ Using your 18 uploaded before/after road pairs directly.")
    elif choice == "3":
        download_direct()


    # Always merge the user's uploaded images
    merge_user_images()

    print("\n🎉 Dataset ready for YOLO fine-tuning!")
    print("\n🚀 Next step: run training with GPU:")
    print("   python training/train_yolo.py --epochs 50\n")


if __name__ == "__main__":
    main()



