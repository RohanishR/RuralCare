from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class DoctorBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    specialization: str = Field(..., min_length=2, max_length=100)
    qualification: str = Field(..., min_length=2, max_length=200)
    experience_years: int = Field(..., ge=0, le=70)
    license_number: Optional[str] = Field(
        default=None,
        max_length=100,
    )
    hospital: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    location: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    consultation_fee: Optional[float] = Field(
        default=None,
        ge=0,
    )
    languages: List[str] = Field(default_factory=list)
    bio: Optional[str] = Field(
        default=None,
        max_length=2000,
    )
    is_available: bool = True


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    full_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    specialization: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    qualification: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200,
    )
    experience_years: Optional[int] = Field(
        default=None,
        ge=0,
        le=70,
    )
    license_number: Optional[str] = Field(
        default=None,
        max_length=100,
    )
    hospital: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    location: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    consultation_fee: Optional[float] = Field(
        default=None,
        ge=0,
    )
    languages: Optional[List[str]] = None
    bio: Optional[str] = Field(
        default=None,
        max_length=2000,
    )
    is_available: Optional[bool] = None


class DoctorResponse(DoctorBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True