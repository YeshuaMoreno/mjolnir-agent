# MJÖLNIR

Asistente personal IA de uso privado. Diseñado para gestionar conversaciones, tareas y notas con una interfaz móvil/web. Respuesta actual: stub mock. Integración con LLM real: pendiente.

**Stack:** FastAPI · SQLAlchemy · MySQL · Ionic · Angular · Capacitor · Python 3.12 · Node 24

---

## Estructura del proyecto

```text
mjolnir/
├── backend/                 # API REST (FastAPI + Python)
│   ├── app/
│   │   ├── main.py          # Aplicación FastAPI, CORS, registro de routers
│   │   ├── config.py        # Variables de entorno via pydantic-settings
│   │   ├── database.py      # Engine SQLAlchemy, sesión, Base ORM
│   │   ├── models/          # ORM: User, Conversation, Message, Task, Note
│   │   ├── schemas/         # Pydantic: validación de entrada/salida
│   │   ├── routes/          # Endpoints por recurso (health, chat, users…)
│   │   ├── services/        # Lógica de negocio (chat_service stub)
│   │   ├── agents/          # Stub — agentes IA (fase futura)
│   │   └── memory/          # Stub — memoria contextual (fase futura)
│   ├── requirements.txt
│   └── .env.example
├── mobile/                  # App Ionic + Angular
│   └── src/app/
│       ├── core/
│       │   ├── models/      # Interfaces TypeScript
│       │   └── services/    # Servicios Angular (api, user, chat…)
│       └── pages/           # Páginas: user-select, dashboard, chat, conversations, tasks, notes
├── docs/                    # Documentación técnica
└── docker-compose.yml
```

---

## Requisitos previos

| Herramienta | Versión mínima |
| --- | --- |
| Python | 3.12 |
| MySQL | 8.0 |
| Node.js | 18 |
| npm | 9 |
| Ionic CLI | 7 (`npm install -g @ionic/cli`) |

---

## Configuración del backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # Editar con credenciales MySQL reales
```

### Variables de entorno (`backend/.env`)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_PORT` | Puerto MySQL | `3306` |
| `DB_NAME` | Nombre de la base de datos | `mjolnir_db` |
| `DB_USER` | Usuario MySQL | `mjolnir_user` |
| `DB_PASSWORD` | Contraseña MySQL | `secreto` |
| `APP_ENV` | Entorno | `development` |
| `APP_SECRET_KEY` | Clave interna | cadena aleatoria |

> Las tablas se crean automáticamente al arrancar si no existen (`Base.metadata.create_all`).

---

## Ejecutar el backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Documentación interactiva: `http://localhost:8000/docs`

---

## Ejecutar el frontend

```bash
cd mobile
ionic serve
```

App disponible en: `http://localhost:8100`

> El frontend apunta a `http://127.0.0.1:8000/api` (definido en `src/environments/environment.ts`).
> El backend debe estar corriendo antes de usar la app.

---

## Endpoints del backend

### Health

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio |

### Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/users` | Crear usuario |
| `GET` | `/api/users` | Listar usuarios |
| `GET` | `/api/users/{id}` | Obtener usuario |

### Chat

| Método | Ruta | Body requerido | Descripción |
| --- | --- | --- |---|
| `POST` | `/api/chat` | `user_id`, `message` | Enviar mensaje, persiste conversación y mensajes |

### Conversaciones

| Método | Ruta | Query params | Descripción |
| --- | --- | --- |---|
| `GET` | `/api/conversations` | `user_id` | Listar conversaciones del usuario |
| `GET` | `/api/conversations/{id}/messages` | `user_id` | Mensajes de una conversación |

### Tareas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/tasks` | Crear tarea |
| `GET` | `/api/tasks` | Listar (`?user_id=`) |
| `GET` | `/api/tasks/{id}` | Obtener (`?user_id=`) |
| `PUT` | `/api/tasks/{id}` | Actualizar (`?user_id=`) |
| `DELETE` | `/api/tasks/{id}` | Eliminar (`?user_id=`) |

### Notas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/notes` | Crear nota |
| `GET` | `/api/notes` | Listar (`?user_id=`) |
| `GET` | `/api/notes/{id}` | Obtener (`?user_id=`) |
| `PUT` | `/api/notes/{id}` | Actualizar (`?user_id=`) |
| `DELETE` | `/api/notes/{id}` | Eliminar (`?user_id=`) |

---

## Flujo de prueba manual (happy path)

```
1. Iniciar backend     → python -m uvicorn app.main:app --reload --port 8000
2. Iniciar frontend    → ionic serve
3. Abrir              → http://localhost:8100
4. Crear usuario       → ingresar username + email → "Crear y continuar"
5. Dashboard           → 4 tarjetas visibles
6. Chat                → escribir mensaje → respuesta stub de MJÖLNIR
7. Conversaciones      → verificar que aparece la conversación creada
8. Tareas              → crear, marcar como done, eliminar
9. Notas               → crear, verificar contenido, eliminar
10. Logout             → ícono superior derecho → vuelve a user-select
```

---

## Documentación adicional

| Archivo | Contenido |
| --- | --- |
| [docs/current-status.md](docs/current-status.md) | Qué funciona, qué falta, próximos pasos |
| [docs/testing-checklist.md](docs/testing-checklist.md) | Checklist de pruebas manuales |
| [docs/roadmap.md](docs/roadmap.md) | Hoja de ruta del proyecto |
| [docs/architecture.md](docs/architecture.md) | Decisiones de arquitectura |
