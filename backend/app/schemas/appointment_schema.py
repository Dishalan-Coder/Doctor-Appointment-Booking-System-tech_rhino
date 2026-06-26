from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    notes: Optional[str] = None