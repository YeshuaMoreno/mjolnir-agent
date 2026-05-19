# MJÖLNIR — Checklist de pruebas manuales

Ejecutar con backend en `http://localhost:8000` y frontend en `http://localhost:8100`.

---

## Backend — Swagger UI (`http://localhost:8000/docs`)

### Health

- [ ] `GET /api/health` → `{ "status": "ok", "service": "mjolnir-backend" }`

---

### Usuarios

- [ ] `POST /api/users` con `{ "username": "test", "email": "test@mail.com" }` → 201, devuelve usuario con `id`
- [ ] `POST /api/users` con el mismo email → 409 "Username o email ya registrado."
- [ ] `GET /api/users` → lista con al menos 1 usuario
- [ ] `GET /api/users/1` → devuelve usuario correcto
- [ ] `GET /api/users/9999` → 404 "Usuario no encontrado."

---

### Chat

- [ ] `POST /api/chat` con `{ "user_id": 1, "message": "Hola" }` → 200, devuelve `reply` y `conversation_id`
- [ ] Repetir con el mismo `conversation_id` devuelto → continúa la misma conversación
- [ ] `POST /api/chat` con `user_id` inexistente → 404
- [ ] `POST /api/chat` con `conversation_id` inexistente → 404
- [ ] `POST /api/chat` con `conversation_id` de otro usuario → 403

---

### Conversaciones y mensajes

- [ ] `GET /api/conversations?user_id=1` → lista conversaciones del usuario
- [ ] `GET /api/conversations?user_id=9999` → 404
- [ ] `GET /api/conversations/1/messages?user_id=1` → lista mensajes ordenados por `created_at` ASC
- [ ] `GET /api/conversations/1/messages?user_id=2` (otra persona) → 403
- [ ] `GET /api/conversations/9999/messages?user_id=1` → 404

---

### Tareas (CRUD completo)

- [ ] `POST /api/tasks` con `{ "user_id": 1, "title": "Revisar PR" }` → 201
- [ ] `POST /api/tasks` con `user_id` inexistente → 404
- [ ] `GET /api/tasks?user_id=1` → lista de tareas
- [ ] `GET /api/tasks?user_id=9999` → 404
- [ ] `GET /api/tasks/1?user_id=1` → tarea correcta
- [ ] `GET /api/tasks/1?user_id=2` (otra persona) → 403
- [ ] `PUT /api/tasks/1?user_id=1` con `{ "status": "done" }` → tarea actualizada
- [ ] `PUT /api/tasks/1?user_id=1` con body vacío `{}` → sin cambios (parcial correcto)
- [ ] `DELETE /api/tasks/1?user_id=1` → 204, sin body
- [ ] `GET /api/tasks/1?user_id=1` después del delete → 404

---

### Notas (CRUD completo)

- [ ] `POST /api/notes` con `{ "user_id": 1, "title": "Ideas" }` → 201
- [ ] `POST /api/notes` con `user_id` inexistente → 404
- [ ] `GET /api/notes?user_id=1` → lista de notas
- [ ] `GET /api/notes?user_id=9999` → 404
- [ ] `GET /api/notes/1?user_id=1` → nota correcta
- [ ] `GET /api/notes/1?user_id=2` (otra persona) → 403
- [ ] `PUT /api/notes/1?user_id=1` con `{ "title": "Ideas revisadas" }` → nota actualizada
- [ ] `DELETE /api/notes/1?user_id=1` → 204, sin body

---

## Frontend — `http://localhost:8100`

### Sin usuario seleccionado (acceso directo por URL)

- [ ] Navegar a `http://localhost:8100/chat` → redirige automáticamente a `/user-select`
- [ ] Navegar a `http://localhost:8100/tasks` → redirige a `/user-select`
- [ ] Navegar a `http://localhost:8100/notes` → redirige a `/user-select`
- [ ] Navegar a `http://localhost:8100/conversations` → redirige a `/user-select`
- [ ] Navegar a `http://localhost:8100/dashboard` → redirige a `/user-select`

---

### User Select (`/user-select`)

- [ ] Lista usuarios existentes del backend
- [ ] Click en usuario existente → guarda en localStorage y redirige a `/dashboard`
- [ ] Crear usuario nuevo con username + email válidos → redirige a `/dashboard`
- [ ] Crear usuario con email ya existente → muestra error en rojo
- [ ] Con backend apagado → muestra "No se pudo conectar con el backend."

---

### Dashboard (`/dashboard`)

- [ ] Muestra 4 tarjetas: Chat, Conversaciones, Tareas, Notas
- [ ] Click en cada tarjeta → navega a la página correcta
- [ ] Botón de logout (ícono superior derecho) → limpia localStorage y vuelve a `/user-select`

---

### Chat (`/chat`)

- [ ] Escribir mensaje y pulsar Enter o botón Enviar → aparece en el chat como "Tú"
- [ ] Respuesta stub de MJÖLNIR aparece a continuación
- [ ] Spinner visible mientras espera respuesta
- [ ] Botón Enviar deshabilitado durante el envío y cuando el input está vacío
- [ ] Con backend apagado → muestra "Error al conectar con MJÖLNIR." en el chat
- [ ] Segunda conversación en la misma sesión reutiliza el mismo `conversation_id`

---

### Conversaciones (`/conversations`)

- [ ] Lista las conversaciones del usuario activo ordenadas por última actualización
- [ ] Click en una conversación → muestra sus mensajes con etiquetas "user" / "assistant"
- [ ] Botón X → vuelve a la lista de conversaciones
- [ ] Sin conversaciones → muestra "No hay conversaciones aún."
- [ ] Con backend apagado → muestra mensaje de error en rojo

---

### Tareas (`/tasks`)

- [ ] Lista tareas del usuario activo
- [ ] Escribir título y pulsar Agregar → tarea aparece al principio de la lista
- [ ] Marcar checkbox → tarea aparece tachada (status "done")
- [ ] Desmarcar checkbox → tarea vuelve a "pending"
- [ ] Botón papelera → tarea desaparece de la lista
- [ ] Con backend apagado → muestra mensaje de error en rojo al cargar

---

### Notas (`/notes`)

- [ ] Lista notas del usuario activo
- [ ] Crear nota con título + contenido opcional → aparece en la lista
- [ ] Botón papelera → nota desaparece
- [ ] Con backend apagado → muestra mensaje de error en rojo al cargar
