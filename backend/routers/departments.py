from fastapi import APIRouter, Depends
from database import get_db
import sqlite3

router = APIRouter(prefix="/api/departments", tags=["departments"])

@router.get("")
def list_departments(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT * FROM departments")
    return [dict(row) for row in cursor.fetchall()]
