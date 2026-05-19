# MJÖLNIR — Backlog

---

## Épicas

| ID | Épica | Versión objetivo |
| --- | --- | --- |
| E1 | Integración LLM real | v0.2 |
| E2 | Migraciones de base de datos | v0.2 |
| E3 | Autenticación de usuarios | v0.3 |
| E4 | Entrada y salida de voz | v0.4 |
| E5 | Integraciones Android nativas | v0.5 |
| E6 | Publicación en Play Store | v1.0 |

---

## Historias de usuario

### E1 — Integración LLM real

| ID | Historia |
| --- | --- |
| US-01 | Como usuario, quiero que MJÖLNIR me responda con inteligencia real, no con un stub. |
| US-02 | Como usuario, quiero que MJÖLNIR recuerde el contexto de la conversación activa. |
| US-03 | Como usuario, quiero ver un indicador "MJÖLNIR está escribiendo…" mientras espero la respuesta. |
| US-04 | Como usuario, quiero que si el LLM tarda demasiado, la app me informe en lugar de quedarse colgada. |

### E2 — Migraciones de base de datos

| ID | Historia |
| --- | --- |
| US-05 | Como desarrollador, quiero gestionar cambios de esquema con historial de migraciones para no perder datos en producción. |

### E3 — Autenticación de usuarios

| ID | Historia |
| --- | --- |
| US-06 | Como usuario, quiero registrarme con usuario y contraseña para tener una cuenta propia. |
| US-07 | Como usuario, quiero iniciar sesión y recibir un token que me identifique en todas las peticiones. |
| US-08 | Como usuario, quiero que mis datos (tareas, notas, conversaciones) sean solo accesibles por mí. |
| US-09 | Como usuario, quiero que al expirar mi sesión la app me redirija al login automáticamente. |

### E4 — Entrada y salida de voz

| ID | Historia |
| --- | --- |
| US-10 | Como usuario, quiero hablarle a MJÖLNIR en lugar de escribir. |
| US-11 | Como usuario, quiero que MJÖLNIR me responda en voz alta. |

### E5 — Integraciones Android nativas

| ID | Historia |
| --- | --- |
| US-12 | Como usuario, quiero ver mis eventos del calendario del día en el Dashboard. |
| US-13 | Como usuario, quiero compartir notas o respuestas de MJÖLNIR por WhatsApp. |
| US-14 | Como usuario, quiero recibir notificaciones push cuando una tarea está próxima a vencer. |

### E6 — Publicación en Play Store

| ID | Historia |
| --- | --- |
| US-15 | Como usuario, quiero instalar MJÖLNIR desde Google Play Store. |
| US-16 | Como usuario, quiero una pantalla de onboarding la primera vez que abro la app. |
| US-17 | Como usuario, quiero poder usar funciones básicas sin conexión a internet. |

---

## Tareas técnicas pendientes

### Backend

| ID | Tarea | Épica | Prioridad |
| --- | --- | --- | --- |
| T-01 | Agregar `ANTHROPIC_API_KEY` a `.env.example` y `config.py` | E1 | Alta |
| T-02 | Añadir `anthropic` SDK a `requirements.txt` | E1 | Alta |
| T-03 | Reemplazar `_generate_stub_reply` en `chat_service.py` con llamada real a Claude | E1 | Alta |
| T-04 | Alimentar al LLM con historial completo de mensajes de la conversación | E1 | Alta |
| T-05 | Implementar prompt base con la personalidad de MJÖLNIR | E1 | Alta |
| T-06 | Manejar errores de Claude API (rate limit, timeout, token limit) | E1 | Alta |
| T-07 | Inicializar Alembic (`alembic init alembic`) | E2 | Alta |
| T-08 | Crear migración inicial (`alembic revision --autogenerate -m "initial schema"`) | E2 | Alta |
| T-09 | Reemplazar `Base.metadata.create_all` por `alembic upgrade head` en arranque | E2 | Alta |
| T-10 | Agregar campo `password_hash` al modelo `User` | E3 | Media |
| T-11 | Crear endpoint `POST /api/auth/register` | E3 | Media |
| T-12 | Crear endpoint `POST /api/auth/login` que devuelva JWT | E3 | Media |
| T-13 | Implementar middleware de verificación JWT | E3 | Media |
| T-14 | Reemplazar `user_id` de query params por identidad extraída del token | E3 | Media |
| T-15 | Agregar `python-jose` y `passlib[bcrypt]` a `requirements.txt` | E3 | Media |
| T-16 | Endpoint `GET /api/calendar/events` (integración Capacitor Calendar) | E5 | Baja |
| T-17 | Backend puede enviar recordatorios push de tareas con `due_date` | E5 | Baja |

### Frontend

