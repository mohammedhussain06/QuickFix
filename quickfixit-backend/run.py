"""
run.py — Simple one-command demo launcher.

Copies .env.demo → .env (if .env doesn't exist), then starts the server.

Usage:
    python run.py
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent


def setup_env():
    env_file = ROOT / ".env"
    demo_env = ROOT / ".env.demo"

    if not env_file.exists():
        if demo_env.exists():
            shutil.copy(demo_env, env_file)
            print("[OK] Copied .env.demo -> .env")
        else:
            print("[!] No .env file found. Creating minimal default...")
            env_file.write_text(
                "APP_ENV=demo\n"
                "DEBUG=true\n"
                "SECRET_KEY=demo-secret-key\n"
                "DATABASE_URL=sqlite+aiosqlite:///./quickfixit_demo.db\n"
                "STORAGE_BACKEND=local\n"
                "LOCAL_STORAGE_PATH=./uploaded_photos\n"
            )
    else:
        print("[OK] Using existing .env")


def check_dependencies():
    try:
        import fastapi, uvicorn, sqlalchemy, aiosqlite, cv2, imagehash, ultralytics
        print("[OK] All dependencies found")
    except ImportError as e:
        print(f"[X] Missing dependency: {e}")
        print("\nInstall with:")
        print("   pip install -r requirements-demo.txt")
        sys.exit(1)


def main():
    print("=" * 50)
    print("  QuickFix It - Demo Server")
    print("=" * 50)

    setup_env()
    check_dependencies()

    print("\n[*] Starting server at http://localhost:8000")
    print("[*] API docs at    http://localhost:8000/docs\n")

    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "main:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload",           # auto-reload on code changes
    ])


if __name__ == "__main__":
    main()
