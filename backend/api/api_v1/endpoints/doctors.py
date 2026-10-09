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
async def get_doctors(
    specialization: str | None = None,
    language: str | None = None,
    location: str | None = None,
    experience: int | None = None,
    availability: bool | None = None,
) -> list[dict]:
    query = {"verification_status": "approved"}
    
    if specialization:
        query["specialization"] = {"$regex": specialization, "$options": "i"}
    if language:
        query["languages"] = {"$regex": language, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if experience is not None:
        query["experience_years"] = {"$gte": experience}
    if availability is not None:
        query["is_available"] = availability

    doctors = await DoctorModel.get_all(query)

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found.")

    return serialize_doctor(doctor)


@router.post(
    "/me",
    response_model=DoctorResponse,
)
async def create_my_doctor_profile(
    doctor_in: DoctorCreate,
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    if current_user.role != "doctor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can create doctor profiles.")
    if await DoctorModel.get_by_user_id(current_user.id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doctor profile already exists.")
    doctor_data = doctor_in.model_dump()
    doctor_data["verification_status"] = "pending"
    return serialize_doctor(await DoctorModel.create(current_user.id, doctor_data))


@router.put(
    "/me",
    response_model=DoctorResponse,
)
async def update_my_doctor_profile(
    doctor_in: DoctorUpdate,
    current_user: UserResponse = Depends(get_current_user),
) -> Any:

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can update doctor profiles.",
        )

    doctor_data = doctor_in.model_dump(exclude_unset=True)
    if not doctor_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide at least one profile field to update.")

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
