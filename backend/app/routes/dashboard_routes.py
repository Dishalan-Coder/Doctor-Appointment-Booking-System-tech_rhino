"""Dashboard API routes for admin statistics."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..utils.dependencies import get_current_admin
from ..utils.helpers import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return get_dashboard_stats(db)