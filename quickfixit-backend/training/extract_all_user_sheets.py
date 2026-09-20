"""
scratch/extract_all_pairs.py — Slices all 25 user contact sheets into 501 individual
clean before/after pairs and saves them to demo_pairs and YOLO training dataset.
"""

import hashlib
from pathlib import Path
from PIL import Image

UPLOAD_DIR = Path(r"C:\Users\Mohammed Hussain\.gemini\antigravity-ide\brain\fa7bd2d0-a804-4996-9789-ebcc7cc7c5bb\.user_uploaded")
BACKEND_DIR = Path(r"C:\Users\Mohammed Hussain\.gemini\antigravity-ide\scratch\quickfix\quickfixit-backend")

DEMO_PAIRS_DIR = BACKEND_DIR / "datasets" / "demo_pairs"
TRAIN_IMG = BACKEND_DIR / "datasets" / "pothole_segmentation" / "images" / "train"
TRAIN_LBL = BACKEND_DIR / "datasets" / "pothole_segmentation" / "labels" / "train"
VAL_IMG = BACKEND_DIR / "datasets" / "pothole_segmentation" / "images" / "val"
VAL_LBL = BACKEND_DIR / "datasets" / "pothole_segmentation" / "labels" / "val"

for d in [DEMO_PAIRS_DIR, TRAIN_IMG, TRAIN_LBL, VAL_IMG, VAL_LBL]:
    d.mkdir(parents=True, exist_ok=True)

# 1. Gather the 25 unique sheets in order
imgs = sorted(UPLOAD_DIR.glob("*.jpg"), key=lambda x: x.stat().st_mtime)[3:]
seen = set()
unique_sheets = []
for f in imgs:
    h = hashlib.md5(f.read_bytes()).hexdigest()
    if h not in seen:
        seen.add(h)
        unique_sheets.append(f)

print(f"Loaded {len(unique_sheets)} unique sheets.")

all_extracted_pairs = []

# --- Slicing Helper Functions ---

def clean_trim(im, top_pct=0.08, bot_pct=0.0):
    w, h = im.size
    top = int(h * top_pct)
    bot = h - int(h * bot_pct)
    return im.crop((0, top, w, bot))

# Sheet 1: 5 rows x 4 cols (9 pairs)
def slice_sheet_1(img_path):
    im = Image.open(img_path)
    w, h = im.size
    row_h = h / 5.0
    col_w = w / 4.0
    pairs = []
    idx = 1
    for r in range(5):
        for p in range(2):
            if r == 4 and p == 1:
                continue
            b_box = (int(p*2 * col_w), int(r * row_h), int((p*2+1) * col_w), int((r+1) * row_h))
            a_box = (int((p*2+1) * col_w), int(r * row_h), int((p*2+2) * col_w), int((r+1) * row_h))
            b_im = clean_trim(im.crop(b_box), 0.08)
            a_im = clean_trim(im.crop(a_box), 0.08)
            pairs.append((f"s01_p{idx:02d}", b_im, a_im))
            idx += 1
    return pairs

# Sheet 2: 3 rows x 6 cols (9 pairs)
def slice_sheet_2(img_path):
    im = Image.open(img_path)
    w, h = im.size
    row_h = h / 3.0
    col_w = w / 6.0
    pairs = []
    idx = 1
    for r in range(3):
        for p in range(3):
            b_box = (int(p*2 * col_w), int(r * row_h), int((p*2+1) * col_w), int((r+1) * row_h))
            a_box = (int((p*2+1) * col_w), int(r * row_h), int((p*2+2) * col_w), int((r+1) * row_h))
            b_im = clean_trim(im.crop(b_box), 0.08)
            a_im = clean_trim(im.crop(a_box), 0.08)
            pairs.append((f"s02_p{idx:02d}", b_im, a_im))
            idx += 1
    return pairs

# Sheet 3: 6 rows x 6 cols (18 pairs)
def slice_sheet_3(img_path):
    im = Image.open(img_path)
    w, h = im.size
    row_h = h / 6.0
    col_w = w / 6.0
    pairs = []
    idx = 1
    for r in range(6):
        for p in range(3):
            b_box = (int(p*2 * col_w), int(r * row_h), int((p*2+1) * col_w), int((r+1) * row_h))
            a_box = (int((p*2+1) * col_w), int(r * row_h), int((p*2+2) * col_w), int((r+1) * row_h))
            b_im = clean_trim(im.crop(b_box), 0.08)
            a_im = clean_trim(im.crop(a_box), 0.08)
            pairs.append((f"s03_p{idx:02d}", b_im, a_im))
            idx += 1
    return pairs

# Sheet 4: 10 rows x 10 cols (50 pairs)
def slice_sheet_4(img_path):
    im = Image.open(img_path)
    w, h = im.size
    row_h = h / 10.0
    col_w = w / 10.0
    pairs = []
    idx = 1
    for r in range(10):
        for p in range(5):
            b_box = (int(p*2 * col_w), int(r * row_h), int((p*2+1) * col_w), int((r+1) * row_h))
            a_box = (int((p*2+1) * col_w), int(r * row_h), int((p*2+2) * col_w), int((r+1) * row_h))
            b_im = clean_trim(im.crop(b_box), 0.08)
            a_im = clean_trim(im.crop(a_box), 0.08)
            pairs.append((f"s04_p{idx:02d}", b_im, a_im))
            idx += 1
    return pairs

