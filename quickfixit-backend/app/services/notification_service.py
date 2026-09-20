"""
app/services/notification_service.py — Notification stubs.

Responsibilities:
  - Send notifications to citizens, contractors, and officers
  - Currently implemented as console logs (stubs)
  - Designed to be swapped with Firebase FCM, SendGrid, or Twilio SMS
    by simply replacing the method bodies — the interface stays the same.

How to extend:
  1. Install the SDK (e.g., `firebase-admin`)
  2. Replace the `print` statements with actual API calls
  3. Add config keys to .env.example and settings
"""

from uuid import UUID


class NotificationService:

    async def send_citizen_notification(self, citizen_id: UUID, message: str) -> None:
        """
        Notify a citizen about their complaint status change.
        TODO: Replace with Firebase FCM push notification or email.
        """
        print(f"[NOTIFY → Citizen {citizen_id}]: {message}")

    async def send_contractor_notification(self, contractor_id: UUID, message: str) -> None:
        """
        Notify a contractor about job assignment or verification result.
        TODO: Replace with Firebase FCM push notification or SMS.
        """
        print(f"[NOTIFY → Contractor {contractor_id}]: {message}")

    async def send_officer_notification(self, officer_id: UUID, message: str) -> None:
        """
        Notify an officer that a verification needs their manual review.
        TODO: Replace with email or internal Slack webhook.
        """
        print(f"[NOTIFY → Officer {officer_id}]: {message}")

    async def broadcast_complaint_verified(self, complaint_id: UUID) -> None:
        """
        Broadcast to all users subscribed to updates for a specific complaint.
        TODO: Replace with WebSocket pub/sub via Redis channels.
        """
        print(f"[BROADCAST]: Complaint {complaint_id} has been verified and closed.")
