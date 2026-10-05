from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class AppointmentMode(str, Enum):
    video = "video"
    audio = "audio"
    chat = "chat"


class AppointmentStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    rescheduled = "rescheduled"


class AppointmentCreate(BaseModel):
    doctor_id: str = Field(min_length=1)
    appointment_date: date
    appointment_time: str = Field(min_length=5, max_length=5)
    mode: AppointmentMode
    reason: Optional[str] = Field(default=None, max_length=1000)

    @field_validator("appointment_time")
    @classmethod
    def validate_time(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%H:%M")
        except ValueError:
            raise ValueError("appointment_time must use HH:MM format")
        return value


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[date] = None
    appointment_time: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=5,
    )
    mode: Optional[AppointmentMode] = None
    reason: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[AppointmentStatus] = None

    @field_validator("appointment_time")
    @classmethod
    def validate_time(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        try:
            datetime.strptime(value, "%H:%M")
        except ValueError:
            raise ValueError("appointment_time must use HH:MM format")

        return value


class AppointmentResponse(BaseModel):
    id: str

    patient_id: str
    doctor_id: str

    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None

    appointment_date: date
    appointment_time: str

    mode: AppointmentMode
    reason: Optional[str] = None

    status: AppointmentStatus

    consultation_fee: Optional[float] = None

    created_at: datetime
    updated_at: datetime


class AppointmentListResponse(BaseModel):
    appointments: list[AppointmentResponse]