from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteCreate(BaseModel):
    user_id: int
    title: str
    content: Optional[str] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NoteOut(BaseModel):
    id: int
    user_id: int
    title: str
    content: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
