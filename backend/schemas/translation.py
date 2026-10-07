from typing import Literal

from pydantic import BaseModel, Field


SupportedLanguage = Literal["en", "hi", "ta"]


class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    source_language: SupportedLanguage
    target_language: SupportedLanguage


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: SupportedLanguage
    target_language: SupportedLanguage
    is_translated: bool
