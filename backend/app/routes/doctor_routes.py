"""Doctor API routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..schemas.doctor_schema import DoctorCreate, DoctorUpdate
from ..controllers.doctor_controller import (
    get_doctors, get_doctor_by_id,
    create_doctor, update_doctor, delete_doctor
)
from ..utils.dependencies import get_current_admin

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.get("/")
def list_doctors(
    department_id: int = Query(None),
    search: str = Query(None),
    status: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    return get_doctors(db, department_id, search, status, skip, limit)


@router.get("/{doctor_id}")
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = get_doctor_by_id(db, doctor_id)
    if not doctor:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.post("/")
def add_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return create_doctor(data, db)


@router.put("/{doctor_id}")
def edit_doctor(
    doctor_id: int,
    data: DoctorUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    doctor = update_doctor(doctor_id, data, db)
    if not doctor:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.delete("/{doctor_id}")
def remove_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    success = delete_doctor(doctor_id, db)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"message": "Doctor deactivated successfully"}