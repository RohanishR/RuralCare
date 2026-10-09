from backend.models.notification import NotificationModel

class NotificationService:
    @staticmethod
    async def send_notification(user_id: str, title: str, message: str, type: str) -> dict:
        """
        Sends an in-app notification.
        This is an extensible point where Email/SMS integrations can be added later.
        """
        # Save in-app notification
        notification = await NotificationModel.create(
            user_id=user_id,
            data={
                "title": title,
                "message": message,
                "type": type,
            }
        )
        
        # Future: Send Email if user preferences allow
        # Future: Send SMS if user preferences allow
        # Future: Send Push Notification via Firebase/APNS

        return notification
