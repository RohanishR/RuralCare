from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from pydantic import BaseModel

from backend.api.deps import get_current_user
from backend.schemas.user import UserResponse
from backend.schemas.patient import PatientUpdate, PatientResponse, PatientCreate
from backend.models.patient import PatientModel

router = APIRouter()

@router.get("/me", response_model=PatientResponse)
async def get_patient_me(current_user: UserResponse = Depends(get_current_user)) -> Any:
    """
    Get the current user's patient profile.
    """
    patient = await PatientModel.get_by_user_id(str(current_user["id"]))
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )
    patient["id"] = str(patient["_id"])
    return patient

@router.put("/me", response_model=PatientResponse)
async def update_patient_me(
    *,
    patient_in: PatientUpdate,
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    """
    Update or create the current user's patient profile.
    """
    # Convert Pydantic model to dict, excluding unset values
    update_data = patient_in.model_dump(exclude_unset=True)
    
    # Handle the emergency_contact nested object specifically
    if "emergency_contact" in update_data and update_data["emergency_contact"] is not None:
        if hasattr(update_data["emergency_contact"], "model_dump"):
            update_data["emergency_contact"] = update_data["emergency_contact"].model_dump()
            
    patient = await PatientModel.update_by_user_id(str(current_user["id"]), update_data)
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update patient profile"
        )
        
    patient["id"] = str(patient["_id"])
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient_by_id(
    patient_id: str,
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    """
    Get a specific patient by ID. 
    Only authorized doctors/admins or the patient themselves should access this.
    """
    patient = await PatientModel.get_by_id(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
        
    # Basic authorization check
    is_owner = patient["user_id"] == str(current_user["id"])
    is_doctor = current_user.get("role") in ["doctor", "admin"]
    
    if not (is_owner or is_doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view this patient profile"
        )
        
    patient["id"] = str(patient["_id"])
    return patient
