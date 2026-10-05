from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.api.deps import require_doctor
from backend.models.doctor import DoctorModel
from backend.models.user import UserModel
from backend.schemas.doctor import (
    DoctorListResponse,
    DoctorProfileCreate,
    DoctorResponse,
    DoctorUpdate,
)
from backend.schemas.user import UserResponse

router = APIRouter()


def serialize_doctor(doctor: dict, user: dict) -> dict:
    """Expose professional profile data without leaking user authentication fields."""
    return {
        "id": str(doctor["_id"]),
        "user_id": doctor["user_id"],
        "name": user.get("name", "Doctor"),
        "specialization": doctor["specialization"],
        "qualification": doctor["qualification"],
        "registration_number": doctor["registration_number"],
        "experience": doctor["experience"],
        "languages": doctor["languages"],
        "consultation_fee": doctor["consultation_fee"],
        "location": doctor["location"],
        "about": doctor.get("about"),
        "availability": doctor.get("availability", {}),
        "profile_image": doctor.get("profile_image") or user.get("profile_image"),
        "verification_status": doctor["verification_status"],
        "created_at": doctor["created_at"],
        "updated_at": doctor["updated_at"],
    }


async def response_for_doctor(doctor: dict) -> dict:
    user = await UserModel.get_by_id(doctor["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="Doctor account not found")
    return serialize_doctor(doctor, user)


@router.get("", response_model=DoctorListResponse)
async def list_doctors(
    specialization: Optional[str] = None,
    language: Optional[str] = None,
    location: Optional[str] = None,
    min_experience: Optional[int] = Query(default=None, ge=0),
    max_experience: Optional[int] = Query(default=None, ge=0),
    max_fee: Optional[float] = Query(default=None, ge=0),
    available: bool = False,
    search: Optional[str] = Query(default=None, min_length=2, max_length=100),
):
    if min_experience is not None and max_experience is not None and min_experience > max_experience:
        raise HTTPException(status_code=422, detail="min_experience cannot exceed max_experience")
    filters = {
        "specialization": specialization,
        "language": language,
        "location": location,
        "min_experience": min_experience,
        "max_experience": max_experience,
        "max_fee": max_fee,
        "available": available,
        "search": search,
    }
    if search:
        filters["search_user_ids"] = await UserModel.get_ids_by_name(search)
    doctors = await DoctorModel.list_approved(filters)
    responses = []
    for doctor in doctors:
        user = await UserModel.get_by_id(doctor["user_id"])
        if user:
            responses.append(serialize_doctor(doctor, user))
    return {"doctors": responses}


@router.get("/me", response_model=DoctorResponse)
async def get_doctor_me(current_user: UserResponse = Depends(require_doctor)):
    doctor = await DoctorModel.get_by_user_id(current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return await response_for_doctor(doctor)


@router.post("/me", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
async def create_doctor_me(
    doctor_in: DoctorProfileCreate,
    current_user: UserResponse = Depends(require_doctor),
):
    if await DoctorModel.get_by_user_id(current_user.id):
        raise HTTPException(status_code=409, detail="Doctor profile already exists")
    doctor_data = doctor_in.model_dump(exclude={"name"})
    if doctor_in.name and doctor_in.name != current_user.name:
        await UserModel.update(current_user.id, {"name": doctor_in.name})
    doctor = await DoctorModel.create(current_user.id, doctor_data)
    return await response_for_doctor(doctor)


@router.put("/me", response_model=DoctorResponse)
async def update_doctor_me(
    doctor_in: DoctorUpdate,
    current_user: UserResponse = Depends(require_doctor),
):
    if not await DoctorModel.get_by_user_id(current_user.id):
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    update_data = doctor_in.model_dump(exclude_unset=True, exclude={"name"})
    if doctor_in.name and doctor_in.name != current_user.name:
        await UserModel.update(current_user.id, {"name": doctor_in.name})
    doctor = await DoctorModel.update_by_user_id(current_user.id, update_data)
    return await response_for_doctor(doctor)


@router.get("/{doctor_id}", response_model=DoctorResponse)
async def get_doctor(doctor_id: str):
    doctor = await DoctorModel.get_by_id(doctor_id)
    if not doctor or doctor.get("verification_status") != "approved":
        raise HTTPException(status_code=404, detail="Doctor not found")
    return await response_for_doctor(doctor)
