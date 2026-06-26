# Application settings loaded from environment variables.
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Central configuration for the application.
    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "doctor_appointment_db"

    # JWT - Patient
    JWT_SECRET: str = "change_me"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    # JWT - Admin
    ADMIN_JWT_SECRET: str = "change_me_admin"
    ADMIN_JWT_EXPIRE_MINUTES: int = 480

    # Admin Credentials
    ADMIN_EMAIL: str = "admin@hospital.com"
    ADMIN_PASSWORD: str = "admin123"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            f"?charset=utf8mb4"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()