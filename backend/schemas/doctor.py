from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


VerificationStatus = Literal["pending", "approved", "rejected"]
WEEKDAYS = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}


class AvailabilitySlot(BaseModel):
    enabled: bool = False
    start: Optional[str] = Field(default=None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    end: Optional[str] = Field(default=None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")

    @model_validator(mode="after")
    def validate_enabled_slot(self):
        if self.enabled and (not self.start or not self.end):
            raise ValueError("Enabled availability requires a start and end time")
        if self.start and self.end and self.start >= self.end:
            raise ValueError("Availability end time must be after start time")
        return self


class DoctorFields(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    specialization: str = Field(min_length=2, max_length=100)
    qualification: str = Field(min_length=2, max_length=200)
    registration_number: str = Field(min_length=2, max_length=100)
    experience: int = Field(ge=0, le=80)
    languages: List[str] = Field(min_length=1, max_length=10)
    consultation_fee: float = Field(ge=0, le=100000)
    location: str = Field(min_length=2, max_length=150)
    about: Optional[str] = Field(default=None, max_length=2000)
    availability: Dict[str, AvailabilitySlot] = Field(default_factory=dict)
    profile_image: Optional[str] = Field(default=None, max_length=2048)

    @field_validator("languages")
    @classmethod
    def validate_languages(cls, languages: List[str]) -> List[str]:
        cleaned = [language.strip() for language in languages if language.strip()]
        if not cleaned:
            raise ValueError("At least one language is required")
        return list(dict.fromkeys(cleaned))

    @field_validator("availability")
    @classmethod
    def validate_weekdays(cls, availability: Dict[str, AvailabilitySlot]):
        invalid_days = set(availability) - WEEKDAYS
        if invalid_days:
            raise ValueError(f"Unsupported availability days: {', '.join(sorted(invalid_days))}")
        return availability


class DoctorCreate(DoctorFields):
    pass


class DoctorProfileCreate(DoctorCreate):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)


class DoctorUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    specialization: Optional[str] = Field(default=None, min_length=2, max_length=100)
    qualification: Optional[str] = Field(default=None, min_length=2, max_length=200)
    registration_number: Optional[str] = Field(default=None, min_length=2, max_length=100)
    experience: Optional[int] = Field(default=None, ge=0, le=80)
    languages: Optional[List[str]] = Field(default=None, min_length=1, max_length=10)
    consultation_fee: Optional[float] = Field(default=None, ge=0, le=100000)
    location: Optional[str] = Field(default=None, min_length=2, max_length=150)
    about: Optional[str] = Field(default=None, max_length=2000)
    availability: Optional[Dict[str, AvailabilitySlot]] = None
    profile_image: Optional[str] = Field(default=None, max_length=2048)

    @field_validator("languages")
    @classmethod
    def validate_update_languages(cls, languages: Optional[List[str]]):
        if languages is None:
            return languages
        cleaned = [language.strip() for language in languages if language.strip()]
        if not cleaned:
            raise ValueError("At least one language is required")
        return list(dict.fromkeys(cleaned))

    @field_validator("availability")
    @classmethod
    def validate_update_weekdays(cls, availability: Optional[Dict[str, AvailabilitySlot]]):
        if availability is not None:
            invalid_days = set(availability) - WEEKDAYS
            if invalid_days:
                raise ValueError(f"Unsupported availability days: {', '.join(sorted(invalid_days))}")
        return availability


class DoctorResponse(DoctorFields):
    id: str
    user_id: str
    name: str
    verification_status: VerificationStatus
    created_at: datetime
    updated_at: datetime


class DoctorListResponse(BaseModel):
    doctors: List[DoctorResponse]
