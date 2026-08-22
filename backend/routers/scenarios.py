from fastapi import APIRouter, Depends
from database import get_db
import sqlite3
import json

router = APIRouter(prefix="/api/scenarios", tags=["scenarios"])

@router.get("")
def list_scenarios(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT * FROM scenarios ORDER BY effective_date ASC")
    scenarios = []
    for row in cursor.fetchall():
        sc = dict(row)
        try:
            sc["key_changes"] = json.loads(sc["key_changes"]) if sc["key_changes"] else []
        except Exception:
            sc["key_changes"] = []
        scenarios.append(sc)
    return scenarios

@router.get("/{id}")
def get_scenario(id: int, db: sqlite3.Connection = Depends(get_db)):
    sc = db.execute("SELECT * FROM scenarios WHERE id = ?", (id,)).fetchone()
    if not sc:
        return {"error": "Scenario not found"}
    result = dict(sc)
    try:
        result["key_changes"] = json.loads(result["key_changes"]) if result["key_changes"] else []
    except Exception:
        result["key_changes"] = []
    return result
