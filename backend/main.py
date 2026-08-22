from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, DB_PATH
import os
import subprocess

from routers import (
    employees, roles, org_tree, movements, ticketing,
    wellbeing, relevancy, upload, departments, dashboard, anomalies, role_history, scenarios
)

app = FastAPI(title="OrgLens API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Add production frontend URL from environment variable
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# Allow all origins in production for simplicity (demo app, no auth)
allow_all = os.environ.get("CORS_ALLOW_ALL", "false").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    # Auto-seed if database is empty (fresh deploy)
    import sqlite3
    conn = sqlite3.connect(DB_PATH)
    count = conn.execute("SELECT COUNT(*) FROM employees").fetchone()[0]
    conn.close()
    if count == 0:
        print("[STARTUP] Empty database detected — running seed_data.py...")
        subprocess.run(["python", "seed_data.py"], cwd=os.path.dirname(os.path.abspath(__file__)))
        print("[STARTUP] Database seeded successfully.")

app.include_router(employees.router)
app.include_router(roles.router)
app.include_router(org_tree.router)
app.include_router(movements.router)
app.include_router(ticketing.router)
app.include_router(wellbeing.router)
app.include_router(relevancy.router)
app.include_router(upload.router)
app.include_router(departments.router)
app.include_router(dashboard.router)
app.include_router(anomalies.router)
app.include_router(role_history.router)
app.include_router(scenarios.router)

@app.get("/")
def root():
    return {"message": "Welcome to OrgLens API"}
