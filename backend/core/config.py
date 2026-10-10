import os
from pathlib import Path
from urllib.parse import urlsplit

from pydantic import ValidationError, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ruralcare"
    FRONTEND_URL: str = "http://localhost:3000"

    SECRET_KEY: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    TRANSLATION_API_KEY: str = ""

    @model_validator(mode="after")
    def validate_deployment(self):
        if not self.SECRET_KEY.strip():
            raise ValueError("SECRET_KEY must be configured")
        if os.getenv("VERCEL"):
            missing = [name for name in ("MONGODB_URI", "SECRET_KEY", "FRONTEND_URL")
                       if not os.getenv(name, "").strip()]
            if missing:
                raise ValueError("Required deployment variables: " + ", ".join(missing))
            mongo_host = urlsplit(self.MONGODB_URI).hostname
            if mongo_host in {"localhost", "127.0.0.1", "::1"}:
                raise ValueError("MONGODB_URI must point to a reachable production database")
        origin = urlsplit(self.FRONTEND_URL)
        if (origin.scheme not in {"http", "https"} or not origin.hostname
                or origin.username or origin.password or origin.query or origin.fragment
                or origin.path not in {"", "/"}):
            raise ValueError("FRONTEND_URL must be an exact HTTP(S) origin")
        self.FRONTEND_URL = self.FRONTEND_URL.rstrip("/")
        return self
    
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


try:
    settings = Settings()
except ValidationError as exc:
    # Pydantic's normal exception text may include environment values.
    fields = sorted({".".join(map(str, error["loc"])) or "deployment" for error in exc.errors()})
    raise RuntimeError("Invalid backend configuration. Check: " + ", ".join(fields)
                       + ". On Vercel set MONGODB_URI, SECRET_KEY and FRONTEND_URL.") from None
