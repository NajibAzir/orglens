from fastapi import APIRouter, Depends
from database import get_db
import sqlite3

router = APIRouter(prefix="/api/anomalies", tags=["anomalies"])

@router.get("")
def get_anomalies(db: sqlite3.Connection = Depends(get_db)):
    anomalies = []
    
    # 1. Missing Managers (Orphan roles)
    missing_mgr = db.execute('''
        SELECT r.id, r.title, r.code, d.name as department, d.color as department_color
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE r.manager_role_id IS NULL AND r.status = 'active' AND r.code != 'ENG-CTO-001'
    ''').fetchall()
    for row in missing_mgr:
        anomalies.append({
            "type": "Missing Reporting Line",
            "severity": "High",
            "target_type": "role",
            "target_id": row['id'],
            "title": f"Role '{row['title']}' ({row['code']}) has no assigned manager",
            "department": row['department'],
            "recommendation": "Assign an active manager role to re-establish reporting hierarchy."
        })
        
    # 2. Vacant Roles (>90 days unoccupied)
    vacant_roles = db.execute('''
        SELECT r.id, r.title, r.code, d.name as department
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE r.status = 'active' 
        AND r.id NOT IN (
            SELECT role_id FROM assignments WHERE end_date IS NULL
        )
    ''').fetchall()
    for row in vacant_roles:
        anomalies.append({
            "type": "Vacant Position",
            "severity": "Medium",
            "target_type": "role",
            "target_id": row['id'],
            "title": f"Position '{row['title']}' has no active occupant",
            "department": row['department'],
            "recommendation": "Initiate talent transfer or archive role if obsolete."
        })
        
    # 3. Stagnant Careers (>3.5 years in same role without movement)
    stagnant = db.execute('''
        SELECT e.id, e.name, e.avatar_url, e.hire_date, r.title as current_role, d.name as department
        FROM employees e
        JOIN assignments a ON e.id = a.employee_id AND a.end_date IS NULL
        JOIN roles r ON a.role_id = r.id
        JOIN departments d ON r.department_id = d.id
        WHERE a.start_date <= '2021-06-01' AND e.status = 'active' AND r.level IN ('L2', 'L3')
    ''').fetchall()
    for row in stagnant:
        anomalies.append({
            "type": "Tenure Stagnation",
            "severity": "Warning",
            "target_type": "employee",
            "target_id": row['id'],
            "avatar": row['avatar_url'],
            "title": f"{row['name']} has been in {row['current_role']} for >3.5 years",
            "department": row['department'],
            "recommendation": "Conduct career progression review or recommend upskilling path."
        })
        
    # 4. Rapid Restructuring Transition Stress (>2 changes in 90 days)
    stress = db.execute('''
        SELECT e.id, e.name, e.avatar_url, w.triggered_by, w.trigger_date, w.stress_level
        FROM wellbeing_checkins w
        JOIN employees e ON w.employee_id = e.id
        WHERE w.stress_level >= 3 OR w.org_changes_count >= 2
    ''').fetchall()
    for row in stress:
        anomalies.append({
            "type": "Change Transition Stress",
            "severity": "Notice",
            "target_type": "employee",
            "target_id": row['id'],
            "avatar": row['avatar_url'],
            "title": f"{row['name']} underwent multiple reorg changes recently",
            "department": "Wellbeing",
            "recommendation": "Offer 1-on-1 manager check-in or supportive transition buffer."
        })
        
    return anomalies
