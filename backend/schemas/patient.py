from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class EmergencyContact(BaseModel):
    name: str = Field(..., max_length=100)
    relationship: str = Field(..., max_length=50)
    phone: str = Field(..., max_length=20)

class PatientBase(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None # YYYY-MM-DD format usually
    gender: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    preferred_language: Optional[str] = "English"
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = []
    existing_medical_conditions: Optional[List[str]] = []
    current_medications: Optional[List[str]] = []
    emergency_contact: Optional[EmergencyContact] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
