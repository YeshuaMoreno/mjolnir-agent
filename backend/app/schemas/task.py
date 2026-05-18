from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    status: str = "pending"
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
