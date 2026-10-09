from typing import List, Literal

from pydantic import BaseModel, Field


class SymptomRequest(BaseModel):
    symptoms: str = Field(
        ...,
        min_length=3,
        max_length=2000,
    )
    language: Literal["en", "hi", "ta"] = "en"


class SymptomAnalysis(BaseModel):
    discussion_points: List[str]
    urgency: Literal["low", "medium", "high", "emergency"]
    recommendation: str
    warning_signs: List[str]


class SymptomResponse(BaseModel):
    symptoms: str
    language: Literal["en", "hi", "ta"]
    analysis: SymptomAnalysis
