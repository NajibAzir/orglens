from fastapi import APIRouter, Depends, HTTPException, Body
from database import get_db
import sqlite3
import json
from datetime import date

router = APIRouter(prefix="/api", tags=["relevancy_and_upskilling"])

# Technology macro-trends catalog
MACRO_TRENDS = [
    {
        "id": "gen-ai",
        "title": "Generative AI & Agentic Code Assistance",
        "category": "Software Engineering & AI",
        "market_impact": "+64% Velocity Shift",
        "trend_direction": "up",
        "risk_level": "Transformative",
        "summary": "AI pair programmers and automated boilerplate generation are shifting developer value from raw syntax coding to system design, architecture review, and test validation.",
        "affected_roles": ["Software Engineer", "Junior Software Engineer", "Tech Lead (Payments)", "Frontend Lead"],
        "recommended_skills": ["Prompt Engineering", "Copilot/Claude Code Workflows", "LLM APIs", "System Design Validation"]
    },
    {
        "id": "ci-cd-automation",
        "title": "Continuous Automated Quality & Playwright E2E",
        "category": "Quality Assurance",
        "market_impact": "-38% Manual Demand",
        "trend_direction": "down",
        "risk_level": "High Obsolescence Risk",
        "summary": "Manual regression testing is rapidly being eliminated in favor of automated headless browser testing (Playwright/Cypress) integrated into CI/CD pipelines.",
        "affected_roles": ["Manual QA Tester", "QA Manager", "Senior QA Engineer (Automation)"],
        "recommended_skills": ["Playwright", "TypeScript", "CI/CD Pipeline Automation", "API Performance Testing"]
    },
    {
        "id": "platform-finops",
        "title": "Platform Engineering & Cloud FinOps",
        "category": "Infrastructure & Cloud",
        "market_impact": "+52% High Demand",
        "trend_direction": "up",
        "risk_level": "Growth Engine",
        "summary": "Dedicated Internal Developer Platforms (IDPs), Kubernetes containerization, and automated AWS cost management (FinOps) are replacing traditional sysadmin operations.",
        "affected_roles": ["Head of Platform Engineering", "Senior DevOps Engineer", "Cloud Security & SRE"],
        "recommended_skills": ["Kubernetes (CKA)", "Terraform / OpenTofu", "AWS FinOps", "Prometheus & Datadog SRE"]
    },
    {
        "id": "realtime-data-lakehouse",
        "title": "Real-time Event Sourcing & Data Lakehouse",
        "category": "Data & Analytics",
        "market_impact": "+45% Growth",
        "trend_direction": "up",
        "risk_level": "Expansion",
        "summary": "Batch ETL is transitioning into streaming architectures with Apache Kafka, dbt, and modern lakehouses for live transactional analytics in fintech.",
        "affected_roles": ["Lead Data Engineer", "Data Engineer", "Data Analyst"],
        "recommended_skills": ["Apache Kafka", "dbt", "Snowflake / BigQuery", "Real-Time Streaming"]
    }
]

