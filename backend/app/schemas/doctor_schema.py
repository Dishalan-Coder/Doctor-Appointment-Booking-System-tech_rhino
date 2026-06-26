from pydantic import BaseModel
from typing import Optional


class DoctorRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    department_id: int
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None


class DoctorLogin(BaseModel):
    email: str
    password: str


class DoctorCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    department_id: int
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None
    available_days: Optional[str] = "Mon,Tue,Wed,Thu,Fri"
    available_from: Optional[str] = "09:00"
    available_to: Optional[str] = "17:00"


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[int] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    available_days: Optional[str] = None
    available_from: Optional[str] = None
    available_to: Optional[str] = None
    status: Optional[str] = None


class DoctorResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    department_id: int
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None
    available_days: Optional[str] = None
    available_from: Optional[str] = None
    available_to: Optional[str] = None
    status: Optional[str] = None
    department_name: Optional[str] = None

    class Config:
        from_attributes = True