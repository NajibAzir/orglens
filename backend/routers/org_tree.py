from fastapi import APIRouter, Depends
from database import get_db
import sqlite3
from typing import Optional
import json

router = APIRouter(prefix="/api/org-tree", tags=["org-tree"])

@router.get("")
def get_org_tree(date: Optional[str] = None, db: sqlite3.Connection = Depends(get_db)):
    if not date:
        date = db.execute("SELECT date('now')").fetchone()[0]
        
    roles = db.execute('''
        SELECT r.id, r.title, r.department_id, r.level, r.skills_required, r.relevancy_trend,
               d.name as department, d.color as department_color, r.manager_role_id
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE r.created_at <= ? AND (r.retired_at IS NULL OR r.retired_at >= ?)
    ''', (date, date)).fetchall()
    
    assignments = db.execute('''
        SELECT a.role_id, e.name as occupant_name, e.id as employee_id, 
               e.avatar_url as occupant_avatar, e.level as employee_level
        FROM assignments a
        JOIN employees e ON a.employee_id = e.id
        WHERE a.start_date <= ? AND (a.end_date IS NULL OR a.end_date >= ?)
    ''', (date, date)).fetchall()
    
    occupants = {}
    for row in assignments:
        occupants[row['role_id']] = {
            'name': row['occupant_name'],
            'employee_id': row['employee_id'],
            'avatar': row['occupant_avatar'],
            'level': row['employee_level']
        }
    
    nodes = {}
    for r in roles:
        role_id = r['id']
        occ = occupants.get(role_id, {})
        try:
            skills = json.loads(r['skills_required']) if r['skills_required'] else []
        except Exception:
            skills = []
            
        nodes[role_id] = {
            "role_id": role_id,
            "title": r['title'],
            "department": r['department'],
            "department_color": r['department_color'] or '#00BFFF',
            "level": r['level'],
            "skills": skills[:3],
            "trend": r['relevancy_trend'],
            "occupant_name": occ.get('name'),
            "occupant_avatar": occ.get('avatar'),
            "employee_id": occ.get('employee_id'),
            "manager_role_id": r['manager_role_id'],
            "children": []
        }
        
    tree = []
    for role_id, node in nodes.items():
        mgr = node["manager_role_id"]
        if mgr and mgr in nodes:
            nodes[mgr]["children"].append(node)
        else:
            tree.append(node)
            
    return tree
