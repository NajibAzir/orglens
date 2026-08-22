from fastapi import APIRouter, Depends, UploadFile, File
from database import get_db
import sqlite3
import pandas as pd
import io

router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("")
async def upload_csv(file: UploadFile = File(...), db: sqlite3.Connection = Depends(get_db)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    
    # Very basic routing based on filename
    table_name = None
    if "employee" in file.filename.lower():
        table_name = "employees"
    elif "role" in file.filename.lower() and "mutation" not in file.filename.lower():
        table_name = "roles"
    elif "department" in file.filename.lower():
        table_name = "departments"
    elif "movement" in file.filename.lower() or "assignment" in file.filename.lower():
        table_name = "assignments"
    elif "ticket" in file.filename.lower():
        table_name = "ticket_logs"
    else:
        return {"error": "Could not determine target table from filename"}
        
    df.to_sql(table_name, db, if_exists='append', index=False)
    db.commit()
    return {"message": f"Successfully imported {len(df)} records into {table_name}"}
