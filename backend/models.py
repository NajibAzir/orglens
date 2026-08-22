from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date, datetime

class DepartmentBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    created_at: date
    retired_at: Optional[date] = None
    status: str = 'active'

class RoleBase(BaseModel):
    code: Optional[str] = None
    title: str
    department_id: Optional[int] = None
    manager_role_id: Optional[int] = None
    created_at: date
    retired_at: Optional[date] = None
    status: str = 'active'

class EmployeeBase(BaseModel):
    name: str
    email: Optional[str] = None
    hire_date: date
    exit_date: Optional[date] = None
    status: str = 'active'

class WellbeingResponse(BaseModel):
    stress_level: int
    notes: Optional[str] = None
    answers: Optional[List[dict]] = None
