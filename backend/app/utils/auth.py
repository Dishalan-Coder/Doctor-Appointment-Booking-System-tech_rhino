import jwt
from datetime import datetime, timedelta, timezone
from ..config.settings import get_settings

settings = get_settings()


def create_patient_token(patient_id: int, email: str) -> str:
    # Generate a JWT access token for a patient.
    payload = {
        "sub": str(patient_id),
        "email": email,
        "role": "patient",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_admin_token(admin_id: int, email: str) -> str:
    # Generate a JWT access token for an admin.
    payload = {
        "sub": str(admin_id),
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.ADMIN_JWT_EXPIRE_MINUTES),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, settings.ADMIN_JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_doctor_token(doctor_id: int, email: str) -> str:
    # Generate a JWT access token for a doctor.
    payload = {
        "sub": str(doctor_id),
        "email": email,
        "role": "doctor",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_patient_token(token: str) -> dict:
    # Verify and decode a patient JWT token.
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("role") != "patient":
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_admin_token(token: str) -> dict:
    # Verify and decode an admin JWT token.
    try:
        payload = jwt.decode(token, settings.ADMIN_JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("role") != "admin":
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_doctor_token(token: str) -> dict:
    # Verify and decode a doctor JWT token.
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("role") != "doctor":
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None