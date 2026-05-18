from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteOut, NoteUpdate

router = APIRouter()


def _ensure_user_exists(user_id: int, db: Session) -> None:
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")


def _get_note_or_raise(note_id: int, user_id: int, db: Session) -> Note:
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Nota no encontrada.")
    if note.user_id != user_id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta nota.")
    return note


@router.post("/notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)):
    _ensure_user_exists(payload.user_id, db)
    note = Note(**payload.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/notes", response_model=list[NoteOut])
def list_notes(user_id: int, db: Session = Depends(get_db)):
    _ensure_user_exists(user_id, db)
    return (
        db.query(Note)
        .filter(Note.user_id == user_id)
        .order_by(Note.created_at.desc())
        .all()
    )


@router.get("/notes/{note_id}", response_model=NoteOut)
def get_note(note_id: int, user_id: int, db: Session = Depends(get_db)):
    return _get_note_or_raise(note_id, user_id, db)


@router.put("/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, user_id: int, payload: NoteUpdate, db: Session = Depends(get_db)):
    note = _get_note_or_raise(note_id, user_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, user_id: int, db: Session = Depends(get_db)):
    note = _get_note_or_raise(note_id, user_id, db)
    db.delete(note)
    db.commit()
