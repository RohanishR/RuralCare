from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PrescriptionCreate(BaseModel):
    appointment_id: str
    medicine: str = Field(..., min_length=2, max_length=200)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=100)
    duration: str = Field(..., min_length=1, max_length=100)
    instructions: Optional[str] = Field(default="", max_length=1000)


class PrescriptionResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    appointment_id: Optional[str] = None
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: str
    created_at: datetime
