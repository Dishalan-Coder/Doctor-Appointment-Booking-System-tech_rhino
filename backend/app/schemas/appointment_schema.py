from pydantic import BaseModel
from typing import Optional
from datetime import date


class AppointmentCreate(BaseModel):
    doctor_id: int
    department_id: int
    appointment_date: date
    time_slot: str
    reason: Optional[str] = None


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    department_id: int
    appointment_date: str
    time_slot: str
    status: str
    reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    department_name: Optional[str] = None

    class Config:
        from_attributes = True


class AppointmentCancel(BaseModel):
    reason: Optional[str] = "Cancelled by patient"