# Intelligent fallback mapping for roles without specific seed records
DEFAULT_ROLE_SUGGESTIONS = {
    "Engineering": {
        "score": 0.85,
        "trend": "Strong demand for scalable backend APIs, Go microservices, and event-driven payment architectures across SEA fintech.",
        "direction": "up",
        "courses": [
            {"course": "Ardan Labs: Ultimate Go - Advanced Engineering", "duration": "5 weeks", "urgency": "High", "relevance_gain": "+22%"},
            {"course": "Apache Kafka for Event-Driven Architecture (Confluent)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+20%"}
        ]
    },
    "Quality Assurance": {
        "score": 0.55,
        "trend": "Manual testing demand dropping -45%. Automation-first QA with Playwright, CI/CD integration, and AI-powered test generation is the new standard.",
        "direction": "down",
        "courses": [
            {"course": "Playwright Complete Guide: E2E Testing (Test Automation University)", "duration": "5 weeks", "urgency": "Critical", "relevance_gain": "+45%"},
            {"course": "Python for Test Automation (Udemy - Andrew Knight)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+30%"}
        ]
    },
    "Platform Engineering": {
        "score": 0.94,
        "trend": "Platform Engineering is #1 in Gartner 2024 Hype Cycle. Kubernetes, GitOps (ArgoCD), and Internal Developer Platforms (IDPs) are highest-demand skills.",
        "direction": "up",
        "courses": [
            {"course": "Certified Kubernetes Administrator (CKA) - Linux Foundation", "duration": "8 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
            {"course": "HashiCorp Certified: Terraform Associate (003)", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+12%"}
        ]
    },
    "Data & Analytics": {
        "score": 0.82,
        "trend": "Streaming-first lakehouse architectures (Kafka + dbt + Snowflake) replacing batch ETL. Real-time fraud detection and feature stores are core fintech needs.",
        "direction": "up",
        "courses": [
            {"course": "Databricks Certified Data Engineer Professional", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+18%"},
            {"course": "dbt Fundamentals & Advanced Materialisation (dbt Labs Official)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+25%"}
        ]
    },
    "Product": {
        "score": 0.82,
        "trend": "Product roles require AI product strategy fluency, growth experimentation, and BNM regulatory compliance for Malaysian fintech.",
        "direction": "stable",
        "courses": [
            {"course": "AI Product Management Specialization (Duke University - Coursera)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+22%"},
            {"course": "Reforge: Product Strategy Program", "duration": "6 weeks", "urgency": "Medium", "relevance_gain": "+18%"}
        ]
    },
    "People & Culture": {
        "score": 0.72,
        "trend": "HR evolving toward data-driven people analytics, AI workforce planning, and organisational network analysis. Traditional admin declining.",
        "direction": "stable",
        "courses": [
            {"course": "People Analytics Specialization (Wharton - Coursera)", "duration": "5 weeks", "urgency": "High", "relevance_gain": "+25%"},
            {"course": "SHRM Senior Certified Professional (SHRM-SCP)", "duration": "8 weeks", "urgency": "Medium", "relevance_gain": "+15%"}
        ]
    }
}

@router.get("/role-relevancy")
def get_all_role_relevancy(db: sqlite3.Connection = Depends(get_db)):
    """Returns relevancy intelligence across all roles in the organization."""
    query = """
        SELECT r.id as role_id, r.title, r.code, r.level, r.department_id, r.status,
               d.name as department_name, d.color as department_color,
               rr.relevancy_score, rr.industry_trend, rr.trend_direction, rr.upskill_suggestions, rr.assessed_date,
               (SELECT COUNT(*) FROM assignments a WHERE a.role_id = r.id AND a.end_date IS NULL) as occupant_count
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN role_relevancy rr ON r.id = rr.role_id
            AND rr.assessed_date = (SELECT MAX(rr2.assessed_date) FROM role_relevancy rr2 WHERE rr2.role_id = r.id)
        ORDER BY r.department_id, r.id
    """
    cursor = db.execute(query)
    rows = cursor.fetchall()
    
    results = []
    for row in rows:
        item = dict(row)
        dept = item.get("department_name") or "Engineering"
        defaults = DEFAULT_ROLE_SUGGESTIONS.get(dept, DEFAULT_ROLE_SUGGESTIONS["Engineering"])
        
        if item.get("relevancy_score") is None:
            item["relevancy_score"] = defaults["score"]
            item["industry_trend"] = defaults["trend"]
            item["trend_direction"] = defaults["direction"]
            item["upskill_suggestions"] = json.dumps(defaults["courses"])
            item["assessed_date"] = "2024-01-01"
            
        try:
            item["upskill_suggestions"] = json.loads(item["upskill_suggestions"]) if isinstance(item["upskill_suggestions"], str) else item["upskill_suggestions"]
        except Exception:
            item["upskill_suggestions"] = []
            
        results.append(item)
    return results

@router.get("/role-relevancy/{role_id}")
def get_single_role_relevancy(role_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Returns relevancy data for a specific role."""
    query = """
        SELECT r.id as role_id, r.title, r.code, r.level, r.department_id,
               d.name as department_name, d.color as department_color,
               rr.relevancy_score, rr.industry_trend, rr.trend_direction, rr.upskill_suggestions, rr.assessed_date
        FROM roles r
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN role_relevancy rr ON r.id = rr.role_id
        WHERE r.id = ?
        ORDER BY rr.assessed_date DESC
    """
    cursor = db.execute(query, (role_id,))
    rows = cursor.fetchall()
    
    if not rows:
        raise HTTPException(status_code=404, detail="Role not found")
        
    results = []
    for row in rows:
        item = dict(row)
        dept = item.get("department_name") or "Engineering"
        defaults = DEFAULT_ROLE_SUGGESTIONS.get(dept, DEFAULT_ROLE_SUGGESTIONS["Engineering"])
        
        if item.get("relevancy_score") is None:
            item["relevancy_score"] = defaults["score"]
            item["industry_trend"] = defaults["trend"]
            item["trend_direction"] = defaults["direction"]
            item["upskill_suggestions"] = defaults["courses"]
            item["assessed_date"] = "2024-01-01"
        else:
            try:
                item["upskill_suggestions"] = json.loads(item["upskill_suggestions"]) if isinstance(item["upskill_suggestions"], str) else item["upskill_suggestions"]
            except Exception:
                item["upskill_suggestions"] = []
        results.append(item)
    return results

@router.get("/role-relevancy/trends/macro")
def get_macro_trends():
    """Returns global technology macro-trends and market shifts."""
    return MACRO_TRENDS

@router.get("/upskilling/recommendations")
def get_upskilling_recommendations(db: sqlite3.Connection = Depends(get_db)):
    """Returns organization-wide talent upskilling matrix across all employees."""
    query = """
        SELECT e.id as employee_id, e.name as employee_name, e.email, e.avatar_url, e.level, e.status,
               r.id as role_id, r.title as current_role,
               d.name as department_name, d.color as department_color,
               rr.relevancy_score, rr.trend_direction, rr.industry_trend, rr.upskill_suggestions
        FROM employees e
        LEFT JOIN assignments a ON e.id = a.employee_id AND a.end_date IS NULL
        LEFT JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN role_relevancy rr ON r.id = rr.role_id
            AND rr.assessed_date = (SELECT MAX(rr2.assessed_date) FROM role_relevancy rr2 WHERE rr2.role_id = r.id)
        WHERE e.status = 'active'
        GROUP BY e.id
        ORDER BY d.id, e.name
    """
    cursor = db.execute(query)
    rows = cursor.fetchall()
    
    prog_cursor = db.execute("SELECT employee_id, course_name, status FROM upskilling_progress")
    progress_map = {}
    for p in prog_cursor.fetchall():
        emp_id = p["employee_id"]
        if emp_id not in progress_map:
            progress_map[emp_id] = {}
        progress_map[emp_id][p["course_name"]] = p["status"]
    
    recommendations = []
    for row in rows:
        emp = dict(row)
        dept = emp.get("department_name") or "Engineering"
        defaults = DEFAULT_ROLE_SUGGESTIONS.get(dept, DEFAULT_ROLE_SUGGESTIONS["Engineering"])
        
        score = emp.get("relevancy_score") if emp.get("relevancy_score") is not None else defaults["score"]
        direction = emp.get("trend_direction") or defaults["direction"]
        trend = emp.get("industry_trend") or defaults["trend"]
        
        try:
            courses = json.loads(emp.get("upskill_suggestions")) if emp.get("upskill_suggestions") else defaults["courses"]
        except Exception:
            courses = defaults["courses"]
            
        emp_progress = progress_map.get(emp["employee_id"], {})
        
        enriched_courses = []
        completed_count = 0
        for c in courses:
            c_name = c.get("course")
            st = emp_progress.get(c_name, "not_started")
            if st == "completed":
                completed_count += 1
            enriched_courses.append({
                **c,
                "status": st
            })
            
        progress_pct = round((completed_count / max(1, len(enriched_courses))) * 100)
        
        recommendations.append({
            "employee_id": emp["employee_id"],
            "employee_name": emp["employee_name"],
            "email": emp["email"],
            "avatar_url": emp["avatar_url"],
            "level": emp["level"],
            "role_id": emp["role_id"],
            "current_role": emp["current_role"] or "Unassigned",
            "department_name": dept,
            "department_color": emp["department_color"] or "#00BFFF",
            "relevancy_score": score,
            "trend_direction": direction,
            "industry_trend": trend,
            "courses": enriched_courses,
            "progress_pct": progress_pct,
            "urgency": "High" if score < 0.6 else "Medium" if score < 0.85 else "Low"
        })
        
    return recommendations

@router.get("/upskilling/personal/{employee_id}")
def get_personal_upskilling(employee_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Returns personalized learning pathway and role relevancy for a specific staff member."""
    emp_cur = db.execute("SELECT * FROM employees WHERE id = ?", (employee_id,))
    emp_row = emp_cur.fetchone()
    if not emp_row:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp = dict(emp_row)
    
    role_cur = db.execute("""
        SELECT r.id as role_id, r.title as current_role, r.level as role_level,
               d.name as department_name, d.color as department_color,
               rr.relevancy_score, rr.industry_trend, rr.trend_direction, rr.upskill_suggestions
        FROM assignments a
        JOIN roles r ON a.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN role_relevancy rr ON r.id = rr.role_id
        WHERE a.employee_id = ? AND a.end_date IS NULL
    """, (employee_id,))
    role_row = role_cur.fetchone()
    
    dept = "Engineering"
    role_title = "Software Engineer"
    dept_color = "#00BFFF"
    score = 0.85
    direction = "stable"
    trend = "Demand is stable for core software services."
    courses = []
    
    if role_row:
        role_dict = dict(role_row)
        dept = role_dict.get("department_name") or "Engineering"
        role_title = role_dict.get("current_role") or "Software Engineer"
        dept_color = role_dict.get("department_color") or "#00BFFF"
        defaults = DEFAULT_ROLE_SUGGESTIONS.get(dept, DEFAULT_ROLE_SUGGESTIONS["Engineering"])
        
        score = role_dict.get("relevancy_score") if role_dict.get("relevancy_score") is not None else defaults["score"]
        direction = role_dict.get("trend_direction") or defaults["direction"]
        trend = role_dict.get("industry_trend") or defaults["trend"]
        
        try:
            courses = json.loads(role_dict.get("upskill_suggestions")) if role_dict.get("upskill_suggestions") else defaults["courses"]
        except Exception:
            courses = defaults["courses"]
    else:
        defaults = DEFAULT_ROLE_SUGGESTIONS["Engineering"]
        score = defaults["score"]
        direction = defaults["direction"]
        trend = defaults["trend"]
        courses = defaults["courses"]
        
    prog_cur = db.execute("SELECT course_name, status, notes FROM upskilling_progress WHERE employee_id = ?", (employee_id,))
    prog_map = {p["course_name"]: {"status": p["status"], "notes": p["notes"]} for p in prog_cur.fetchall()}
    
    enriched_modules = []
    completed_count = 0
    for idx, c in enumerate(courses, 1):
        c_name = c.get("course")
        user_prog = prog_map.get(c_name, {"status": "not_started", "notes": ""})
        st = user_prog["status"]
        if st == "completed":
            completed_count += 1
            
        enriched_modules.append({
            "id": idx,
            "course": c_name,
            "duration": c.get("duration", "3 weeks"),
            "urgency": c.get("urgency", "Medium"),
            "relevance_gain": c.get("relevance_gain", "+20%"),
            "status": st,
            "notes": user_prog.get("notes") or ""
        })
        
    total_modules = max(1, len(enriched_modules))
    progress_pct = round((completed_count / total_modules) * 100)
    
    return {
        "employee_id": employee_id,
        "name": emp["name"],
        "avatar_url": emp["avatar_url"],
        "email": emp["email"],
        "level": emp["level"],
        "status": emp["status"],
        "current_role": role_title,
        "department_name": dept,
        "department_color": dept_color,
        "relevancy_score": score,
        "trend_direction": direction,
        "industry_trend": trend,
        "modules": enriched_modules,
        "completed_count": completed_count,
        "total_modules": total_modules,
        "progress_pct": progress_pct,
        "target_velocity_role": "Senior " + role_title if "Junior" in role_title or "Engineer" in role_title and "Senior" not in role_title else "Tech Lead / Specialist",
        "potential_relevancy_score": min(1.0, round(score + 0.25, 2))
    }

@router.post("/upskilling/progress")
def update_upskill_progress(payload: dict = Body(...), db: sqlite3.Connection = Depends(get_db)):
    """Updates course progress status (not_started, in_progress, completed) for an employee."""
    employee_id = payload.get("employee_id")
    course_name = payload.get("course_name")
    status = payload.get("status", "in_progress")
    notes = payload.get("notes", "")
    
    if not employee_id or not course_name:
        raise HTTPException(status_code=400, detail="employee_id and course_name are required")
        
    today = date.today().isoformat()
    completed_date = today if status == "completed" else None
    
    db.execute("""
        INSERT INTO upskilling_progress (employee_id, course_name, status, started_date, completed_date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(employee_id, course_name) DO UPDATE SET
            status = excluded.status,
            completed_date = excluded.completed_date,
            notes = excluded.notes
    """, (employee_id, course_name, status, today, completed_date, notes))
    db.commit()
    
    return {"message": "Upskill progress saved successfully", "status": status, "course_name": course_name}
