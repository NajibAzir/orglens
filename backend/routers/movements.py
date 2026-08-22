from fastapi import APIRouter, Depends
from database import get_db
import sqlite3

router = APIRouter(prefix="/api/movements", tags=["movements"])

@router.get("/{employee_id}")
def get_movements(employee_id: int, db: sqlite3.Connection = Depends(get_db)):
    query = '''
        SELECT a.id, a.employee_id, a.role_id, a.start_date, a.end_date, a.reason, a.notes,
               r.title, d.name as department, 
               mgr_emp.name as manager_name
        FROM assignments a
        JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN roles mgr ON r.manager_role_id = mgr.id
        LEFT JOIN assignments mgr_a ON mgr.id = mgr_a.role_id 
            AND mgr_a.start_date <= a.start_date 
            AND (mgr_a.end_date IS NULL OR mgr_a.end_date >= a.start_date)
        LEFT JOIN employees mgr_emp ON mgr_a.employee_id = mgr_emp.id
        WHERE a.employee_id = ?
        ORDER BY a.start_date ASC
    '''
    cursor = db.execute(query, (employee_id,))
    return [dict(row) for row in cursor.fetchall()]
