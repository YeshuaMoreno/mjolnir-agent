# MJÖLNIR — Arquitectura técnica

---

## Visión general

MJÖLNIR es un asistente personal de uso privado con arquitectura cliente-servidor desacoplada.
El backend expone una API REST. El frontend es una app Ionic/Angular que consume esa API.
En fase futura, el backend delegará la generación de respuestas a un LLM externo.

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│                                                             │
│   Ionic + Angular (SPA)                                     │
│   http://localhost:8100                                     │
│                                                             │
│   pages/          → vistas por funcionalidad                │
│   core/services/  → HTTP wrappers (ApiService)              │
│   core/models/    → interfaces TypeScript                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST (JSON)
                           │ CORS permitido: 4200, 8100, capacitor://
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVIDOR                             │
│                                                             │
│   FastAPI  →  routes/  →  services/  →  models/ (ORM)      │
│   http://localhost:8000/api                                 │
│                                                             │
│   Pydantic schemas: validación I/O en cada endpoint         │
│   SQLAlchemy ORM: mapeo objeto-relacional                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ SQLAlchemy (pymysql)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                          │
│                                                             │
│   MySQL 8                                                   │
│   Tablas: users, conversations, messages, tasks, notes      │
└─────────────────────────────────────────────────────────────┘
                           │ (fase futura)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      LLM EXTERNO                            │
│                                                             │
│   Claude API (Anthropic) — pendiente de integración         │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura del backend

```text
backend/app/
├── main.py          FastAPI app, middleware CORS, registro de routers
├── config.py        Pydantic-settings: carga .env, expone `settings`
├── database.py      SQLAlchemy engine, SessionLocal, Base, get_db()
├── models/
│   ├── user.py
│   ├── conversation.py
│   ├── message.py
│   ├── task.py
│   └── note.py
├── schemas/
│   ├── user.py      UserCreate, UserOut
│   ├── chat.py      ChatRequest, ChatResponse
│   ├── conversation.py  ConversationOut
│   ├── message.py   MessageOut
│   ├── task.py      TaskCreate, TaskUpdate, TaskOut
│   └── note.py      NoteCreate, NoteUpdate, NoteOut
├── routes/
│   ├── health.py    GET /api/health
│   ├── users.py     CRUD /api/users
│   ├── chat.py      POST /api/chat
│   ├── conversations.py  GET /api/conversations[/{id}/messages]
│   ├── tasks.py     CRUD /api/tasks
│   └── notes.py     CRUD /api/notes
├── services/
│   └── chat_service.py  Lógica de chat (stub → LLM en v0.2)
├── agents/          Stub — agentes IA (v0.2+)
└── memory/          Stub — memoria contextual (v0.2+)
```

---

## Estructura del frontend

```text
mobile/src/app/
├── app.module.ts        Módulo raíz — HttpClientModule, IonicModule
├── app-routing.module.ts  Rutas lazy-loaded
├── app.component.ts     Shell con ion-router-outlet
├── core/
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── chat.model.ts
│   │   ├── conversation.model.ts
│   │   ├── message.model.ts
│   │   ├── task.model.ts
│   │   └── note.model.ts
│   └── services/
│       ├── api.service.ts       Base: get/post/put/delete con HttpParams
│       ├── user.service.ts      CRUD usuarios + gestión localStorage
│       ├── chat.service.ts      POST /api/chat
│       ├── conversation.service.ts  GET conversaciones y mensajes
│       ├── task.service.ts      CRUD tareas
│       └── note.service.ts      CRUD notas
└── pages/
    ├── user-select/   Selección o creación de usuario (temporal)
    ├── dashboard/     Hub de navegación
    ├── chat/          Conversación en tiempo de sesión
    ├── conversations/ Historial de conversaciones guardadas
    ├── tasks/         Lista de tareas con checkbox
    └── notes/         Lista de notas con contenido opcional
```

---

## Modelos de datos

### Relaciones

```text
User
 ├── Conversation (1:N)
 │    └── Message (1:N)
 ├── Task (1:N)
 └── Note (1:N)
```

### Tabla `users`

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | INT PK | Auto-increment |
| username | VARCHAR(64) | Único |
| email | VARCHAR(128) | Único |
| created_at | DATETIME | Server default NOW() |
| updated_at | DATETIME | Server default + onupdate |

