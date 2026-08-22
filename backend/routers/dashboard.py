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
    
    # Avg role relevancy score (latest assessment per role)
    avg_relevancy_row = db.execute('''
        SELECT AVG(rr.relevancy_score) as avg_score
        FROM role_relevancy rr
        WHERE rr.assessed_date = (SELECT MAX(rr2.assessed_date) FROM role_relevancy rr2 WHERE rr2.role_id = rr.role_id)
    ''').fetchone()
    avg_relevancy = round((avg_relevancy_row[0] or 0.77) * 100)
    
    return {
        "total_employees": employees_count,
        "total_roles": roles_count,
        "total_departments": departments_count,
        "recent_movements": [dict(row) for row in recent_movements],
        "active_anomalies": len(all_anomalies),
        "avg_relevancy": avg_relevancy
    }
