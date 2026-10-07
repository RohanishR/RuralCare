from typing import List, Literal

from pydantic import BaseModel, Field


class SymptomRequest(BaseModel):
    symptoms: str = Field(
        ...,
        min_length=3,
        max_length=2000,
    )
    language: str = "en"


class SymptomAnalysis(BaseModel):
    possible_conditions: List[str]
    urgency: Literal["low", "medium", "high", "emergency"]
    recommendation: str
    warning_signs: List[str]


class SymptomResponse(BaseModel):
    symptoms: str
    language: str
    analysis: SymptomAnalysis