### Tabla `conversations`

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | INT PK | Auto-increment |
| user_id | INT FK → users | NOT NULL |
| title | VARCHAR(256) | Primeros 50 chars del primer mensaje |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Tabla `messages`

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | INT PK | Auto-increment |
| conversation_id | INT FK → conversations | NOT NULL |
| role | VARCHAR(16) | `"user"` o `"assistant"` |
| content | TEXT | |
| created_at | DATETIME | |

### Tabla `tasks`

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | INT PK | Auto-increment |
| user_id | INT FK → users | NOT NULL |
| title | VARCHAR(256) | NOT NULL |
| description | TEXT | Nullable |
| status | VARCHAR(32) | Default `"pending"` |
| due_date | DATETIME | Nullable |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Tabla `notes`

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | INT PK | Auto-increment |
| user_id | INT FK → users | NOT NULL |
| title | VARCHAR(256) | NOT NULL |
| content | TEXT | Nullable |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

## Flujo de datos — POST /api/chat

```text
Frontend (chat.page.ts)
  │
  │  POST /api/chat
  │  { user_id, message, conversation_id? }
  ▼
routes/chat.py
  │  Inyecta Session DB via Depends(get_db)
  │  Llama a process_chat(db, user_id, message, conversation_id)
  ▼
services/chat_service.py
  │  1. Valida user_id existe → 404 si no
  │  2. Si conversation_id viene → valida existencia (404) y propiedad (403)
  │  3. Si conversation_id es None → crea Conversation(title = message[:50])
  │  4. INSERT Message(role="user", content=message)
  │  5. _generate_stub_reply(message)  ← aquí irá el LLM en v0.2
  │  6. INSERT Message(role="assistant", content=reply)
  │  7. db.commit()
  │  8. return (reply, conversation_id)
  ▼
routes/chat.py
  │  return ChatResponse(reply=reply, conversation_id=conversation_id)
  ▼
Frontend
  │  Muestra respuesta en pantalla
  │  Guarda conversation_id para el siguiente mensaje
```

---

## Flujo de navegación — Frontend

```text
/ (raíz)
  └── redirige a /user-select

/user-select
  └── usuario seleccionado o creado
        └── guarda user_id en localStorage
              └── navega a /dashboard

/dashboard
  ├── /chat          → envía mensajes, persiste en DB
  ├── /conversations → historial de conversaciones + mensajes
  ├── /tasks         → CRUD de tareas
  └── /notes         → CRUD de notas

Cualquier página protegida sin user_id en localStorage
  └── redirige automáticamente a /user-select
```

---

## Decisiones técnicas

| Decisión | Alternativa considerada | Razón elegida |
| --- | --- | --- |
| FastAPI sobre Flask/Django | Flask más simple, Django más completo | FastAPI: async nativo, Pydantic integrado, Swagger automático |
| SQLAlchemy 2.x con `Mapped[]` | SQLAlchemy 1.x legacy style | API más limpia, type hints nativos, sin columnas `Column()` |
| PyMySQL sobre mysqlclient | mysqlclient requiere compilación C | PyMySQL es puro Python, más fácil en Windows |
| Ionic + Angular sobre React Native | React Native más popular | Ionic permite web + APK con el mismo código; Angular es más estructurado |
| NgModule (no standalone components) | Standalone components Angular 17+ | Ionic CLI genera módulos; mantiene consistencia con el scaffolding |
| localStorage para user_id | Cookies / IndexedDB | Suficiente para MVP sin autenticación real |
| Stub mock en chat | Respuesta hardcoded | El stub documenta dónde irá el LLM sin romper el flujo |
| `create_all` sobre Alembic | Alembic desde el inicio | Velocidad en MVP; Alembic se añade en v0.2 antes de producción |
| CORS abierto en development | Proxy Angular | Más simple para móvil + web simultáneamente |

---

## Consideraciones de seguridad (estado actual)

| Punto | Estado | Acción en v0.3 |
| --- | --- | --- |
| Sin autenticación | El `user_id` viene del cliente | Implementar JWT |
| Secretos en `.env` | Correcto — no en código ni Git | Mantener |
| SQL Injection | Cubierto — SQLAlchemy ORM | No aplica |
| CORS restrictivo | Solo orígenes conocidos | Revisar en producción |
| HTTPS | No aplica en localhost | Obligatorio en producción |
