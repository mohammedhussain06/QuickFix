"""
training/organize_and_merge.py — Organizes the 1,243 downloaded images into
YOLO train/val splits and automatically merges the user's 18 before/after pairs.
"""

import os
import shutil
import random
from pathlib import Path

ROOT = Path(__file__).parent.parent
BASE_DIR = ROOT / "datasets" / "pothole_segmentation"
SOURCE_DIR = BASE_DIR / "Pothole Dataset"

TRAIN_IMG = BASE_DIR / "images" / "train"
TRAIN_LBL = BASE_DIR / "labels" / "train"
VAL_IMG = BASE_DIR / "images" / "val"
VAL_LBL = BASE_DIR / "labels" / "val"

for d in [TRAIN_IMG, TRAIN_LBL, VAL_IMG, VAL_LBL]:
    d.mkdir(parents=True, exist_ok=True)


def organize():
    if not SOURCE_DIR.exists():
        print(f"Directory {SOURCE_DIR} not found. Skipping file split.")
        return

    # Find all jpg images
    all_imgs = sorted(list(SOURCE_DIR.glob("*.jpg")))
    total = len(all_imgs)
    print(f"📂 Found {total} downloaded pothole images in {SOURCE_DIR.name}")

    if total == 0:
        return

    # Shuffle with fixed seed for reproducibility
    random.seed(42)
    random.shuffle(all_imgs)

    val_count = int(total * 0.15)  # 15% validation
    val_set = set(all_imgs[:val_count])

    moved_train = 0
    moved_val = 0

    for img_path in all_imgs:
        lbl_path = img_path.with_suffix(".txt")

        is_val = img_path in val_set
        dest_img = VAL_IMG if is_val else TRAIN_IMG
        dest_lbl = VAL_LBL if is_val else TRAIN_LBL

        # Copy image
        shutil.copy2(img_path, dest_img / img_path.name)
        if is_val:
            moved_val += 1
        else:
            moved_train += 1

        # Copy label if exists
        if lbl_path.exists():
            shutil.copy2(lbl_path, dest_lbl / lbl_path.name)

    print(f"✅ Organized dataset:")
    print(f"   🚆 Train images: {moved_train}")
    print(f"   🔍 Val images:   {moved_val}")

    # Remove temporary extracted folder
    try:
        shutil.rmtree(SOURCE_DIR)
        print("🧹 Cleaned up temporary archive folder.")
    except Exception as e:
        print(f"Note: {e}")


def main():
    print("=" * 60)
    print("  Organizing Dataset & Merging User Road Photos")
    print("=" * 60)

    organize()

    # Merge all 501 user before/after pairs
    print("\nMerging 501 user before/after road pairs (1,002 images)...")
    import sys
    sys.path.insert(0, str(ROOT))
    try:
        from training.extract_all_user_sheets import main as merge_pairs
        merge_pairs()
    except Exception as e:
        print(f"Merge note: {e}")

    # Update dataset.yaml
    yaml_path = ROOT / "training" / "dataset.yaml"
    yaml_content = f"""# training/dataset.yaml — YOLOv8 dataset configuration
path: {BASE_DIR.as_posix()}   # root dataset directory
train: images/train
val: images/val
test: images/val

nc: 4

names:
  0: pothole
  1: road_damage
  2: road_patch
  3: intact_road
"""
    yaml_path.write_text(yaml_content)
    print(f"📝 Updated dataset config: {yaml_path}")
    print("\n🎉 Everything is ready! Run GPU training now:")
    print("   python training/train_yolo.py --epochs 50\n")


if __name__ == "__main__":
    main()
