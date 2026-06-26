from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Text
from sqlalchemy.orm import relationship
from app.config.db import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)

    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    status = Column(String(50), default="Pending")  # Pending / Approved / Rejected / Cancelled
    notes = Column(Text, nullable=True)

    patient = relationship("Patient")
    doctor = relationship("Doctor")