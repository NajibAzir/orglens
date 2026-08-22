from fastapi import APIRouter, Depends
from database import get_db
import sqlite3
from typing import Optional
import json

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.get("")
def list_employees(status: Optional[str] = None, db: sqlite3.Connection = Depends(get_db)):
    query = '''
        SELECT e.id, e.name, e.email, e.avatar_url, e.skills, e.location, e.level, e.performance, e.hire_date, e.exit_date, e.status,
               a.role_id as current_role_id,
               r.title as current_role,
               d.name as current_department,
               d.color as department_color
        FROM employees e
        LEFT JOIN assignments a ON e.id = a.employee_id AND a.end_date IS NULL
        LEFT JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
    '''
    params = []
    if status:
        query += " AND e.status = ?"
        params.append(status)
    query += " ORDER BY e.id ASC"
    cursor = db.execute(query, params)
    
    employees = []
    for row in cursor.fetchall():
        emp = dict(row)
        try:
            emp["skills"] = json.loads(emp["skills"]) if emp["skills"] else []
        except Exception:
            emp["skills"] = []
        employees.append(emp)
    return employees

@router.get("/{id}")
def get_employee(id: int, db: sqlite3.Connection = Depends(get_db)):
    emp = db.execute("SELECT * FROM employees WHERE id = ?", (id,)).fetchone()
    if not emp:
        return {"error": "Not found"}
    
    assignments = db.execute('''
        SELECT a.id, a.role_id, a.start_date, a.end_date, a.reason, a.notes,
               r.title, r.level as role_level, d.name as department, d.color as department_color
        FROM assignments a
        JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE a.employee_id = ?
        ORDER BY a.start_date ASC
    ''', (id,)).fetchall()
    
    result = dict(emp)
    try:
        result["skills"] = json.loads(result["skills"]) if result["skills"] else []
    except Exception:
        result["skills"] = []
    result["history"] = [dict(row) for row in assignments]
    return result
