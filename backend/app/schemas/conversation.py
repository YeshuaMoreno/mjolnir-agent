from datetime import datetime
from pydantic import BaseModel


class ConversationOut(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
