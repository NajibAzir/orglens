from fastapi import APIRouter, Depends
from database import get_db
from models import WellbeingResponse
import sqlite3
from datetime import datetime

router = APIRouter(prefix="/api/wellbeing", tags=["wellbeing"])

@router.get("")
def list_wellbeing(db: sqlite3.Connection = Depends(get_db)):
    query = '''
        SELECT w.*, e.name as employee_name
        FROM wellbeing_checkins w
        JOIN employees e ON w.employee_id = e.id
    '''
    cursor = db.execute(query)
    return [dict(row) for row in cursor.fetchall()]

@router.get("/{employee_id}")
def get_wellbeing(employee_id: int, db: sqlite3.Connection = Depends(get_db)):
    query = "SELECT * FROM wellbeing_checkins WHERE employee_id = ?"
    cursor = db.execute(query, (employee_id,))
    return [dict(row) for row in cursor.fetchall()]

@router.post("/{checkin_id}/respond")
def respond_wellbeing(checkin_id: int, response: WellbeingResponse, db: sqlite3.Connection = Depends(get_db)):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.execute('''
        UPDATE wellbeing_checkins
        SET responded = 1, response_date = ?, stress_level = ?, notes = ?
        WHERE id = ?
    ''', (now, response.stress_level, response.notes, checkin_id))
    db.commit()
    return {"status": "success"}
