"""
app/tasks/celery_app.py — Celery application instance.

Responsibilities:
  - Create and configure the Celery app
  - Set broker and result backend from settings
  - Auto-discover tasks in app/tasks/
  - Nothing else — no task definitions here

Import this module wherever you need to send tasks:
  from app.tasks.celery_app import celery_app
"""

try:
    from celery import Celery
    from app.core.config import settings

    celery_app = Celery(
        "quickfixit",
        broker=settings.celery_broker_url,
        backend=settings.celery_result_backend,
        include=["app.tasks.verify_repair"],  # auto-discover task modules
    )

    celery_app.conf.update(
        # Serialisation
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],

        # Timezone
        timezone="UTC",
        enable_utc=True,

        # Task behaviour
        task_track_started=True,
        task_acks_late=True,          # only ack after task completes (safer for CV work)
        worker_prefetch_multiplier=1, # one task at a time per worker (CV is CPU-heavy)

        # Result expiry
        result_expires=86400,         # keep results for 24 hours
    )
except ImportError:
    celery_app = None

