"""Authentication API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..schemas.patient_schema import PatientRegister, PatientLogin
from ..schemas.doctor_schema import DoctorRegister, DoctorLogin
from ..controllers.auth_controller import register_patient, login_patient, login_admin, register_doctor, login_doctor

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(data: PatientRegister, db: Session = Depends(get_db)):
    return register_patient(data, db)


@router.post("/login")
def login(data: PatientLogin, db: Session = Depends(get_db)):
    return login_patient(data.email, data.password, db)


@router.post("/admin-login")
def admin_login(email: str = "admin@hospital.com", password: str = "admin123", db: Session = Depends(get_db)):
    return login_admin(email, password, db)


@router.post("/doctor-register")
def doctor_register(data: DoctorRegister, db: Session = Depends(get_db)):
    return register_doctor(data, db)


@router.post("/doctor-login")
def doctor_login(data: DoctorLogin, db: Session = Depends(get_db)):
    return login_doctor(data.email, data.password, db)