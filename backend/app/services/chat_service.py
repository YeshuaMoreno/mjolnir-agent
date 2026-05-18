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
    """
    Persiste el intercambio user/assistant y devuelve (reply, conversation_id).
    La generación de respuesta es un stub hasta integrar un LLM real.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, None  # el router convierte esto en 404

    if conversation_id is None:
        title = message[:50] if len(message) > 50 else message
        conversation = Conversation(user_id=user_id, title=title)
        db.add(conversation)
        db.flush()  # obtiene el id sin hacer commit aún
        conversation_id = conversation.id

    db.add(Message(conversation_id=conversation_id, role="user", content=message))

    reply = _generate_stub_reply(message)

    db.add(Message(conversation_id=conversation_id, role="assistant", content=reply))
    db.commit()

    return reply, conversation_id


def _generate_stub_reply(message: str) -> str:
    return f"[MJÖLNIR] Entendido: «{message}». Integración con LLM pendiente."