| ID | Tarea | Épica | Prioridad |
| --- | --- | --- | --- |
| T-18 | Indicador "MJÖLNIR está escribiendo…" con spinner durante espera LLM | E1 | Alta |
| T-19 | Manejo de timeout si el LLM tarda más de N segundos | E1 | Alta |
| T-20 | Reemplazar `UserSelectPage` con pantalla de Login real | E3 | Media |
| T-21 | Guardar JWT en localStorage en lugar de `user_id` directo | E3 | Media |
| T-22 | `HttpInterceptor` para adjuntar `Authorization: Bearer <token>` | E3 | Media |
| T-23 | Pantalla de registro de cuenta nueva | E3 | Media |
| T-24 | Redirigir a login cuando el token haya expirado | E3 | Media |
| T-25 | Instalar `@capacitor-community/speech-recognition` | E4 | Baja |
| T-26 | Instalar `@capacitor-community/text-to-speech` | E4 | Baja |
| T-27 | Botón de micrófono en `chat.page.html` | E4 | Baja |
| T-28 | Permiso de micrófono en `AndroidManifest.xml` | E4 | Baja |
| T-29 | Transcripción de voz → texto → enviado como mensaje | E4 | Baja |
| T-30 | Respuesta de MJÖLNIR leída en voz alta con TTS | E4 | Baja |
| T-31 | Mostrar eventos del día en Dashboard (Capacitor Calendar) | E5 | Baja |
| T-32 | Botón compartir en `notes.page.html` (Capacitor Share) | E5 | Baja |
| T-33 | Instalar `@capacitor/push-notifications` | E5 | Baja |
| T-34 | Modo offline básico con Ionic Storage | E6 | Baja |
| T-35 | Diseño visual completo (tema oscuro, iconos, tipografía MJÖLNIR) | E6 | Baja |
| T-36 | Pantalla de onboarding (primera apertura de la app) | E6 | Baja |
| T-37 | Icono 512×512 y splash screen | E6 | Baja |
| T-38 | APK firmado con keystore propio | E6 | Baja |
| T-39 | Formulario de edición de tareas (título, descripción, fecha) — llama a `PUT /api/tasks/{id}` | — | Media |
| T-40 | Formulario de edición de notas (título, contenido) — llama a `PUT /api/notes/{id}` | — | Media |

---

## Bugs conocidos

| ID | Descripción | Severidad | Estado |
| --- | --- | --- | --- |
| B-01 | No hay protección contra `user_id` falso en el body del chat — cualquiera puede enviar mensajes como otro usuario | Alta | Abierto — se resuelve en E3 con JWT |
| B-02 | `GET /api/conversations` no tiene UI para el estado vacío — si el usuario no tiene conversaciones, el backend devuelve `[]` correctamente pero el frontend no muestra mensaje informativo | Baja | Abierto |
| B-03 | El título de la conversación se trunca a 50 chars del primer mensaje pero no se actualiza si el primer mensaje era muy corto | Baja | Abierto |
| B-04 | En la página de Chat, si el backend devuelve error 500, el mensaje de error genérico no da contexto al usuario | Baja | Abierto |
| B-05 | `PUT /api/notes/{id}` y `PUT /api/tasks/{id}` no tienen UI de edición en el frontend — el backend está listo pero no se usa | Baja | Abierto |

---

## Deuda técnica

| ID | Descripción | Impacto | Acción recomendada |
| --- | --- | --- | --- |
| DT-01 | `Base.metadata.create_all` no tiene historial de cambios de esquema | Alto — riesgo en producción | Migrar a Alembic (T-07, T-08, T-09) |
| DT-02 | Sin autenticación real — `user_id` viene del cliente sin verificar | Alto — vulnerabilidad de seguridad | Implementar JWT en v0.3 (E3) |
| DT-03 | Sin tests automatizados en backend (pytest) | Medio — regresiones difíciles de detectar | Agregar tests de integración con base de datos real |
| DT-04 | Sin tests automatizados en frontend (Karma/Jasmine) | Medio — specs generados pero vacíos | Implementar tests de servicio Angular |
| DT-05 | Stub mock en `chat_service.py` — respuesta hardcodeada | Medio — MVP sin utilidad real | Conectar Claude API en v0.2 (T-01 a T-06) |
| DT-06 | CORS configurado para orígenes de desarrollo; revisar orígenes permitidos antes de producción | Bajo en dev, alto en producción | Actualizar lista de orígenes permitidos al desplegar |
| DT-07 | `update` de notas y tareas no tiene UI en el frontend | Bajo — funcionalidad incompleta | Ver T-39 y T-40 |
| DT-08 | `user_id` hardcodeado en localStorage como entero sin expiración | Bajo en MVP | Reemplazar con JWT firmado en v0.3 |
| DT-09 | No hay paginación en listados de tareas, notas ni conversaciones | Bajo para datos pequeños | Agregar `skip`/`limit` query params antes de v1.0 |
| DT-10 | Sin rate limiting en la API FastAPI | Bajo en localhost, alto en producción | Implementar con `slowapi` antes del despliegue |
