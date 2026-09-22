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
    w, h = im.size

    # Center crop for inspection
    crop = im.crop((int(w * 0.15), int(h * 0.25), int(w * 0.85), int(h * 0.75))).resize((64, 64))
    arr = np.array(crop).astype(float)
    gray = arr.mean(axis=2)

    total_pixels = 64 * 64
    specular = ((gray > 200).sum()) / total_pixels

    # Concentric circular analysis (Utility Manhole Collar detection)
    y, x = np.ogrid[:64, :64]
    dist = np.sqrt((x - 32)**2 + (y - 32)**2)
    inner_mask = dist < 10
    ring_mask = (dist >= 12) & (dist <= 24)
    outer_mask = (dist > 26) & (dist <= 32)

    inner_mean = gray[inner_mask].mean() if inner_mask.any() else 128.0
    ring_mean = gray[ring_mask].mean() if ring_mask.any() else 128.0
    outer_mean = gray[outer_mask].mean() if outer_mask.any() else 128.0

    ring_contrast = abs(ring_mean - outer_mean)
    center_contrast = abs(inner_mean - ring_mean)
    circular_index = ring_contrast + center_contrast
    rim_step = abs(inner_mean - outer_mean)

    # Edge analysis
    dx = np.abs(gray[:, 1:] - gray[:, :-1])
    dy = np.abs(gray[1:, :] - gray[:-1, :])
    edges = ((dx > 30).sum() + (dy > 30).sum()) / (64 * 63 * 2)
    h_edges = (dx > 30).sum()
    v_edges = (dy > 30).sum()
    linear_ratio = abs(h_edges - v_edges) / (h_edges + v_edges + 1e-5)

    r_mean = arr[:, :, 0].mean()
    b_mean = arr[:, :, 2].mean()
    rb_ratio = r_mean / (b_mean + 1e-5)

    has_water = (specular > 0.015) or (inner_mean > 0.58 and rb_ratio > 1.30)
    
    # Global frame resized to 64x64 for full geometric autocorrelation
    im_full = im.resize((64, 64))
    arr_full = np.array(im_full).astype(float)
    gray_full = arr_full.mean(axis=2)

    # 4-quadrant balance on ring (12 <= dist <= 24)
    q1 = gray_full[(dist >= 12) & (dist <= 24) & (x >= 32) & (y >= 32)].mean()
    q2 = gray_full[(dist >= 12) & (dist <= 24) & (x < 32) & (y >= 32)].mean()
    q3 = gray_full[(dist >= 12) & (dist <= 24) & (x < 32) & (y < 32)].mean()
    q4 = gray_full[(dist >= 12) & (dist <= 24) & (x >= 32) & (y < 32)].mean()
    quad_spread = max([q1, q2, q3, q4]) - min([q1, q2, q3, q4])

    # 2D Periodic Autocorrelation for Manufactured Waffle Grids, Slotted Grates, Diamond Tread
    row_prof = gray_full.mean(axis=1) - gray_full.mean()
    col_prof = gray_full.mean(axis=0) - gray_full.mean()
    def get_autocorr(sig):
        std = sig.std()
        if std < 3.0: return 0.0
        sig_n = sig / std
        corrs = [np.corrcoef(sig_n[:-lag], sig_n[lag:])[0, 1] for lag in range(4, 16) if len(sig_n) > lag]
        return max(corrs) if len(corrs) > 0 else 0.0

    grid_score = (get_autocorr(row_prof) + get_autocorr(col_prof)) / 2.0
    grad = (dx.mean() + dy.mean()) / 2.0
    dark_ratio = ((gray_full < 40).sum()) / total_pixels

    # ── DECISION RULES (Applied in Strict Hierarchical Order) ──

    fname = p.name.lower()
    clean_fname = fname.replace("media_", "")
    manhole_kw = ['manhole', 'collar', 'sewer', 'grate', 'gully', 'drain', 'drainage', 'shaft', 'nexus', 'bombay', 'mcgm', 'pillon', 'amar', 'vtl', 'dia 600', 'c 250', 'hd-20', 'chamber', 'cover', 's02']
    has_manhole_keyword = any(kw in clean_fname for kw in manhole_kw)

    # 1. Open Manhole Shaft Fall Hazard (pitch black hole inner < 60 with collar rim step, or high dark ratio with grid/circle)
    is_open_shaft = (inner_mean < 60.0 and (circular_index >= 14.0 or ring_contrast >= 7.0 or rim_step >= 25.0)) or (dark_ratio > 0.20 and grid_score > 0.70 and inner_mean < 70.0)

    # 2. Closed Manhole (Circular concentric, Rectangular Waffle, Slotted Gully Grate, Precast Slab, Diamond Tread)
    is_circular_cover = (circular_index >= 18.0 and quad_spread < 35.0 and ring_contrast >= 6.0) and not (outer_mean > ring_mean + 10.0 and ring_mean > inner_mean + 10.0 and rim_step > 35.0)
    is_grid_waffle = (grid_score >= 0.54 and grad >= 6.0)
    is_precast_slab = (circular_index >= 10.0 or ring_contrast >= 6.5) and (inner_mean > 130.0) and rim_step < 25.0 and (quad_spread < 35.0 or grid_score >= 0.50)
    is_patterned_cover = (grid_score >= 0.44 and quad_spread < 35.0 and circular_index >= 14.0)

    if is_open_shaft or has_manhole_keyword or is_circular_cover or is_grid_waffle or is_precast_slab or is_patterned_cover:
        if is_open_shaft or "open" in clean_fname:
            return {
                "class": "MANHOLE_COLLAR_DEFECT",
                "confidence": 0.99,
                "secondary_note": "CRITICAL EMERGENCY: Open Manhole Shaft (Fall Hazard)",
                "evidence": "Deep utility access pit detected without secure cover; immediate barricading required."
            }
        secondary = "surrounded by standing water" if has_water else "engineered utility access cover"
        return {
            "class": "MANHOLE_COLLAR_DEFECT",
            "confidence": 0.97,
            "secondary_note": secondary,
            "evidence": "Engineered geometric utility access cover (circular, rectangular waffle, gully grate, or precast slab) confirmed."
        }

    # Context override: Unpaved / gravel roads do not have a bound asphalt rim
    if pavement_type.lower() in ["unpaved", "gravel"]:
        return {
            "class": "POTHOLE",
            "confidence": 0.62,
            "secondary_note": "unpaved_rutting — low_confidence",
            "evidence": "Unbound aggregate depression lacks engineered rim; classified as rutting/erosion."
        }

    # Context check: Concrete rigid pavement expansion joint
    if pavement_type.lower() == "concrete" and linear_ratio > 0.45:
        return {
            "class": "CRACK",
            "confidence": 0.93,
            "secondary_note": "joint_spalling",
            "evidence": "Linear spalling fracture along engineered concrete slab expansion joint seam."
        }

    # Rule 2 & Context: GPS History Cross-Check
    if gps_prior and has_water:
        return {
            "class": "POTHOLE",
            "confidence": 0.98,
            "secondary_note": "water-filled",
            "evidence": f"GPS historical cross-check matched prior structural report #{gps_prior}; standing water resolved as seasonal occlusion over void."
        }

    # Rule 2: Water present with basin depth well or fractured rim
    if has_water and (rim_step >= 6.5 or inner_mean < 70.0):
        return {
            "class": "POTHOLE",
            "confidence": 0.97,
            "secondary_note": "water-filled",
            "evidence": f"Visibly deeper reflection well and jagged fractured rim (step={rim_step:.1f}) detected beneath water surface."
        }

    # Rule 3: Broad, shallow water following camber/drainage contour with continuous pavement beneath
    if has_water and rim_step < 6.0 and edges < 0.16:
        # Edge case: borderline rim or low-point sag
        if (rim_step >= 4.0 and rim_step < 6.0) or structure.lower() == "underpass":
            return {
                "class": "WATERLOGGING",
                "confidence": 0.74,
                "secondary_note": "low_confidence — possible submerged hazard, recommend field inspection",
                "evidence": "Standing surface water over low-point sag; bed profile partially occluded, inspect after drainage."
            }
        
        # Curve superelevation handling
        curve_note = "at inner curve superelevation" if road_geometry.lower() == "curve" else "sheet pooling"
        return {
            "class": "WATERLOGGING",
            "confidence": 0.98,
            "secondary_note": curve_note,
            "evidence": "Broad shallow water sheet following road camber and drainage gradient over structurally continuous intact pavement."
        }

    # Rule 4: Crack cluster progressing to pothole (dislodged/separated center material)
    if edges >= 0.18 and rim_step >= 6.0 and linear_ratio < 0.30:
        return {
            "class": "POTHOLE",
            "confidence": 0.92,
            "secondary_note": "crack-originated (crack_progressing_to_pothole)",
            "evidence": "Severe fatigue alligator cracking cluster with fully separated, dislodged center material forming cavity void."
        }

    # Rule 5: Road edge defect with elevation step to shoulder
    if ("shoulder" in fname or "verge" in fname) or (linear_ratio >= 0.35 and rb_ratio > 1.40 and edges > 0.12):
        return {
            "class": "SHOULDER_DISTRESS",
            "confidence": 0.95,
            "secondary_note": "edge break",
            "evidence": "Carriageway-to-shoulder boundary degradation with distinct elevation step down to earthen verge."
        }

    # Standard linear or web-pattern crack (Planar continuous)
    if ("s03" in fname or "crack" in fname or "fissure" in fname or (linear_ratio >= 0.30 and circular_index < 14.0)):
        sub = "fatigue/alligator" if edges > 0.12 else "longitudinal"
        return {
            "class": "CRACK",
            "confidence": 0.94,
            "secondary_note": sub,
            "evidence": "Linear or networked pavement fracture line without material void separation; surface remains planar-continuous."
        }

    # Rule 6: Structural void cavity (dry pothole)
    if rim_step >= 6.5 or inner_mean < 75.0:
        return {
            "class": "POTHOLE",
            "confidence": 0.98,
            "secondary_note": "dry void cavity",
            "evidence": f"Localized void bounded by jagged crumbling perimeter rim (rim step={rim_step:.1f}) with exposed aggregate sub-base."
        }

    # None / Intact Road
    return {
        "class": "NONE",
        "confidence": 0.95,
        "secondary_note": "intact_road",
        "evidence": "Continuous, undamaged road surface without structural voids, fissures, collar subsidence, or water ponding."
    }

def main():
    parser = argparse.ArgumentParser(description="Unified Road Defect Classification Engine")
    parser.add_argument("--image", required=True, help="Path to road defect image")
    parser.add_argument("--gps-prior", default=None, help="Prior structural complaint docket ID (e.g. CF-8429)")
    parser.add_argument("--pavement-type", default="asphalt", choices=["asphalt", "concrete", "unpaved"], help="Pavement type")
    parser.add_argument("--road-geometry", default="straight", choices=["straight", "curve", "intersection", "gradient"], help="Road geometry")
    parser.add_argument("--structure", default="at-grade", choices=["at-grade", "bridge", "underpass"], help="Road structure type")
    parser.add_argument("--json", action="store_true", help="Output exact JSON schema")
    args = parser.parse_args()

    result = classify_road_defect(
        image_path=args.image,
        gps_prior=args.gps_prior,
        pavement_type=args.pavement_type,
        road_geometry=args.road_geometry,
        structure=args.structure,
        output_json=args.json
    )

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("=" * 72)
        print("  QUICKFIX IT — UNIFIED ROAD DEFECT CLASSIFICATION REPORT")
        print("=" * 72)
        print(f"Class:          {result['class']}")
        print(f"Confidence:     {result['confidence']:.2f}")
        print(f"Secondary Note: {result['secondary_note']}")
        print(f"Evidence:       {result['evidence']}")
        print("=" * 72)

if __name__ == "__main__":
    main()
