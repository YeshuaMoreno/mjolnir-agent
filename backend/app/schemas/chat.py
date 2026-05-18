from pydantic import BaseModel


class ChatRequest(BaseModel):
    user_id: int
    message: str
    conversation_id: int | None = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: int
