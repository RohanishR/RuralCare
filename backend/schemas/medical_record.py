from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PatientRecordCorrection(BaseModel):
    model_config = ConfigDict(extra="forbid")
    patient_note: str = Field(..., max_length=2000)


class MedicalRecordCreate(BaseModel):
    appointment_id: str
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
    patient_note: str = ""
    patient_note_updated_at: Optional[datetime] = None
