from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


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
    model_config = ConfigDict(extra="forbid")
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = Field(default=None, max_length=10000)


class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    appointment_date: datetime
    reason: str
    status: AppointmentStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
