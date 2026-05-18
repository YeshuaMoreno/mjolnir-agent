from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate

router = APIRouter()


def _ensure_user_exists(user_id: int, db: Session) -> None:
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")


def _get_task_or_raise(task_id: int, user_id: int, db: Session) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada.")
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta tarea.")
    return task


@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    _ensure_user_exists(payload.user_id, db)
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/tasks", response_model=list[TaskOut])
def list_tasks(user_id: int, db: Session = Depends(get_db)):
    _ensure_user_exists(user_id, db)
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: int, user_id: int, db: Session = Depends(get_db)):
    return _get_task_or_raise(task_id, user_id, db)


@router.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, user_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = _get_task_or_raise(task_id, user_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, user_id: int, db: Session = Depends(get_db)):
    task = _get_task_or_raise(task_id, user_id, db)
    db.delete(task)
    db.commit()
