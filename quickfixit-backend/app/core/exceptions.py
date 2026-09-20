"""
app/core/exceptions.py — Custom HTTP exceptions for the QuickFix It platform.

Responsibilities:
  - Define domain-specific HTTP exceptions with clear error codes
  - Keep error messages consistent across the API
  - Nothing else — no logic, no DB, no imports from other app modules
"""

from fastapi import HTTPException, status


# ── Auth ──────────────────────────────────────────────────────────────────────
class InvalidCredentialsError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


class AccessDeniedError(HTTPException):
    def __init__(self, required_role: str = ""):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Required role: {required_role}" if required_role else "Access denied",
        )


# ── Resources ─────────────────────────────────────────────────────────────────
class NotFoundError(HTTPException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} not found",
        )


# ── Complaints ────────────────────────────────────────────────────────────────
class ComplaintAlreadyAssignedError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="This complaint is already assigned to a contractor",
        )


class InvalidComplaintStatusError(HTTPException):
    def __init__(self, current: str, expected: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Cannot perform this action. Complaint is '{current}', expected '{expected}'",
        )


# ── Verification pipeline ─────────────────────────────────────────────────────
class DuplicatePhotoError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Step 1 FAILED: Submitted photo is a duplicate or reused image",
        )


class GPSMismatchError(HTTPException):
    def __init__(self, distance_m: float):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Step 2 FAILED: After-photo GPS is {distance_m:.1f}m away from the reported pothole location",
        )


class AngleMismatchError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Step 3 FAILED: Camera angle/heading does not match the original complaint photo",
        )


# ── Storage ───────────────────────────────────────────────────────────────────
class PhotoUploadError(HTTPException):
    def __init__(self, detail: str = "Failed to upload photo"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )
