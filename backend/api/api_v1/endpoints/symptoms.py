from fastapi import APIRouter, Depends

from backend.api.deps import get_current_user
from backend.schemas.symptom import SymptomRequest, SymptomResponse
from backend.services.ai_service import analyze_symptoms


router = APIRouter()


@router.post("/analyze", response_model=SymptomResponse)
async def analyze_patient_symptoms(
    request: SymptomRequest,
    current_user=Depends(get_current_user),
):
    analysis = analyze_symptoms(request.symptoms)

    return SymptomResponse(
        symptoms=request.symptoms,
        language=request.language,
        analysis=analysis,
    )
