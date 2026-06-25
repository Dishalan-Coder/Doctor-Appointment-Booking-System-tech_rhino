from pydantic import BaseModel, EmailStr
from typing import Optional

class DoctorCreate(BaseModel):
    full_name: str
    specialization: str
    email: EmailStr
    phone: Optional[str] = None
    schedule: Optional[str] = None
    department_id: int