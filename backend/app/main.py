from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import health, chat, conversations, tasks, notes, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MJÖLNIR API",
    description="Backend del asistente personal MJÖLNIR",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",   # Angular dev
        "http://localhost:8100",   # Ionic dev
        "http://localhost:8080",
        "capacitor://localhost",   # Capacitor native
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(conversations.router, prefix="/api", tags=["conversations"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(notes.router, prefix="/api", tags=["notes"])
app.include_router(users.router, prefix="/api", tags=["users"])
