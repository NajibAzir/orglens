from fastapi import APIRouter, Depends
from database import get_db
import sqlite3

router = APIRouter(prefix="/api/ticketing", tags=["ticketing"])

@router.get("")
def list_ticketing_employees(db: sqlite3.Connection = Depends(get_db)):
    query = '''
        SELECT DISTINCT e.id, e.name, e.avatar_url, e.level,
               r.title as current_role, d.name as department,
               COUNT(t.id) as ticket_count,
               ROUND(SUM(t.hours_spent), 1) as total_logged_hours
        FROM ticket_logs t
        JOIN employees e ON t.employee_id = e.id
        LEFT JOIN assignments a ON e.id = a.employee_id AND a.end_date IS NULL
        LEFT JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        GROUP BY e.id
        ORDER BY total_logged_hours DESC
    '''
    cursor = db.execute(query)
    return [dict(row) for row in cursor.fetchall()]

@router.get("/{employee_id}")
def get_ticketing(employee_id: int, db: sqlite3.Connection = Depends(get_db)):
    emp = db.execute('''
        SELECT e.*, r.title as current_role, d.name as current_department
        FROM employees e
        LEFT JOIN assignments a ON e.id = a.employee_id AND a.end_date IS NULL
        LEFT JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE e.id = ?
    ''', (employee_id,)).fetchone()
    
    query = '''
        SELECT category, SUM(hours_spent) as total_hours, COUNT(id) as count
        FROM ticket_logs
        WHERE employee_id = ?
        GROUP BY category
        ORDER BY total_hours DESC
    '''
    cursor = db.execute(query, (employee_id,))
    rows = cursor.fetchall()
    
    total = sum(r['total_hours'] for r in rows)
    distribution = []
    top_cat = None
    top_pct = 0
    
    for r in rows:
        pct = (r['total_hours'] / total * 100) if total > 0 else 0
        if pct > top_pct:
            top_pct = pct
            top_cat = r['category']
            
        distribution.append({
            "category": r['category'],
            "total_hours": round(r['total_hours'], 1),
            "count": r['count'],
            "percentage": round(pct, 1)
        })
        
    # AI Restructuring Placement Recommendation Engine
    recommendation = {
        "dominant_category": top_cat,
        "dominant_percentage": round(top_pct, 1),
        "suggested_department": "Engineering",
        "suggested_role": "Software Engineer",
        "fit_confidence": "High",
        "reasoning": "Consistent contribution pattern aligned with engineering responsibilities."
    }
    
    if top_cat == "devops":
        recommendation["suggested_department"] = "Platform Engineering"
        recommendation["suggested_role"] = "DevOps / SRE Engineer"
        recommendation["fit_confidence"] = "94%" if top_pct > 60 else "82%"
        recommendation["reasoning"] = f"Logged {round(top_pct, 1)}% of total hours in CI/CD, Kubernetes, and Cloud infrastructure. Highly recommended for transfer into Platform Engineering."
    elif top_cat == "data":
        recommendation["suggested_department"] = "Data & Analytics"
        recommendation["suggested_role"] = "Data Engineer"
        recommendation["fit_confidence"] = "91%" if top_pct > 60 else "79%"
        recommendation["reasoning"] = f"Logged {round(top_pct, 1)}% of total hours in pipelines, telemetry, and Spark. Recommended for Data & Analytics squad."
    elif top_cat == "testing":
        recommendation["suggested_department"] = "Quality Assurance"
        recommendation["suggested_role"] = "Automation QA Specialist"
        recommendation["fit_confidence"] = "88%"
        recommendation["reasoning"] = f"High focus ({round(top_pct, 1)}%) on E2E test suites, regression test passes, and test frameworks."
    elif top_cat == "frontend":
        recommendation["suggested_department"] = "Product & Engineering"
        recommendation["suggested_role"] = "Frontend Engineer"
        recommendation["fit_confidence"] = "92%"
        recommendation["reasoning"] = f"Logged {round(top_pct, 1)}% of total hours in web UI, React, and UX interaction."
    else:
        recommendation["suggested_department"] = "Engineering"
        recommendation["suggested_role"] = "Senior Backend Engineer"
        recommendation["fit_confidence"] = "95%"
        recommendation["reasoning"] = f"Primary workload focused on microservices, payment gateways, and API concurrency ({round(top_pct, 1)}%)."

    return {
        "employee": dict(emp) if emp else None,
        "total_hours": round(total, 1),
        "distribution": distribution,
        "restructuring_recommendation": recommendation
    }
