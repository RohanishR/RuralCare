from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from backend.api.deps import get_current_user
from backend.schemas.user import UserResponse
from backend.schemas.patient import PatientUpdate, PatientResponse, PatientCreate
from backend.models.patient import PatientModel
from backend.models.doctor import DoctorModel
from backend.models.appointment import AppointmentModel

router = APIRouter()


@router.get("/me", response_model=PatientResponse)
async def get_patient_me(current_user: UserResponse = Depends(get_current_user)) -> Any:
    """
    Get the current user's patient profile.
    Auto-creates an empty profile if one doesn't exist yet.
    """
    if current_user.role != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients can access patient profiles")

    patient = await PatientModel.get_by_user_id(current_user.id)

    if not patient:
        # Auto-create an empty patient profile
        patient_data = {
            "full_name": current_user.name or "",
        }
        patient = await PatientModel.create(current_user.id, patient_data)

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

    if current_user.role != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients can update patient profiles")
    patient = await PatientModel.update_by_user_id(current_user.id, update_data)

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
    is_owner = patient["user_id"] == current_user.id
    is_doctor = False
    if current_user.role == "doctor":
        doctor = await DoctorModel.get_by_user_id(current_user.id)
        is_doctor = bool(doctor) and await AppointmentModel.has_care_relationship(
            str(doctor["_id"]), str(patient["_id"])
        )

    if not (is_owner or is_doctor or current_user.role == "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view this patient profile"
        )

    patient["id"] = str(patient["_id"])
    return patient
