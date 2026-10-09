from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.api.deps import get_current_user
from backend.models.doctor import DoctorModel
from backend.schemas.doctor import DoctorResponse
from backend.schemas.user import UserResponse
from backend.api.api_v1.endpoints.doctors import serialize_doctor

router = APIRouter()

class DoctorVerificationUpdate(BaseModel):
    status: str

@router.get("/doctors", response_model=List[DoctorResponse])
async def get_all_doctors_admin(
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can perform this action.")
    
    doctors = await DoctorModel.get_all()
    return [serialize_doctor(doc) for doc in doctors]

@router.patch("/doctors/{doctor_id}/verify", response_model=DoctorResponse)
async def verify_doctor(
    doctor_id: str,
    update_data: DoctorVerificationUpdate,
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can perform this action.")
    
    if update_data.status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")

    doctor = await DoctorModel.get_by_id(doctor_id)
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
        
    updated = await DoctorModel.update_by_user_id(doctor["user_id"], {"verification_status": update_data.status})
    return serialize_doctor(updated)
