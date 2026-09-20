# 🛠️ QuickFix It — Backend API & CV Verification Engine

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](https://fastapi.tiangolo.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange.svg)](https://docs.ultralytics.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-CUDA%20Accelerated-EE4C2C.svg)](https://pytorch.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**QuickFix It** is a transparent municipal civic-issue tracking backend with a **5-step anti-gaming Computer Vision (CV) verification engine**. It prevents fraudulent contractor payouts by cryptographically and visually verifying road repairs before approving citizen grievance resolution.

---

## 🌟 Key Capabilities

1. **Anti-Fraud Multi-Tier Verification Pipeline**:
   - **Step 1: Cryptographic EXIF Integrity** — Flags recompressed, edited, stripped, or AI-generated photos.
   - **Step 2: Geo-Spatial Haversine Check** — Validates that repair photos were captured within ≤20m of the reported pothole GPS coordinates.
   - **Step 3: Camera Orientation & Heading** — Compares compass azimuth and tilt angle between before and after photos.
   - **Step 4: Background Landmark Matching (SIFT/ORB)** — Computes homography and inlier features to guarantee both photos share the exact same street environment.
   - **Step 5: Fine-Tuned YOLOv8 Repair Confirmation** — Validates damage in the before photo and confirms a clean asphalt repair patch in the after photo.
2. **Multi-Role RBAC Authentication**:
   - Citizens, Contractors, Municipal Field Officers, and System Administrators.
3. **Audit Trail & State Machine**:
   - Tamper-evident transition logs for every complaint (`REPORTED` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `VERIFIED` ➔ `RESOLVED`).
4. **Lightweight & Self-Contained**:
   - **Zero Docker required** for demo and local development.
   - Embedded SQLite (`aiosqlite`) + local disk photo storage + in-memory blacklist.

---

## ⚡ Quickstart (Zero Docker Required)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/quickfixit-backend.git
cd quickfixit-backend

# Optional: Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install lightweight dependencies
pip install -r requirements-demo.txt
```

### 2. Start the Server
```bash
python run.py
```

### 3. Open API Documentation
Navigate to **[http://localhost:8000/docs](http://localhost:8000/docs)** to access the interactive Swagger UI.

---

## 🧠 YOLOv8 AI Model

The backend includes fine-tuned YOLOv8 weights trained on **1,243 pothole images** and **18 before/after road repair pairs**:
- **Weights Location**: `models/pothole_yolov8/weights/best.pt`
- **Trained Classes**: `0: pothole`, `1: road_damage`, `2: road_patch`, `3: intact_road`
- **Validation Metrics**: **78.4% Precision**, **63.7% mAP@50**, **~8.1 ms** inference per image on NVIDIA RTX GPU.

### Evaluate or Retrain
```bash
# Evaluate on a before/after photo pair:
python training/evaluate_model.py --before datasets/demo_pairs/c2_pair_01_before.jpg --after datasets/demo_pairs/c2_pair_01_after.jpg

# Retrain on custom data (auto-detects GPU & AMP):
python training/train_yolo.py --epochs 25
```

---

## 📁 Project Structure

```
quickfixit-backend/
├── app/
│   ├── api/v1/              # API route controllers (Auth, Complaints, Contractor, Officer, Admin)
│   ├── core/                # Config, security (JWT, hashing), local storage
│   ├── models/              # SQLAlchemy database entities
│   ├── schemas/             # Pydantic request & response schemas
│   └── services/
│       ├── verification/    # 5-step CV verification engine
│       │   ├── step1_integrity.py
│       │   ├── step2_gps.py
│       │   ├── step3_angle.py
│       │   ├── step4_landmark.py
│       │   └── step5_repair.py
│       ├── complaint_service.py
│       └── contractor_service.py
├── datasets/
│   └── demo_pairs/          # 18 before/after clean road test pairs
├── models/
│   └── pothole_yolov8/      # Trained YOLOv8 model weights (best.pt)
├── training/
│   ├── train_yolo.py        # GPU-accelerated YOLOv8 fine-tuning script
│   ├── evaluate_model.py    # Multi-case evaluation & metrics script
│   └── dataset.yaml         # YOLOv8 class definition and dataset config
├── main.py                  # FastAPI application entrypoint
├── run.py                   # One-command server runner
├── requirements-demo.txt    # Lightweight dependencies
└── requirements.txt         # Full production dependencies (Postgres/Redis)
```

---

## 🧪 Testing the API Flow

1. **Register**: `POST /api/v1/auth/register` (Citizen or Contractor)
2. **Login**: `POST /api/v1/auth/login` (receives Bearer token)
3. **File Complaint**: `POST /api/v1/complaints` with location and before photo
4. **Submit Repair**: `POST /api/v1/contractor/submit-repair` with after photo
5. **Run Verification**: `POST /api/v1/contractor/repairs/{id}/verify` — returns real-time fraud scores and repair confirmation.

---

## 📄 License
MIT License. Free for municipal, academic, and commercial research.
