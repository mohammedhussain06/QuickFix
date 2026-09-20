# YOLOv8 Pothole Detection — Fine-Tuning Guide

## What this does
Fine-tunes a pretrained `yolov8n-seg` model specifically on pothole images
so Step 5 of the verification pipeline can accurately detect:
- `pothole` / `road_damage` in the **before** photo ✅
- Absence of pothole + presence of `road_patch` in the **after** photo ✅

## Folder Structure
```
training/
├── train_yolo.py          ← Main training script
├── dataset.yaml           ← Dataset config (classes, paths)
├── download_dataset.py    ← Auto-download from Roboflow
├── evaluate_model.py      ← Test the trained model on demo images
├── export_model.py        ← Export to ONNX for production
└── README.md              ← This file
```

## Step-by-Step

### 1. Install dependencies
```bash
pip install ultralytics roboflow
```

### 2. Download the dataset
```bash
python training/download_dataset.py
# Downloads ~3,000 pothole images with segmentation masks from Roboflow
```

### 3. Train the model
```bash
python training/train_yolo.py
# Takes ~20–40 min on a GPU, ~2–3 hours on CPU
# Trained weights saved to: models/pothole_yolov8/weights/best.pt
```

### 4. Evaluate on demo images
```bash
python training/evaluate_model.py --image path/to/pothole.jpg
```

### 5. Update .env to point to the trained model
```env
YOLO_MODEL_PATH=models/pothole_yolov8/weights/best.pt
```

## Dataset
- **Source**: Roboflow Universe — "Pothole Segmentation" dataset
- **Size**: ~3,000 images (train/val/test split)
- **Classes**: `pothole`, `road_damage`
- **License**: CC BY 4.0 (free for commercial use)
- **Link**: https://universe.roboflow.com/pothole-detection/pothole-segmentation

## Expected Results After Fine-Tuning
| Metric | Pretrained (generic) | Fine-tuned |
|---|---|---|
| mAP50 on potholes | ~0.20 | ~0.75+ |
| False positives | High | Low |
| Inference time | ~15ms | ~15ms (same) |
