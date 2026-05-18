from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User


def process_chat(
    db: Session,
    user_id: int,
    message: str,
    conversation_id: int | None,
) -> tuple[str, int]:
    """Persiste el intercambio user/assistant y devuelve (reply, conversation_id)."""
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if conversation_id is not None:
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversación no encontrada.")
        if conversation.user_id != user_id:
            raise HTTPException(status_code=403, detail="No tienes acceso a esta conversación.")
    else:
        title = message[:50]
        conversation = Conversation(user_id=user_id, title=title)
        db.add(conversation)
        db.flush()
        conversation_id = conversation.id

    db.add(Message(conversation_id=conversation_id, role="user", content=message))

    reply = _generate_stub_reply(message)

    db.add(Message(conversation_id=conversation_id, role="assistant", content=reply))
    db.commit()

    return reply, conversation_id


def _generate_stub_reply(message: str) -> str:
    return f"[MJÖLNIR] Entendido: «{message}». Integración con LLM pendiente."
