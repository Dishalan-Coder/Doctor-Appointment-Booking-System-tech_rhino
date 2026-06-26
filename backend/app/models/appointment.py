from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func
from ..config.db import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    appointment_date = Column(Date, nullable=False)
    time_slot = Column(String(20), nullable=False)
    status = Column(
        Enum("Pending", "Approved", "Cancelled", "Completed"),
        default="Pending"
    )
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())