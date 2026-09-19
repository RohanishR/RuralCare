from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests

from backend.schemas.user import UserCreate, UserResponse, Token, GoogleLogin
from backend.models.user import UserModel
from backend.core.security import get_password_hash, verify_password, create_access_token
from backend.core.config import settings
from backend.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    existing_user = await UserModel.get_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user_data = user_in.model_dump()
    password = user_data.pop("password")
    user_data["password_hash"] = get_password_hash(password)
    user_data["auth_provider"] = "local"
    user_data["provider_id"] = None
    
    user = await UserModel.create(user_data)
    user["id"] = str(user["_id"])
    return user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await UserModel.get_by_email(form_data.username)
    if not user or user.get("auth_provider") != "local":
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = create_access_token(subject=str(user["_id"]))
    user["id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google", response_model=Token)
async def google_auth(login_data: GoogleLogin):
    try:
        idinfo = id_token.verify_oauth2_token(
            login_data.credential, requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError as e:
        print(f"Google Auth Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid Google Token: {str(e)}")
        
    email = idinfo.get("email")
    name = idinfo.get("name")
    picture = idinfo.get("picture")
    provider_id = idinfo.get("sub")
    
    user = await UserModel.get_by_email(email)
    if not user:
        # Create new user via Google
        user_data = {
            "email": email,
            "name": name,
            "role": "patient",  # Default role for Google auth
            "profile_image": picture,
            "auth_provider": "google",
            "provider_id": provider_id,
            "password_hash": None
        }
        user = await UserModel.create(user_data)
    else:
        # User exists, optionally update their Google details if needed
        # Just ensure they are allowed to login
        pass
        
    access_token = create_access_token(subject=str(user["_id"]))
    user["id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout():
    # Typically JWT logout is handled client-side by deleting the token.
    return {"status": "success", "message": "Successfully logged out"}
