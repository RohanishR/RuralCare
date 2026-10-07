from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class MedicalRecordCreate(BaseModel):
    patient_id: str
    appointment_id: Optional[str] = None
    diagnosis: str = Field(..., min_length=2, max_length=500)
    symptoms: str = Field(..., min_length=2, max_length=2000)
    notes: Optional[str] = Field(default="", max_length=5000)


class MedicalRecordResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    appointment_id: Optional[str] = None
    diagnosis: str
    symptoms: str
    notes: str
    created_at: datetime