# Doctor SQLAlchemy model.
from sqlalchemy import Column, Integer, String, Text, Time, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func
from ..config.db import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    specialization = Column(String(150), nullable=True)
    qualification = Column(String(100), nullable=True)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    image = Column(String(255), nullable=True)
    available_days = Column(String(50), default="Mon,Tue,Wed,Thu,Fri")
    available_from = Column(Time, default="09:00:00")
    available_to = Column(Time, default="17:00:00")
    status = Column(Enum("Active", "Inactive"), default="Active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())