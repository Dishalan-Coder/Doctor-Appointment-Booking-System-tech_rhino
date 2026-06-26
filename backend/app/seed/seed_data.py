"""
Utility script to seed the database.
Run: python -m app.seed.seed_data
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import pymysql
from app.config.db import SessionLocal, engine, Base
from app.config.settings import get_settings
from app.utils.helpers import hash_password
from app.models.patient import Patient
from app.models.department import Department
from app.models.doctor import Doctor

settings = get_settings()


def ensure_database_exists():
    connection = pymysql.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{settings.DB_NAME}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        connection.commit()
    finally:
        connection.close()


def seed():
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Department).count() > 0:
            print("Database already has data. Skipping seed.")
            return

        # Seed departments
        departments = [
            Department(name="Cardiology", description="Diagnosis and treatment of heart and blood vessel disorders.", icon="heart"),
            Department(name="Neurology", description="Treatment of disorders of the nervous system.", icon="brain"),
            Department(name="Orthopedics", description="Conditions of the musculoskeletal system.", icon="bone"),
            Department(name="Pediatrics", description="Medical care for infants, children, and adolescents.", icon="baby"),
            Department(name="Dermatology", description="Conditions of the skin, hair, and nails.", icon="scan"),
            Department(name="Ophthalmology", description="Eye and vision care.", icon="eye"),
            Department(name="ENT", description="Ear, nose, and throat disorders.", icon="ear"),
            Department(name="General Medicine", description="Primary care and common illnesses.", icon="stethoscope"),
            Department(name="Gynecology", description="Female reproductive system health.", icon="ribbon"),
            Department(name="Psychiatry", description="Mental health disorders.", icon="smile"),
            Department(name="Diabetology", description="Diabetes management and care.", icon="activity"),
            Department(name="Nephrology", description="Kidney disease treatment.", icon="droplet"),
        ]
        db.add_all(departments)
        db.flush()

        dept_by_name = {dept.name: dept for dept in departments}

        # Seed doctors
        doctor_specs = [
            ("Dr. Sivakumar", "sivakumar@hospital.com", "077-1234567", "Cardiology", "Interventional Cardiology", "MD, DM Cardiology", 15, "Leading cardiologist with extensive experience in interventional procedures.", "Mon,Wed,Fri"),
            ("Dr. Kandasamy", "kandasamy@hospital.com", "077-2345678", "Neurology", "Neurophysiology", "MD, DM Neurology", 12, "Specializes in epilepsy, stroke, and neurodegenerative disorders.", "Mon,Tue,Thu"),
            ("Dr. Navaratnam", "navaratnam@hospital.com", "077-3456789", "Orthopedics", "Joint Replacement", "MS Orthopedics", 18, "Expert in knee and hip replacement surgeries.", "Tue,Thu,Sat"),
            ("Dr. Thiruchelvam", "thiruchelvam@hospital.com", "077-4567890", "Pediatrics", "Neonatology", "MD Pediatrics", 10, "Special training in newborn care and childhood diseases.", "Mon,Wed,Fri"),
            ("Dr. Sivathas", "sivathas@hospital.com", "077-5678901", "Dermatology", "Cosmetic Dermatology", "MD Dermatology", 8, "Focuses on skin health and cosmetic procedures.", "Mon,Tue,Wed,Thu,Fri"),
            ("Dr. Mahendran", "mahendran@hospital.com", "077-6789012", "Ophthalmology", "Retina Surgery", "MS Ophthalmology", 14, "Renowned eye surgeon specializing in retinal disorders.", "Wed,Fri,Sat"),
            ("Dr. Rasiah", "rasiah@hospital.com", "077-7890123", "ENT", "Head and Neck Surgery", "MS ENT", 11, "Comprehensive ENT care including sinus surgery.", "Mon,Tue,Thu,Fri"),
            ("Dr. Parameswaran", "parameswaran@hospital.com", "077-8901234", "General Medicine", "Internal Medicine", "MD Medicine", 20, "Senior physician with expertise in chronic conditions.", "Mon,Tue,Wed,Thu,Fri"),
            ("Dr. Kanthasamy", "kanthasamy@hospital.com", "077-9012345", "Gynecology", "High-Risk Pregnancy", "MS OB/GYN", 13, "Specializes in high-risk pregnancies and fertility.", "Mon,Wed,Thu"),
            ("Dr. Balasingam", "balasingam@hospital.com", "077-0123456", "Psychiatry", "Cognitive Behavioral Therapy", "MD Psychiatry", 9, "Evidence-based approaches to mental health.", "Mon,Tue,Wed,Thu,Fri"),
            ("Dr. Vigneswaran", "vigneswaran@hospital.com", "077-1122334", "Diabetology", "Diabetes Management", "MD, MD Diabetology", 10, "Expert in diabetes care and management.", "Tue,Thu,Sat"),
            ("Dr. Senthilnathan", "senthilnathan@hospital.com", "077-2233445", "Nephrology", "Kidney Diseases", "MD, DM Nephrology", 12, "Specializes in kidney disease and dialysis.", "Mon,Wed,Fri"),
        ]
        doctors = [
            Doctor(
                name=name,
                email=email,
                phone=phone,
                department_id=dept_by_name[dept_name].id,
                specialization=specialization,
                qualification=qualification,
                experience_years=experience,
                bio=bio,
                available_days=days,
            )
            for name, email, phone, dept_name, specialization, qualification, experience, bio, days in doctor_specs
        ]
        db.add_all(doctors)

        # Seed a demo patient
        demo_patient = Patient(
            name="Dishalan",
            email="dishalan@example.com",
            password_hash=hash_password("password123"),
            phone="077-9876543",
            gender="Male"
        )
        db.add(demo_patient)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()