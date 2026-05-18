# MJÖLNIR

Asistente personal IA con personalidad profesional. Backend FastAPI + MySQL.

## Requisitos

- Python 3.11+
- MySQL 8+

## Configuración inicial

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Edita .env con tus credenciales reales
```

## Variables de entorno (`.env`)

| Variable        | Descripción                      |
|-----------------|----------------------------------|
| DB_HOST         | Host del servidor MySQL          |
| DB_PORT         | Puerto MySQL (default 3306)      |
| DB_NAME         | Nombre de la base de datos       |
| DB_USER         | Usuario MySQL                    |
| DB_PASSWORD     | Contraseña MySQL                 |
| APP_ENV         | `development` o `production`     |
| APP_SECRET_KEY  | Clave secreta de la aplicación   |

## Ejecutar el backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints disponibles

| Método | Ruta                  | Descripción                          |
|--------|-----------------------|--------------------------------------|
| GET    | /api/health           | Estado del servicio                  |
| POST   | /api/chat             | Enviar mensaje (stub por ahora)      |
| GET    | /api/conversations    | Listar conversaciones                |
| POST   | /api/tasks            | Crear tarea                          |
| POST   | /api/notes            | Crear nota                           |

Documentación interactiva disponible en: `http://localhost:8000/docs`

## Estructura del backend

```text
backend/
├── app/
│   ├── main.py          # FastAPI app + CORS + routers
│   ├── config.py        # Settings desde variables de entorno
│   ├── database.py      # Engine SQLAlchemy + sesión
│   ├── models/          # Modelos ORM (User, Conversation, Message, Task, Note)
│   ├── schemas/         # Schemas Pydantic (validación I/O)
│   ├── routes/          # Endpoints por recurso
│   ├── services/        # Lógica de negocio
│   ├── agents/          # Agentes IA (stub — pendiente)
│   └── memory/          # Memoria contextual (stub — pendiente)
├── requirements.txt
└── .env.example
```
