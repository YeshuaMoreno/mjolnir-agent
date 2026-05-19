# MJÖLNIR — Hoja de ruta

---

## Estado general

```text
v0.1  ████████████████████  Completado
v0.2  ░░░░░░░░░░░░░░░░░░░░  Pendiente
v0.3  ░░░░░░░░░░░░░░░░░░░░  Pendiente
v0.4  ░░░░░░░░░░░░░░░░░░░░  Pendiente
v0.5  ░░░░░░░░░░░░░░░░░░░░  Pendiente
v1.0  ░░░░░░░░░░░░░░░░░░░░  Pendiente
```

---

## v0.1 — Backend MVP + Frontend MVP ✅ Completado

**Objetivo:** Sistema funcional de extremo a extremo sin LLM real.

### Backend

- [x] FastAPI con estructura modular
- [x] Conexión MySQL via SQLAlchemy 2.x
- [x] Modelos: User, Conversation, Message, Task, Note
- [x] Relaciones ORM + timestamps automáticos
- [x] CRUD completo de usuarios
- [x] POST /api/chat con persistencia de conversaciones y mensajes
- [x] Stub mock en `chat_service.py`
- [x] GET /api/conversations + GET /api/conversations/{id}/messages
- [x] CRUD completo de tareas con validación 404/403
- [x] CRUD completo de notas con validación 404/403
- [x] CORS configurado para Angular/Ionic/Capacitor
- [x] Variables de entorno via `.env`
- [x] Swagger UI en `/docs`

### Frontend

- [x] Proyecto Ionic + Angular inicializado
- [x] Servicios Angular: api, user, chat, conversation, task, note
- [x] Modelos TypeScript para todos los recursos
- [x] Selector temporal de usuario (localStorage)
- [x] Dashboard con navegación a 4 secciones
- [x] Chat con envío de mensajes y respuesta stub
- [x] Historial de conversaciones con mensajes
- [x] CRUD de tareas (crear, toggle status, eliminar)
- [x] CRUD de notas (crear, eliminar)
- [x] Redirect guard en páginas protegidas
- [x] Manejo de errores visible con `ion-text color="danger"`
- [x] Build limpio sin errores ni advertencias

### Documentación

- [x] README.md con instrucciones de arranque
- [x] docs/architecture.md
- [x] docs/testing-checklist.md
- [x] docs/current-status.md
- [x] docs/roadmap.md
- [x] docs/backlog.md

---

## v0.2 — Integración LLM real

**Objetivo:** MJÖLNIR responde con inteligencia real usando Claude API.

### Backend — v0.2

- [ ] Agregar `ANTHROPIC_API_KEY` a `.env.example` y `config.py`
- [ ] Actualizar `requirements.txt` con `anthropic` SDK
- [ ] Reemplazar `_generate_stub_reply` en `chat_service.py` con llamada a Claude
- [ ] Alimentar el LLM con historial de mensajes de la conversación activa
- [ ] Implementar prompt base con la personalidad de MJÖLNIR
- [ ] Manejar errores de API (rate limit, timeout, token limit)
- [ ] Implementar migraciones con Alembic (reemplaza `create_all`)

### Frontend — v0.2

- [ ] Indicador de "MJÖLNIR está escribiendo..." durante respuesta LLM
- [ ] Manejo de timeout si el LLM tarda más de X segundos

---

## v0.3 — Autenticación básica

**Objetivo:** Cada usuario accede solo a sus propios datos con credenciales.

### Backend — v0.3

- [ ] Agregar `password_hash` al modelo `User`
- [ ] Endpoint `POST /api/auth/register`
- [ ] Endpoint `POST /api/auth/login` → devuelve JWT
- [ ] Middleware de verificación JWT
- [ ] Reemplazar `user_id` de query params por identidad del token
- [ ] Agregar `python-jose` y `passlib[bcrypt]` a `requirements.txt`

### Frontend — v0.3

- [ ] Reemplazar `UserSelectPage` con pantalla de Login real
- [ ] Guardar JWT en localStorage en lugar de `user_id`
- [ ] `HttpInterceptor` para adjuntar `Authorization: Bearer <token>`
- [ ] Pantalla de registro de cuenta nueva
- [ ] Manejo de token expirado → redirige a login

---

## v0.4 — Voz

**Objetivo:** MJÖLNIR puede escuchar y hablar en la app.

### Frontend — v0.4 (Capacitor)

- [ ] Instalar `@capacitor-community/speech-recognition`
- [ ] Instalar `@capacitor-community/text-to-speech`
- [ ] Botón de micrófono en `chat.page.html`
- [ ] Permiso de micrófono en Android (`AndroidManifest.xml`)
- [ ] Transcripción de voz → texto → enviado como mensaje
- [ ] Respuesta de MJÖLNIR → leída en voz alta

### Backend — v0.4

- [ ] Sin cambios en v0.4 — la voz es solo UI

---

## v0.5 — Integraciones Android / Capacitor

**Objetivo:** MJÖLNIR se integra con el ecosistema Android nativo.

### Android Calendar

- [ ] Instalar `@capacitor-community/calendar` o plugin nativo
- [ ] Endpoint `GET /api/calendar/events` para leer eventos (o local)
- [ ] Mostrar eventos del día en Dashboard
- [ ] MJÖLNIR puede sugerir tareas basadas en el calendario

### WhatsApp / Share

- [ ] `Share API` de Capacitor para compartir notas/respuestas por WhatsApp
- [ ] Botón de compartir en `notes.page.html` y respuestas del chat

### Notificaciones push

- [ ] Instalar `@capacitor/push-notifications`
- [ ] Backend puede enviar recordatorios de tareas con due_date

---

## v1.0 — Beta Play Store

**Objetivo:** App publicable en Google Play Store para uso personal.

### App

- [ ] Diseño visual completo (Tailwind CSS, tema oscuro, iconos MJÖLNIR)
- [ ] Pantalla de onboarding (primera vez)
- [ ] Modo offline básico con Ionic Storage
- [ ] Optimización de rendimiento (lazy loading, caché HTTP)
- [ ] Manejo de errores global con `ErrorHandler` Angular

### Infraestructura

- [ ] Backend desplegado en servidor propio (VPS) o servicio cloud
- [ ] HTTPS obligatorio
- [ ] Variables de entorno en servidor (no en archivos)
- [ ] Backup automático de MySQL

### Play Store

- [ ] Icono de app (512x512) y splash screen
- [ ] Screenshots para la ficha de tienda
- [ ] APK firmado con keystore propio
- [ ] Ficha de Play Store: nombre, descripción, categoría, privacidad
- [ ] Política de privacidad publicada (URL requerida por Google)
- [ ] Cuenta de desarrollador en Google Play Console
- [ ] Publicación en beta cerrada (acceso por invitación)

---

## Criterios de entrada a producción (v1.0)

Antes de publicar, verificar:

- [ ] Autenticación JWT funcionando
- [ ] HTTPS en backend
- [ ] Sin API keys en código ni en el repositorio
- [ ] LLM real respondiendo correctamente
- [ ] Tests manuales completos según `testing-checklist.md`
- [ ] APK probado en al menos un dispositivo Android físico
