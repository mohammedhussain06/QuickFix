"""
app/tasks/verify_repair.py — Celery task: trigger the CV verification pipeline.

Responsibilities:
  - Define the @celery_task that is queued when a contractor submits an after-photo
  - Bridge between Celery (sync world) and the async pipeline orchestrator
  - Handle task-level error recovery (retry on transient failures)
  - Nothing else — all logic is in services/verification/pipeline.py

How it works:
  1. Contractor submits after-photo → contractor_service.submit_repair()
  2. Service calls: verify_repair_task.delay(repair_id)
  3. Celery worker picks up the task and runs this function
  4. This function calls the async pipeline.run_pipeline() using asyncio.run()
  5. Pipeline writes results to DB and notifies relevant parties
"""

import asyncio
import logging
from uuid import UUID

from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


def _task_decorator(fn):
    if celery_app is not None:
        return celery_app.task(
            name="verify_repair",
            bind=True,
            max_retries=3,
            default_retry_delay=60,
            queue="verification",
        )(fn)
    return fn


@_task_decorator
def verify_repair_task(self, repair_id: str) -> dict:

    """
    Celery task: runs the 6-step CV verification pipeline for a repair submission.

    Args:
        repair_id: UUID string of the Repair record to verify.

    Returns:
        The pipeline result dict (stored in Celery result backend for debugging).

    Retry policy:
        On unexpected exceptions (e.g., DB connection failure, MinIO timeout),
        the task is retried up to 3 times with a 60-second delay.
        CV-level failures (wrong GPS, bad angle) are NOT retried — they are
        legitimate pipeline outcomes.
    """
    logger.info(f"[VerifyRepair] Starting verification for repair_id={repair_id}")

    try:
        from app.services.verification.pipeline import run_pipeline
        result = asyncio.run(run_pipeline(UUID(repair_id)))
        logger.info(
            f"[VerifyRepair] Completed repair_id={repair_id} "
            f"outcome={result.get('outcome')} score={result.get('fusion_score')}"
        )
        return result

    except Exception as exc:
        logger.error(f"[VerifyRepair] Error for repair_id={repair_id}: {exc}")
        # Retry on infrastructure failures, not logic failures
        raise self.retry(exc=exc)
