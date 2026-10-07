from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


AppointmentStatus = Literal[
    "pending",
    "confirmed",
    "completed",
    "cancelled",
]


class AppointmentCreate(BaseModel):
    doctor_id: str
    appointment_date: datetime
    reason: str = Field(
        ...,
        min_length=2,
        max_length=1000,
    )


class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    appointment_date: Optional[datetime] = None
    reason: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=1000,
    )


class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    appointment_date: datetime
    reason: str
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True