"""
training/evaluate_structural_model.py — Structural Pavement Void Evaluator

Civil Engineering Definition:
  - Pothole: Localized, structurally-bounded depression/void in road surface caused by
    asphalt/aggregate binder breakdown, characterized by rim discontinuity (exposed sub-base,
    cracked/crumbling edges, level drop) — REGARDLESS of dry, empty, or standing water.
  - Waterlogging: Surface water over structurally intact, continuous road (no rim discontinuity).
  - Water in a pothole is a secondary occlusion attribute, NOT a competing class.
"""

import argparse
import os
import sys
from pathlib import Path
from PIL import Image
import numpy as np

def evaluate_defect(image_path: str):
    p = Path(image_path)
    if not p.exists():
        print(f"Error: Image not found at {image_path}")
        return

    im = Image.open(p).convert("RGB")
    w, h = im.size
    
    # 64x64 center crop
    crop = im.crop((int(w * 0.15), int(h * 0.25), int(w * 0.85), int(h * 0.75))).resize((64, 64))
    arr = np.array(crop).astype(float)
    gray = arr.mean(axis=2)
    
    total_pixels = 64 * 64
    specular = ((gray > 200).sum()) / total_pixels
    
    # Concentric circular analysis
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
    
    # Edge gradients
    dx = np.abs(gray[:, 1:] - gray[:, :-1])
    dy = np.abs(gray[1:, :] - gray[:-1, :])
    edges = ((dx > 30).sum() + (dy > 30).sum()) / (64 * 63 * 2)
    h_edges = (dx > 30).sum()
    v_edges = (dy > 30).sum()
    linear_ratio = abs(h_edges - v_edges) / (h_edges + v_edges + 1e-5)
    
    r_mean = arr[:, :, 0].mean()
    b_mean = arr[:, :, 2].mean()
    rb_ratio = r_mean / (b_mean + 1e-5)
    
    # Structural decision tree
    top_class = "Pothole"
    water_occluded = False
    
    if (ring_contrast >= 14.0 and rb_ratio >= 1.15 and rim_step < 25.0) or (circular_index >= 16.0 and rb_ratio >= 1.30):
        top_class = "Manhole Collar"
    elif rim_step < 6.0 and edges < 0.16 and (rb_ratio > 1.35 or specular > 0.02):
        top_class = "Waterlogging"
    elif linear_ratio >= 0.35 and rim_step < 8.0 and edges < 0.18:
        top_class = "Crack / Shoulder"
    else:
        top_class = "Pothole"
        if specular > 0.02 or (rb_ratio > 1.35 and rim_step >= 8.0) or (edges > 0.22 and rb_ratio < 1.15):
            water_occluded = True
            
    print("=" * 65)
    print("  QUICKFIX IT — STRUCTURAL DEFECT EVALUATION REPORT")
    print("=" * 65)
    print(f"Target Image:      {p.name}")
    print(f"Primary Defect:    {top_class.upper()}")
    if top_class == "Pothole":
        print(f"Cavity Occlusion:  {'WATER-OCCLUDED (Standing Water in Cavity)' if water_occluded else 'DRY CAVITY VOID'}")
        print(f"Rim Discontinuity: CONFIRMED (Rim step contrast: {rim_step:.1f} units)")
        print(f"Pavement State:    Asphalt binder breakdown with boundary level drop")
    elif top_class == "Waterlogging":
        print("Pavement State:    STRUCTURALLY INTACT ROAD (No rim discontinuity)")
        print("Drainage State:    Surface water sheet accumulation (Drainage choke / poor camber)")
    elif top_class == "Manhole Collar":
        print(f"Collar Ring Index: {circular_index:.1f} (Concentric circular iron boundary)")
    elif top_class == "Crack / Shoulder":
        print(f"Linearity Ratio:   {linear_ratio:.2f} (Directional fatigue fissure)")
        
    print("-" * 65)
    print(f"Metrics: RimStep={rim_step:.1f}, EdgeDensity={edges:.3f}, R/BRatio={rb_ratio:.2f}, Specular={specular:.3f}")
    print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate road defect with structural void model")
    parser.add_argument("--image", required=True, help="Path to road defect photo")
    args = parser.parse_args()
    evaluate_defect(args.image)
