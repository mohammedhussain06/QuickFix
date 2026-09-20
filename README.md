# 🛣️ QuickFix It — AI-Powered Pothole Repair Verification

> **An end-to-end civic tech system that uses computer vision to verify pothole repairs — preventing fraud, ensuring accountability, and empowering citizens.**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Fine--tuned-orange?logo=pytorch)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-QuickFixIt--model-yellow)](https://huggingface.co/RoxieRoller/QuickFixIt-model)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🧠 What Is This?

QuickFix It is a full-stack pothole repair verification platform built for Indian municipalities. When a contractor claims a pothole has been fixed, the system uses a **5-step AI verification pipeline** to confirm the repair is genuine — no fake photos, no false claims.

### The Problem
- Contractors submit fraudulent "after" photos of repairs
- Municipal officers manually review thousands of submissions
- Citizens have no visibility into whether their reported potholes are fixed

### The Solution
A mobile-first app where:
1. **Citizens** report potholes with geotagged photos
2. **Contractors** submit before/after repair photos
3. **AI verifies** the repair automatically using computer vision
4. **Officers** review edge cases with full audit trails

---

## ✨ Features

| Feature | Description |
|---|---|
| 📸 **Citizen Reporting** | Submit pothole photos with GPS location |
| 🤖 **AI Verification** | 5-step CV pipeline checks repair authenticity |
| 👷 **Contractor Portal** | Ghost-overlay camera for precise before/after alignment |
| 🏛️ **Officer Dashboard** | Review flagged repairs, ward heatmaps, analytics |
| 🔐 **Role-based Auth** | Citizen / Contractor / Municipal Officer roles |
| 🗺️ **Community Map** | Live map of reported and fixed potholes |
| 📊 **Scorecard** | Contractor performance tracking |

---

## 🤖 AI Verification Pipeline

The core of QuickFix It is a **5-step computer vision pipeline**:

```
Step 1: Image Integrity Check     → Detects tampered/recycled photos (EXIF, hash)
Step 2: GPS Consistency Check     → Confirms before & after are at same location
Step 3: Camera Angle Analysis     → Ensures same viewpoint (homography matching)
Step 4: Landmark Matching         → Visual anchor points must align (ORB features)
Step 5: Repair Detection (YOLO)   → YOLOv8 confirms pothole is filled/repaired
         ↓
      Fusion Score → AUTO PASS / OFFICER REVIEW / REJECT
```

### Training the Model
- **Base model**: YOLOv8n (nano)
- **Dataset**: 2,281 images total
  - ~1,243 images from Roboflow Indian Pothole Dataset
  - 1,002 images from 501 real before/after road repair pairs (custom dataset)
- **Training**: 25 epochs on GPU
- **Output**: `best.pt` stored at `quickfixit-backend/models/pothole_yolov8/weights/`

### 🤗 Hugging Face Model Hub
The trained weights are hosted on Hugging Face:
- **Model Repo:** [huggingface.co/RoxieRoller/QuickFixIt-model](https://huggingface.co/RoxieRoller/QuickFixIt-model)
- **Auto-Download:** If `best.pt` is not found locally, the backend automatically downloads the weights directly from Hugging Face Hub!
- **Standalone Usage:**
  ```python
  from ultralytics import YOLO
  from huggingface_hub import hf_hub_download

  model_path = hf_hub_download(repo_id="RoxieRoller/QuickFixIt-model", filename="best.pt")
  model = YOLO(model_path)
  results = model.predict("pothole_image.jpg")
  ```

---

## 🏗️ Project Structure

```
QuickFix/
├── quickfixit-backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/v1/              # REST API routes
│   │   ├── core/                # Config, DB, security
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   └── services/
│   │       └── verification/    # 5-step CV pipeline
│   │           ├── step1_integrity.py
│   │           ├── step2_gps.py
│   │           ├── step3_angle.py
│   │           ├── step4_landmark.py
│   │           ├── step5_repair.py
│   │           └── step6_fusion.py
│   ├── models/
│   │   └── pothole_yolov8/
│   │       └── weights/
│   │           └── best.pt      # Fine-tuned YOLO model
│   ├── training/                # Training scripts
│   ├── main.py
│   └── requirements.txt
│
└── quickfixit-frontend/         # React + Vite frontend
    └── frontend/
        └── src/
            ├── components/
            │   ├── LoginPage.jsx
            │   ├── ReportCamera.jsx
            │   ├── contractor/
            │   └── municipal/
            └── services/api.js
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/mohammedhussain06/QuickFix.git
cd QuickFix
```

---

### 2. Backend Setup

```bash
cd quickfixit-backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements-demo.txt

# Copy and configure environment file
cp .env.example .env

# Run the server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- Backend: **http://127.0.0.1:8000**
- API Docs: **http://127.0.0.1:8000/docs**

---

### 3. Frontend Setup

```bash
cd quickfixit-frontend/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

- Frontend: **http://localhost:5173**

---

## 🔑 Demo Login Credentials

The backend auto-seeds these accounts on first run:

| Role | Email | Password |
|------|-------|----------|
| 👤 Citizen | `citizen@quickfixit.gov` | `demo123` |
| 👷 Contractor | `contractor@apex.com` | `demo123` |
| 🏛️ Officer | `officer@bmc.gov.in` | `demo123` |

> You can also log in with phone number or crew ID instead of email.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM / database layer |
| **SQLite** | Database (demo mode) |
| **YOLOv8 (Ultralytics)** | Pothole detection model |
| **OpenCV** | Image processing |
| **Pydantic** | Data validation |
| **bcrypt + JWT** | Auth & security |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool |
| **Vanilla CSS** | Styling |
| **Leaflet.js** | Interactive map |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Login and get JWT token |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `POST` | `/api/v1/complaints/` | Submit a pothole report |
| `GET` | `/api/v1/complaints/` | List all complaints |
| `POST` | `/api/v1/complaints/{id}/repair` | Submit repair proof |
| `GET` | `/api/v1/officer/dashboard` | Officer analytics |
| `GET` | `/health` | Health check |

Full interactive API docs: **http://127.0.0.1:8000/docs**

---

## 🔄 Re-Training the Model

```bash
cd quickfixit-backend

# Download Roboflow dataset
python training/download_dataset.py

# Extract custom contact sheet images
python training/extract_all_user_sheets.py

# Merge and train
python training/train_yolo.py
```

New weights will be saved to `models/pothole_yolov8/weights/best.pt`.

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohammed Hussain** — [@mohammedhussain06](https://github.com/mohammedhussain06)

---

> *Built to make Indian roads safer, one verified repair at a time.* 🇮🇳
