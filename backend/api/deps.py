from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional

from backend.core.security import decode_access_token
from backend.models.user import UserModel
from backend.schemas.user import UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user_data = await UserModel.get_by_id(user_id)
    if user_data is None:
        raise credentials_exception
        
    user_data["id"] = str(user_data["_id"])
    return UserResponse(**user_data)

def require_role(role: str):
    def role_checker(current_user: UserResponse = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires {role} role."
            )
        return current_user
    return role_checker

require_patient = require_role("patient")
require_doctor = require_role("doctor")
require_admin = require_role("admin")
