from fastapi import APIRouter, Depends
from database import get_db
import sqlite3

router = APIRouter(prefix="/api/role-history", tags=["role-history"])

@router.get("/{role_id}")
def get_role_history(role_id: int, db: sqlite3.Connection = Depends(get_db)):
    events = []
    
    # Creation
    role = db.execute("SELECT created_at, title FROM roles WHERE id = ?", (role_id,)).fetchone()
    if role:
        events.append({
            "date": role['created_at'], 
            "type": "Created", 
            "details": f"Role '{role['title']}' was created"
        })
        
    # Mutations
    mutations = db.execute(
        "SELECT effective_date, mutation_type, notes FROM role_mutations WHERE source_role_id = ? OR target_role_id = ?", 
        (role_id, role_id)
    ).fetchall()
    for m in mutations:
        type_label = {
            'renamed': 'Renamed',
            'split': 'Split',
            'merged': 'Merged', 
            'reporting_change': 'Reporting Change'
        }.get(m['mutation_type'], m['mutation_type'].title())
        
        events.append({
            "date": m['effective_date'], 
            "type": type_label, 
            "details": m['notes'] or f"Role {m['mutation_type']}"
        })
        
    # Assignments
    assignments = db.execute('''
        SELECT a.start_date, a.end_date, a.reason, e.name, e.id as employee_id
        FROM assignments a
        JOIN employees e ON a.employee_id = e.id
        WHERE a.role_id = ?
    ''', (role_id,)).fetchall()
    for a in assignments:
        events.append({
            "date": a['start_date'], 
            "type": "New Occupant", 
            "details": f"{a['name']} assigned ({a['reason'] or 'transition'})",
            "occupant_name": a['name'],
            "occupant_id": a['employee_id']
        })
        if a['end_date']:
            events.append({
                "date": a['end_date'], 
                "type": "Vacated", 
                "details": f"{a['name']} left this role",
                "occupant_name": a['name'],
                "occupant_id": a['employee_id']
            })
            
    # Reporting lines
    reporting = db.execute('''
        SELECT rl.start_date, rl.end_date, rl.notes,
               mgr_role.title as manager_role_title
        FROM reporting_lines rl
        LEFT JOIN roles mgr_role ON rl.manager_role_id = mgr_role.id
        WHERE rl.subordinate_role_id = ?
    ''', (role_id,)).fetchall()
    for r in reporting:
        events.append({
            "date": r['start_date'], 
            "type": "Reporting Change", 
            "details": r['notes'] or f"Now reports to {r['manager_role_title']}"
        })
        
    events.sort(key=lambda x: x['date'] if x['date'] else "")
    return events
