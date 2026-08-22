from fastapi import APIRouter, Depends
from database import get_db
import sqlite3
from typing import Optional
import json

router = APIRouter(prefix="/api/roles", tags=["roles"])

@router.get("")
def list_roles(department_id: Optional[int] = None, status: Optional[str] = None, db: sqlite3.Connection = Depends(get_db)):
    query = '''
        SELECT r.*, d.name as department_name, d.color as department_color,
               (SELECT COUNT(*) FROM assignments a WHERE a.role_id = r.id AND a.end_date IS NULL) as active_occupants_count,
               (SELECT e.name FROM assignments a JOIN employees e ON a.employee_id = e.id WHERE a.role_id = r.id AND a.end_date IS NULL LIMIT 1) as current_occupant_name,
               (SELECT e.avatar_url FROM assignments a JOIN employees e ON a.employee_id = e.id WHERE a.role_id = r.id AND a.end_date IS NULL LIMIT 1) as current_occupant_avatar
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
    '''
    params = []
    if department_id:
        query += " AND r.department_id = ?"
        params.append(department_id)
    if status:
        query += " AND r.status = ?"
        params.append(status)
    
    cursor = db.execute(query, params)
    roles = []
    for row in cursor.fetchall():
        role = dict(row)
        try:
            role["tech_stack"] = json.loads(role["tech_stack"]) if role["tech_stack"] else []
            role["skills_required"] = json.loads(role["skills_required"]) if role["skills_required"] else []
        except Exception:
            role["tech_stack"] = []
            role["skills_required"] = []
        roles.append(role)
    return roles

@router.get("/{id}")
def get_role(id: int, db: sqlite3.Connection = Depends(get_db)):
    role = db.execute('''
        SELECT r.*, d.name as department_name, d.budget as department_budget, d.color as department_color,
               mgr.title as manager_title
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN roles mgr ON r.manager_role_id = mgr.id
        WHERE r.id = ?
    ''', (id,)).fetchone()
    
    if not role:
        return {"error": "Not found"}
    
    mutations = db.execute("SELECT * FROM role_mutations WHERE source_role_id = ? OR target_role_id = ?", (id, id)).fetchall()
    assignments = db.execute('''
        SELECT a.*, e.name as employee_name, e.avatar_url as employee_avatar, e.level as employee_level
        FROM assignments a
        JOIN employees e ON a.employee_id = e.id
        WHERE a.role_id = ?
        ORDER BY a.start_date DESC
    ''', (id,)).fetchall()
    
    reporting = db.execute('''
        SELECT rl.*, sub.title as subordinate_title, mgr.title as manager_title
        FROM reporting_lines rl
        LEFT JOIN roles sub ON rl.subordinate_role_id = sub.id
        LEFT JOIN roles mgr ON rl.manager_role_id = mgr.id
        WHERE rl.subordinate_role_id = ? OR rl.manager_role_id = ?
    ''', (id, id)).fetchall()
    
    relevancy = db.execute("SELECT * FROM role_relevancy WHERE role_id = ? ORDER BY assessed_date DESC", (id,)).fetchall()
    
    result = dict(role)
    try:
        result["tech_stack"] = json.loads(result["tech_stack"]) if result["tech_stack"] else []
        result["skills_required"] = json.loads(result["skills_required"]) if result["skills_required"] else []
    except Exception:
        result["tech_stack"] = []
        result["skills_required"] = []
        
    result["mutations"] = [dict(row) for row in mutations]
    result["assignments"] = [dict(row) for row in assignments]
    result["reporting_lines"] = [dict(row) for row in reporting]
    result["relevancy"] = [dict(row) for row in relevancy]
    return result
