from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def dashboard():
    return {"message": "Dashboard route working"}