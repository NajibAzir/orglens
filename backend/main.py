from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db

from routers import (
    employees, roles, org_tree, movements, ticketing,
    wellbeing, relevancy, upload, departments, dashboard, anomalies, role_history, scenarios
)

app = FastAPI(title="OrgLens API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

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
