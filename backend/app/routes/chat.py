from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import process_chat

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    reply, conversation_id = process_chat(
        db=db,
        user_id=request.user_id,
        message=request.message,
        conversation_id=request.conversation_id,
    )
    return ChatResponse(reply=reply, conversation_id=conversation_id)