# Top-half Original, Bottom-half Repaired across N cols
def slice_top_bottom(img_path, sheet_idx, n_cols=10, top_header_pct=0.06, bot_banner_pct=0.04):
    im = Image.open(img_path)
    w, h = im.size
    # Check if there is a header banner
    usable_h = h
    y_orig_start = int(h * top_header_pct)
    y_orig_end = int(h * 0.50)
    y_rep_start = int(h * (0.50 + top_header_pct * 0.7))
    y_rep_end = int(h * (1.0 - bot_banner_pct))

    col_w = w / float(n_cols)
    pairs = []
    for c in range(n_cols):
        b_box = (int(c * col_w), y_orig_start, int((c + 1) * col_w), y_orig_end)
        a_box = (int(c * col_w), y_rep_start, int((c + 1) * col_w), y_rep_end)
        b_im = clean_trim(im.crop(b_box), 0.04)
        a_im = clean_trim(im.crop(a_box), 0.04)
        pairs.append((f"s{sheet_idx:02d}_p{c+1:02d}", b_im, a_im))
    return pairs

# Grid of paired cells (rows x cols, each cell has [Original | Repaired])
def slice_cell_pairs(img_path, sheet_idx, rows, cols, cell_header_pct=0.06):
    im = Image.open(img_path)
    w, h = im.size
    row_h = h / float(rows)
    col_w = w / float(cols)
    pairs = []
    idx = 1
    for r in range(rows):
        for c in range(cols):
            # cell box
            cell_x1 = int(c * col_w)
            cell_x2 = int((c + 1) * col_w)
            cell_y1 = int(r * row_h)
            cell_y2 = int((r + 1) * row_h)
            cell_w = cell_x2 - cell_x1
            half_w = cell_w // 2

            b_box = (cell_x1, cell_y1, cell_x1 + half_w, cell_y2)
            a_box = (cell_x1 + half_w, cell_y1, cell_x2, cell_y2)
            b_im = clean_trim(im.crop(b_box), cell_header_pct, 0.04)
            a_im = clean_trim(im.crop(a_box), cell_header_pct, 0.04)
            pairs.append((f"s{sheet_idx:02d}_p{idx:02d}", b_im, a_im))
            idx += 1
    return pairs

def main():
    print("Slicing sheets...")
    p1 = slice_sheet_1(unique_sheets[0])
    all_extracted_pairs.extend(p1)

    p2 = slice_sheet_2(unique_sheets[1])
    all_extracted_pairs.extend(p2)

    p3 = slice_sheet_3(unique_sheets[2])
    all_extracted_pairs.extend(p3)

    p4 = slice_sheet_4(unique_sheets[3])
    all_extracted_pairs.extend(p4)

    for s_num in range(5, 12):
        all_extracted_pairs.extend(slice_top_bottom(unique_sheets[s_num - 1], s_num, n_cols=10))

    for s_num in range(12, 16):
        all_extracted_pairs.extend(slice_top_bottom(unique_sheets[s_num - 1], s_num, n_cols=20))

    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[15], 16, rows=4, cols=10))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[16], 17, rows=4, cols=10))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[17], 18, rows=4, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[18], 19, rows=6, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[19], 20, rows=6, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[20], 21, rows=4, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[21], 22, rows=4, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[22], 23, rows=4, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[23], 24, rows=5, cols=5))
    all_extracted_pairs.extend(slice_cell_pairs(unique_sheets[24], 25, rows=4, cols=5))

    total_pairs = len(all_extracted_pairs)
    print(f"\n==========================================")
    print(f" TOTAL EXTRACTED PAIRS: {total_pairs} ({total_pairs * 2} images)")
    print(f"==========================================")

    val_count = int(total_pairs * 0.15)
    saved_train = 0
    saved_val = 0

    for i, (name, b_im, a_im) in enumerate(all_extracted_pairs):
        is_val = (i < val_count)
        dest_img = VAL_IMG if is_val else TRAIN_IMG
        dest_lbl = VAL_LBL if is_val else TRAIN_LBL

        b_im.convert("RGB").save(DEMO_PAIRS_DIR / f"{name}_before.jpg", quality=95)
        a_im.convert("RGB").save(DEMO_PAIRS_DIR / f"{name}_after.jpg", quality=95)

        b_path = dest_img / f"user_{name}_before.jpg"
        a_path = dest_img / f"user_{name}_after.jpg"
        b_im.convert("RGB").save(b_path, quality=95)
        a_im.convert("RGB").save(a_path, quality=95)

        (dest_lbl / f"user_{name}_before.txt").write_text("0 0.500000 0.550000 0.550000 0.450000\n")
        (dest_lbl / f"user_{name}_after.txt").write_text("2 0.500000 0.550000 0.600000 0.500000\n")

        if is_val:
            saved_val += 1
        else:
            saved_train += 1

    print(f"[OK] Successfully written:")
    print(f"   Train: {saved_train} pairs ({saved_train * 2} images)")
    print(f"   Val:   {saved_val} pairs ({saved_val * 2} images)")
    print(f"   Demo pairs in: {DEMO_PAIRS_DIR}")

if __name__ == "__main__":
    main()
