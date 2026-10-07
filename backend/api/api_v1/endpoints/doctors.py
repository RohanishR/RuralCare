from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from backend.api.deps import get_current_user
from backend.models.doctor import DoctorModel
from backend.schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
    DoctorUpdate,
)
from backend.schemas.user import UserResponse


router = APIRouter()


def serialize_doctor(doctor: dict) -> dict:
    doctor["id"] = str(doctor["_id"])
    doctor.pop("_id", None)

    return doctor


@router.get(
    "/",
    response_model=list[DoctorResponse],
)
async def get_doctors() -> list[dict]:
    doctors = await DoctorModel.get_all()

    return [
        serialize_doctor(doctor)
        for doctor in doctors
    ]


@router.get(
    "/me",
    response_model=DoctorResponse,
)
async def get_my_doctor_profile(
    current_user: UserResponse = Depends(get_current_user),
) -> Any:

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access doctor profiles.",
        )

    doctor = await DoctorModel.get_by_user_id(
        current_user.id
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    return serialize_doctor(doctor)


@router.put(
    "/me",
    response_model=DoctorResponse,
)
async def update_my_doctor_profile(
    doctor_in: DoctorCreate,
    current_user: UserResponse = Depends(get_current_user),
) -> Any:

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can update doctor profiles.",
        )

    doctor_data = doctor_in.model_dump()

    doctor = await DoctorModel.update_by_user_id(
        current_user.id,
        doctor_data,
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update doctor profile.",
        )

    return serialize_doctor(doctor)


@router.get(
    "/{doctor_id}",
    response_model=DoctorResponse,
)
async def get_doctor(
    doctor_id: str,
) -> Any:

    doctor = await DoctorModel.get_by_id(
        doctor_id
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found.",
        )

    return serialize_doctor(doctor)