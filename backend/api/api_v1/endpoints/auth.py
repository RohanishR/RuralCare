import logging
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, status
from starlette.concurrency import run_in_threadpool
from pymongo.errors import DuplicateKeyError, PyMongoError
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests

from backend.schemas.user import UserCreate, UserResponse, Token, GoogleLogin
from backend.models.user import UserModel
from backend.core.security import get_password_hash, verify_password, create_access_token
from backend.core.config import settings
from backend.api.deps import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, request: Request):
    if user_in.role not in {"patient", "doctor"}:
        raise HTTPException(status_code=403, detail="Public registration supports patient and doctor accounts only")
    reference = getattr(request.state, "request_id", uuid4().hex)
    stage = "lookup"
    try:
        existing_user = await UserModel.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this email already exists. Please sign in.")
        user_data = user_in.model_dump()
        password = user_data.pop("password")
        stage = "password_hash"
        user_data["password_hash"] = await run_in_threadpool(get_password_hash, password)
        user_data["auth_provider"] = "local"
        user_data["provider_id"] = None
        stage = "unique_index"
        await UserModel.ensure_indexes()
        stage = "insert"
        user = await UserModel.create(user_data)
        user["id"] = str(user["_id"])
        logger.info("registration_succeeded request_id=%s", reference)
        return user
    except HTTPException:
        raise
    except DuplicateKeyError:
        if stage != "insert":
            logger.error("registration_failed request_id=%s stage=%s error_type=DuplicateKeyError",
                         reference, stage)
            raise HTTPException(status_code=503, detail="The database is temporarily unavailable. Please try again shortly.") from None
        raise HTTPException(status_code=400, detail="An account with this email already exists. Please sign in.") from None
    except PyMongoError as exc:
        logger.error("registration_failed request_id=%s stage=%s error_type=%s",
                     reference, stage, type(exc).__name__)
        raise HTTPException(status_code=503, detail="The database is temporarily unavailable. Please try again shortly.") from None
    except Exception as exc:
        logger.error("registration_failed request_id=%s stage=%s error_type=%s",
                     reference, stage, type(exc).__name__)
        raise HTTPException(status_code=500, detail="Registration could not be completed. Please try again or contact support with the request reference.") from None

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await UserModel.get_by_email(form_data.username)
    if not user or user.get("auth_provider") != "local":
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = create_access_token(subject=str(user["_id"]), role=user.get("role", "patient"))
    user["id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google", response_model=Token)
async def google_auth(login_data: GoogleLogin):
    if not settings.GOOGLE_CLIENT_ID.strip():
        raise HTTPException(status_code=503, detail="Google sign-in is not configured. Please use email and password.")
    try:
        audience = settings.GOOGLE_CLIENT_ID.strip()
        idinfo = id_token.verify_oauth2_token(
            login_data.credential, requests.Request(), audience=audience
        )
    except Exception as exc:
        logger.warning("google_token_verification_failed error_type=%s", type(exc).__name__)
        raise HTTPException(status_code=400, detail="Google sign-in could not be verified. Please try again.") from None
        
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
        
    access_token = create_access_token(subject=str(user["_id"]), role=user.get("role", "patient"))
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
