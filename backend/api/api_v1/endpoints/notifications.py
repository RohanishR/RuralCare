from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from backend.api.deps import get_current_user
from backend.models.notification import NotificationModel
from backend.schemas.notification import NotificationResponse
from backend.schemas.user import UserResponse

router = APIRouter()

def serialize_notification(notif: dict) -> dict:
    notif["id"] = str(notif["_id"])
    notif.pop("_id", None)
    return notif

@router.get("/", response_model=list[NotificationResponse])
async def get_notifications(
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    notifications = await NotificationModel.get_by_user_id(current_user.id)
    return [serialize_notification(n) for n in notifications]

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: str,
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    notification = await NotificationModel.get_by_id(notification_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    
    if notification["user_id"] != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    updated = await NotificationModel.mark_as_read(notification_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update")

    return serialize_notification(updated)

@router.put("/read-all")
async def mark_all_as_read(
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    count = await NotificationModel.mark_all_as_read(current_user.id)
    return {"status": "success", "modified_count": count}
