from typing import Any
from pydantic import BaseModel, Field
from datetime import datetime

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str

class NotificationUpdate(BaseModel):
    read: bool

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime
