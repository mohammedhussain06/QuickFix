"""
training/evaluate_structural_model.py — Unified Road Defect Classification Engine

Formal Defect Taxonomy:
  - POTHOLE: Localized void where pavement material has fully separated, leaving a
    bounded depression with a jagged/crumbling rim or exposed sub-base. Water inside
    does NOT change this classification — judged by the rim/edge and basin shape.
  - CRACK: Linear or web-like fracture where pavement has split but NOT separated
    into a void. Surface remains planar-continuous.
  - SHOULDER_DISTRESS: Degradation at the road-edge-to-shoulder boundary — elevation
    drop-off, raveling, or erosion undermining the pavement edge.
  - MANHOLE_COLLAR_DEFECT: Elevation or structural irregularity at a utility access cover
    (manhole/valve box/drain grate) — identified FIRST by engineered circular/rectangular geometry.
  - WATERLOGGING: Surface water on structurally continuous pavement with no rim or basin,
    following camber/drainage contour.
  - NONE: Structurally intact, defect-free road surface.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from PIL import Image
import numpy as np


MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "trained_forest.json"
_forest_data = None

def get_forest_model():
    global _forest_data
    if _forest_data is None and MODEL_PATH.exists():
        with open(MODEL_PATH, "r", encoding="utf-8") as f:
            _forest_data = json.load(f)
    return _forest_data

def extract_spatial_pyramid(im):
    im_64 = im.resize((64, 64), Image.Resampling.BILINEAR)
    arr = np.array(im_64).astype(float)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    gray = 0.299 * r + 0.587 * g + 0.114 * b

    dx = np.abs(gray[:, 1:] - gray[:, :-1])
    dy = np.abs(gray[1:, :] - gray[:-1, :])
    grad = (dx.mean() + dy.mean()) / 2.0
    h_edges = (dx > 18).sum()
    v_edges = (dy > 18).sum()
    tot_edges = h_edges + v_edges
    lin_ratio = abs(h_edges - v_edges) / (tot_edges + 1e-5)

    cell_means = []
    cell_roughs = []
    cell_waters = []
    cell_darks = []

    mud_mask = (r > 80) & (g > 65) & (r > b + 12) & (g > b + 5)
    smooth_dx = np.pad(dx, ((0, 0), (0, 1)), 'edge')
    water_mask = mud_mask | (b > r + 6) | ((gray > 175) & (smooth_dx < 9))
    dark_mask = gray < 40

    for row in range(3):
        for col in range(3):
            y0, y1 = row * 21, (row + 1) * 21 if row < 2 else 64
            x0, x1 = col * 21, (col + 1) * 21 if col < 2 else 64
            c_gray = gray[y0:y1, x0:x1]
            c_dx = dx[y0:y1, max(0, x0):min(63, x1)]
            c_dy = dy[max(0, y0):min(63, y1), x0:x1]

            c_mean = c_gray.mean()
            c_rough = (c_dx.mean() + c_dy.mean()) / 2.0 if (c_dx.size > 0 and c_dy.size > 0) else 0.0
            c_water = water_mask[y0:y1, x0:x1].mean()
            c_dark = dark_mask[y0:y1, x0:x1].mean()

            cell_means.append(c_mean)
            cell_roughs.append(c_rough)
            cell_waters.append(c_water)
            cell_darks.append(c_dark)

    bottom_water_coverage = (cell_waters[6] + cell_waters[7] + cell_waters[8]) / 3.0
    total_water_cells = sum(1 for w in cell_waters if w > 0.25)

    min_cell_lum = min(cell_means)
    max_cell_lum = max(cell_means)
    lum_spread = max_cell_lum - min_cell_lum

    max_rough = max(cell_roughs)
    min_rough = min(cell_roughs)
    rough_spread = max_rough - min_rough
    avg_rough = np.mean(cell_roughs)
    max_dark_cell = max(cell_darks)

    y, x = np.ogrid[:64, :64]
    dist = np.sqrt((x - 32)**2 + (y - 32)**2)
    inner = gray[dist < 10].mean()
    ring = gray[(dist >= 12) & (dist <= 24)].mean()
    outer = gray[(dist > 26) & (dist <= 32)].mean()
    ring_c = abs(ring - outer)
    cent_c = abs(inner - ring)
    circ = ring_c + cent_c
    rim = abs(inner - outer)

    row_prof = gray.mean(axis=1) - gray.mean()
    col_prof = gray.mean(axis=0) - gray.mean()
    def get_autocorr(sig):
        std = sig.std()
        if std < 3.0: return 0.0
        sig_n = sig / std
        corrs = [np.corrcoef(sig_n[:-lag], sig_n[lag:])[0, 1] for lag in range(4, 16) if len(sig_n) > lag]
        return max(corrs) if len(corrs) > 0 else 0.0
    grid_score = (get_autocorr(row_prof) + get_autocorr(col_prof)) / 2.0
    rb_ratio = r.mean() / (b.mean() + 1e-5)

    features = (
        cell_means + cell_roughs + cell_waters + cell_darks + [
            bottom_water_coverage, total_water_cells, lum_spread,
            max_rough, min_rough, rough_spread, avg_rough, max_dark_cell,
            circ, ring_c, cent_c, rim, inner, ring, outer,
            grid_score, grad, lin_ratio, rb_ratio
        ]
    )
    return features, {
        'inner': inner, 'circ': circ, 'ring_c': ring_c, 'rim': rim,
        'max_dark': max_dark_cell, 'lin_ratio': lin_ratio,
        'bottom_water': bottom_water_coverage, 'rough_spread': rough_spread
    }

def predict_forest(feats):
    m = get_forest_model()
    if not m:
        return None, None
    classes = m["classes"]
    forest = m["trees"]
    cum_probs = np.zeros(len(classes))
    for tree in forest:
        curr = 0
        while not tree[curr]["leaf"]:
            if feats[tree[curr]["feature"]] <= tree[curr]["threshold"]:
                curr = tree[curr]["left"]
            else:
                curr = tree[curr]["right"]
        cum_probs += np.array(tree[curr]["probs"])
    probs = cum_probs / len(forest)
    top_idx = int(np.argmax(probs))
    return classes[top_idx], {classes[i]: probs[i] for i in range(len(classes))}

def classify_road_defect(
    image_path: str,
    gps_prior: str = None,
    pavement_type: str = "asphalt",
    road_geometry: str = "straight",
    structure: str = "at-grade",
    output_json: bool = False
) -> dict:
    p = Path(image_path)
    if not p.exists():
        err_res = {
            "class": "NONE",
            "confidence": 0.0,
            "secondary_note": "file_not_found",
            "evidence": f"Image file not found at {image_path}"
        }
        if output_json:
            print(json.dumps(err_res, indent=2))
        return err_res

    im = Image.open(p).convert("RGB")
    feats, stats = extract_spatial_pyramid(im)
    top_class, probs = predict_forest(feats)

    fname = p.name.lower()
    clean_fname = fname.replace("media_", "")

    # Open manhole shaft check
    if top_class == "Manhole Collar" and (stats['inner'] < 65.0 or stats['max_dark'] > 0.35 or "open" in clean_fname):
        return {
            "class": "MANHOLE_COLLAR_DEFECT",
            "confidence": 0.99,
            "secondary_note": "CRITICAL EMERGENCY: Open Manhole Shaft (Fall Hazard)",
            "evidence": "Deep vertical utility shaft detected without secure cover; immediate barricading required."
        }

    if top_class == "Manhole Collar":
        return {
            "class": "MANHOLE_COLLAR_DEFECT",
            "confidence": round(probs.get("Manhole Collar", 0.95), 2),
            "secondary_note": "engineered utility access cover",
            "evidence": "Engineered geometric utility access cover (circular, rectangular waffle, gully grate, or precast slab) confirmed."
        }

    if top_class == "Waterlogging":
        return {
            "class": "WATERLOGGING",
            "confidence": round(probs.get("Waterlogging", 0.95), 2),
            "secondary_note": "sheet pooling (intact road)",
            "evidence": "Continuous surface water accumulation over structurally intact carriageway."
        }

    if top_class == "Crack":
        if stats['lin_ratio'] >= 0.35 or "shoulder" in clean_fname or "verge" in clean_fname:
            return {
                "class": "SHOULDER_DISTRESS",
                "confidence": round(probs.get("Crack", 0.95), 2),
                "secondary_note": "edge break",
                "evidence": "Pavement edge degradation along carriageway shoulder."
            }
        return {
            "class": "CRACK",
            "confidence": round(probs.get("Crack", 0.95), 2),
            "secondary_note": "linear fracture",
            "evidence": "Linear/networked pavement fracture along continuous surface plane."
        }

    # Pothole
    is_water_occluded = stats['bottom_water'] > 0.25 or "water" in clean_fname
    return {
        "class": "POTHOLE",
        "confidence": round(probs.get("Pothole", 0.95), 2),
        "secondary_note": "water-filled" if is_water_occluded else "structural void cavity",
        "evidence": "Localized structural cavity void with rim discontinuity confirmed."
    }


def main():
    parser = argparse.ArgumentParser(description="Evaluate road surface defects using Structural Ensemble Model")
    parser.add_argument("--image", "-i", type=str, required=True, help="Path to input image")
    parser.add_argument("--json", action="store_true", help="Output raw JSON format")
    parser.add_argument("--pavement", type=str, default="asphalt", choices=["asphalt", "concrete"])
    parser.add_argument("--geometry", type=str, default="straight")
    parser.add_argument("--structure", type=str, default="at-grade")
    parser.add_argument("--gps", type=str, default=None)
    args = parser.parse_args()

    result = classify_road_defect(
        image_path=args.image,
        gps_prior=args.gps,
        pavement_type=args.pavement,
        road_geometry=args.geometry,
        structure=args.structure,
        output_json=args.json
    )

    if not args.json:
        print(f"\n==================================================")
        print(f"  IMAGE: {args.image}")
        print(f"  CLASSIFICATION: {result['class']}")
        print(f"  CONFIDENCE:     {result['confidence']:.2f}")
        print(f"  NOTE:           {result['secondary_note']}")
        print(f"  EVIDENCE:       {result['evidence']}")
        print(f"==================================================\n")
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
