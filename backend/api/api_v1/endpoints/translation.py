import asyncio

from fastapi import APIRouter, Depends, HTTPException, status

from backend.api.deps import get_current_user
from backend.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
)
from backend.services.translation_service import translate_text


router = APIRouter()


@router.post(
    "/translate",
    response_model=TranslationResponse,
)
async def translate(
    request: TranslationRequest,
    current_user=Depends(get_current_user),
):
    if request.source_language == request.target_language:
        return TranslationResponse(
            original_text=request.text,
            translated_text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
            is_translated=False,
        )

    try:
        translated_text = await asyncio.to_thread(
            translate_text,
            request.text,
            request.source_language,
            request.target_language,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        )

    return TranslationResponse(
        original_text=request.text,
        translated_text=translated_text,
        source_language=request.source_language,
        target_language=request.target_language,
        is_translated=True,
    )
