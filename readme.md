# Doctor Appointment Booking

A full-stack web application for booking doctor appointments.

## Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: MySql

## Getting Started

### Backend
```bash
cd backend
python3 -m pip install -r requirements.txt 
python3 -m app.seed.seed_data 
python3 -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
