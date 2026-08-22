from fastapi import APIRouter, Depends
from database import get_db
from routers.anomalies import get_anomalies
import sqlite3

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_stats(db: sqlite3.Connection = Depends(get_db)):
    employees_count = db.execute("SELECT COUNT(*) FROM employees WHERE status = 'active'").fetchone()[0]
    roles_count = db.execute("SELECT COUNT(*) FROM roles WHERE status = 'active'").fetchone()[0]
    departments_count = db.execute("SELECT COUNT(*) FROM departments WHERE status = 'active'").fetchone()[0]
    
    # Get recent movements as a list
    recent_movements = db.execute('''
        SELECT a.id, a.start_date as date, a.reason, 
               e.name as employee_name, e.id as employee_id,
               r.title as to_role, r.id as role_id
        FROM assignments a
        JOIN employees e ON a.employee_id = e.id
        JOIN roles r ON a.role_id = r.id
        ORDER BY a.start_date DESC
        LIMIT 10
    ''').fetchall()
    
    # Use the same anomalies detection logic so counts are consistent
    all_anomalies = get_anomalies(db)
    
    return {
        "total_employees": employees_count,
        "total_roles": roles_count,
        "total_departments": departments_count,
        "recent_movements": [dict(row) for row in recent_movements],
        "active_anomalies": len(all_anomalies)
    }
