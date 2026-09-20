"""
training/add_user_images.py — Extracts individual before/after images from user's collages,
saves clean pairs for testing, and adds them into the YOLO training dataset.

Usage:
    python training/add_user_images.py
"""

import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
UPLOAD_DIR = Path(r"C:\Users\Mohammed Hussain\.gemini\antigravity-ide\brain\fa7bd2d0-a804-4996-9789-ebcc7cc7c5bb\.user_uploaded")

# Destination directories
DEMO_PAIRS_DIR = ROOT / "datasets" / "demo_pairs"
TRAIN_IMG_DIR = ROOT / "datasets" / "pothole_segmentation" / "images" / "train"
TRAIN_LBL_DIR = ROOT / "datasets" / "pothole_segmentation" / "labels" / "train"

DEMO_PAIRS_DIR.mkdir(parents=True, exist_ok=True)
TRAIN_IMG_DIR.mkdir(parents=True, exist_ok=True)
TRAIN_LBL_DIR.mkdir(parents=True, exist_ok=True)


def extract_collage_2(img_path: Path):
    """
    Collage 2: 3 rows x 6 columns (9 before/after pairs)
    Col 0: P1 Before, Col 1: P1 After
    Col 2: P2 Before, Col 3: P2 After
    Col 4: P3 Before, Col 5: P3 After
    ...
    """
    if not img_path.exists():
        print(f"⚠️ {img_path} not found.")
        return []

    im = Image.open(img_path)
    w, h = im.size
    cols = 6
    rows = 3
    col_w = w / cols
    row_h = h / rows

    pairs = []
    pair_idx = 1
    for r in range(rows):
        for p in range(3):
            # Col for before and after
            c_before = p * 2
            c_after = p * 2 + 1

            box_before = (int(c_before * col_w), int(r * row_h), int((c_before + 1) * col_w), int((r + 1) * row_h))
            box_after = (int(c_after * col_w), int(r * row_h), int((c_after + 1) * col_w), int((r + 1) * row_h))

            im_before = im.crop(box_before)
            im_after = im.crop(box_after)

            # Trim top label banner (~6% of height)
            banner_h = int(im_before.height * 0.065)
            im_before = im_before.crop((0, banner_h, im_before.width, im_before.height))
            im_after = im_after.crop((0, banner_h, im_after.width, im_after.height))

            pairs.append((f"c2_pair_{pair_idx:02d}", im_before, im_after))
            pair_idx += 1

    return pairs


def extract_collage_1(img_path: Path):
    """
    Collage 1: 5 rows x 4 columns (9 before/after pairs)
    Row 0-3: 2 pairs per row (4 cols)
    Row 4: 1 pair on left (cols 0, 1)
    """
    if not img_path.exists():
        print(f"⚠️ {img_path} not found.")
        return []

    im = Image.open(img_path)
    w, h = im.size
    cols = 4
    rows = 5
    col_w = w / cols
    row_h = h / rows

    pairs = []
    pair_idx = 1
    for r in range(rows):
        for p in range(2):
            if r == 4 and p == 1:
                # 9th pair only occupies left half
                continue

            c_before = p * 2
            c_after = p * 2 + 1

            box_before = (int(c_before * col_w), int(r * row_h), int((c_before + 1) * col_w), int((r + 1) * row_h))
            box_after = (int(c_after * col_w), int(r * row_h), int((c_after + 1) * col_w), int((r + 1) * row_h))

            im_before = im.crop(box_before)
            im_after = im.crop(box_after)

            # Trim top label banner (~6% of height)
            banner_h = int(im_before.height * 0.065)
            im_before = im_before.crop((0, banner_h, im_before.width, im_before.height))
            im_after = im_after.crop((0, banner_h, im_after.width, im_after.height))

            pairs.append((f"c1_pair_{pair_idx:02d}", im_before, im_after))
            pair_idx += 1

    return pairs


def get_dest_dirs(split="train"):
    root = ROOT / "datasets" / "pothole_segmentation"
    if (root / split / "images").exists():
        img_dir = root / split / "images"
        lbl_dir = root / split / "labels"
    else:
        img_dir = root / "images" / split
        lbl_dir = root / "labels" / split
    img_dir.mkdir(parents=True, exist_ok=True)
    lbl_dir.mkdir(parents=True, exist_ok=True)
    return img_dir, lbl_dir


def save_and_annotate(pairs):
    count = 0
    total = len(pairs)
    val_cutoff = max(1, int(total * 0.2))  # ~20% for validation

    for idx, (name, im_before, im_after) in enumerate(pairs):
        # 1. Save to demo_pairs for API verification testing
        before_demo_path = DEMO_PAIRS_DIR / f"{name}_before.jpg"
        after_demo_path = DEMO_PAIRS_DIR / f"{name}_after.jpg"
        im_before.convert("RGB").save(before_demo_path, quality=95)
        im_after.convert("RGB").save(after_demo_path, quality=95)

        # 2. Decide whether train or val split
        split = "val" if idx < val_cutoff else "train"
        target_img_dir, target_lbl_dir = get_dest_dirs(split)

        # 3. Save images
        before_img = target_img_dir / f"user_{name}_before.jpg"
        after_img = target_img_dir / f"user_{name}_after.jpg"
        im_before.convert("RGB").save(before_img, quality=95)
        im_after.convert("RGB").save(after_img, quality=95)


        # 4. Create YOLO annotations (x_center, y_center, width, height normalized)
        # Class 0 = pothole (centered in before photo)
        # Class 2 = road_patch (centered in after photo)
        before_lbl = target_lbl_dir / f"user_{name}_before.txt"
        after_lbl = target_lbl_dir / f"user_{name}_after.txt"

        before_lbl.write_text("0 0.500000 0.550000 0.550000 0.450000\n")
        after_lbl.write_text("2 0.500000 0.550000 0.600000 0.500000\n")

        count += 1

    train_dir, _ = get_dest_dirs("train")
    val_dir, _ = get_dest_dirs("val")
    print(f"✅ Processed {count} pairs (total {count * 2} images):")
    print(f"   📁 Saved clean pairs to: {DEMO_PAIRS_DIR}")
    print(f"   🚆 Training set: {train_dir} ({total - val_cutoff} pairs)")
    print(f"   🔍 Validation set: {val_dir} ({val_cutoff} pairs)")




def main():
    print("=" * 60)
    print("  Processing User-Provided Before/After Road Images")
    print("=" * 60)

    img1 = UPLOAD_DIR / "media_1789819913908.jpg"
    img2 = UPLOAD_DIR / "media_1789819925442.jpg"

    pairs1 = extract_collage_1(img1)
    pairs2 = extract_collage_2(img2)

    all_pairs = pairs1 + pairs2
    if all_pairs:
        save_and_annotate(all_pairs)
    else:
        print("❌ No images found in upload directory.")


if __name__ == "__main__":
    main()
