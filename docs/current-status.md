# MJÖLNIR — Estado actual del proyecto

Última actualización: 2026-05-19

---

## Qué ya funciona

### Backend (FastAPI + MySQL)

| Módulo | Estado |
| --- | --- |
| `GET /api/health` | Funcional |
| CRUD completo de usuarios | Funcional — validación 404/409 |
| `POST /api/chat` | Funcional — stub mock, persiste conversación y mensajes en MySQL |
| `GET /api/conversations` | Funcional — filtra por `user_id`, validación 404 |
| `GET /api/conversations/{id}/messages` | Funcional — validación 404/403 |
| CRUD completo de tareas | Funcional — validación 404/403 en todas las operaciones |
| CRUD completo de notas | Funcional — validación 404/403 en todas las operaciones |
| Modelos SQLAlchemy con relaciones | Funcional — User → Conversation → Message, User → Task, User → Note |
| Timestamps `created_at` / `updated_at` | Funcional en todos los modelos |
| CORS configurado | Funcional — permite Angular (4200), Ionic (8100), Capacitor |
| Variables de entorno via `.env` | Funcional — sin secretos en código |
| Swagger UI | Disponible en `http://localhost:8000/docs` |

### Frontend (Ionic + Angular)

| Módulo | Estado |
| --- | --- |
| Selector temporal de usuario | Funcional — crea o selecciona usuario, guarda en localStorage |
| Dashboard con navegación | Funcional — 4 tarjetas de acceso rápido |
| Chat con historial en sesión | Funcional — envía mensajes, muestra respuesta stub |
| Listado de conversaciones | Funcional — lista y abre historial de mensajes |
| CRUD de tareas | Funcional — crear, marcar done/pending, eliminar |
| CRUD de notas | Funcional — crear con contenido opcional, eliminar |
| Redirect guard (sin usuario) | Funcional — redirige a `/user-select` en las 5 páginas protegidas |
| Manejo de errores visible | Funcional — `ion-text color="danger"` en Chat, Tasks, Notes, Conversations |
| Servicios con convención Angular | Correcto — archivos `*.service.ts`, clases `*Service` |
| Build de desarrollo | Compila sin errores ni advertencias |

---

## Qué falta (no implementado)

### Crítico para MVP funcional completo

| Item | Descripción |
| --- | --- |
| Integración LLM real | `chat_service.py` devuelve stub. Falta conectar Claude/OpenAI |
| Autenticación | No hay JWT ni sesión real. El `user_id` viene del cliente sin verificar |
| Alembic migrations | Las tablas se crean con `create_all` sin historial de migraciones |

### Funcionalidad futura (roadmap)

| Item | Descripción |
| --- | --- |
| Voz | Entrada/salida de audio en la app |
| Android Calendar | Integración vía Capacitor |
| WhatsApp | Integración vía intents/share |
| Notificaciones push | Capacitor Push Notifications |
| Modo offline | Caché local con Ionic Storage |
| Publicación Play Store | Firma APK, ficha de tienda, iconos |
| Diseño visual avanzado | Tailwind CSS, tema oscuro, brand MJÖLNIR |

### Deuda técnica menor

| Item | Descripción |
| --- | --- |
| `home/` generada por Ionic | Eliminada en limpieza v1 — ya no aplica |
| Tests unitarios backend | No hay tests (pytest). Cubierto manualmente con Swagger |
| Tests unitarios frontend | Spec files generados por Ionic, sin implementar |
| `user_id` hardcodeado en frontend | Temporal hasta tener autenticación real |
| Update de nota en frontend | `PUT /api/notes/{id}` existe en el backend, no tiene UI aún |
| Update de tarea en frontend | Solo `status` via checkbox. Sin formulario de edición completo |

---

## Próximos pasos recomendados

### Paso 1 — Integración LLM (Claude API)

Modificar `backend/app/services/chat_service.py`:
- Conectar con Claude via Anthropic SDK
- Usar `APP_SECRET_KEY` / variable nueva `ANTHROPIC_API_KEY` en `.env`
- Alimentar con historial de mensajes previos de la conversación activa

### Paso 2 — Migraciones Alembic

```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

Reemplaza `Base.metadata.create_all` en `main.py`.

### Paso 3 — Autenticación básica

- Agregar campo `password_hash` a `User`
- Endpoint `POST /api/auth/login` → devuelve JWT
- Guardar token en localStorage (reemplaza `user_id` directo)
- `HttpInterceptor` en Angular para adjuntar `Authorization: Bearer <token>`

### Paso 4 — UI de edición en Tasks y Notes

- Formulario modal o inline para editar título/descripción/contenido
- Llama a `PUT /api/tasks/{id}` y `PUT /api/notes/{id}` ya disponibles

### Paso 5 — Voz (Capacitor)

- `@capacitor-community/speech-recognition` para entrada
- `@capacitor-community/text-to-speech` para salida MJÖLNIR
- Botón de micrófono en `chat.page.html`

---

## Decisiones de arquitectura tomadas

| Decisión | Razón |
| --- | --- |
| Sin autenticación en MVP | Velocidad de desarrollo. El backend ya valida 403/404 por `user_id` |
| Stub mock en chat | Permite probar el flujo completo sin API key ni costos |
| `standalone: false` en componentes | Compatibilidad con módulos NgModule generados por Ionic CLI en Angular 17+ |
| `python -m uvicorn` en lugar de `uvicorn` directo | Garantiza uso del entorno virtual activo |
| Servicios en `core/services/` no en raíz de app | Separa lógica transversal de lógica de página |
