# Roadmap — TaskFlow API

Estado del proyecto y próximos pasos. Se actualiza al cerrar cada sesión de trabajo.

---

## ✅ Hecho

- Arquitectura en capas estricta: Route → Controller → Service → Repository → Model
- TypeScript strict, sin `any` implícito, `req.user` tipado por declaration merging
- Auth JWT con access token (15m) + rotación de refresh token + invalidación en logout
- CRUD de projects y tasks con control de ownership
- Manejo global de errores async (`express-async-errors` + `errorHandler`)
- Docker + docker-compose (API + Mongo)
- Deploy en Render con `render.yaml`
- **Validación de request body con zod (2026-07-27)** — `validateBody` middleware + un schema por módulo, aplicado en todos los endpoints de escritura. Devuelve `400` con detalle por campo y descarta campos desconocidos (protección contra mass assignment).
- 41 tests de integración (Jest + Supertest + mongodb-memory-server)
- CI en GitHub Actions: typecheck + tests + build en cada push
- **`auth.repository.ts` (2026-08-04)** — `auth` ya sigue el mismo patrón Route → Controller → Service → Repository → Model que `projects` y `tasks`. El service no vuelve a importar el model directo.
- **Validación de `params` (2026-08-04)** — `validateParams` middleware + `objectIdSchema` de zod. Un `:id`/`:projectId`/`:taskId` con formato inválido ahora corta con 400 antes de llegar a Mongoose (antes: `CastError` sin `statusCode` → 500 genérico). No hay `query` params en uso todavía (no hay endpoints con filtros/paginación), así que esa parte del ítem queda para cuando aparezca un caso real.

- **Rate limiting en `/api/auth/login` y `/register` (2026-08-04)** — `authRateLimiter` (`express-rate-limit`, 10 intentos / 15 min por IP) montado antes de `validateBody` en ambas rutas. Se auto-desactiva en `NODE_ENV=test` (si no, los 40+ requests de `auth.test.ts` que comparten IP en supertest empezaban a chocar entre sí con 429). Comportamiento real probado aparte en `rateLimiter.test.ts` forzando `NODE_ENV=production` para ese describe.

## 🔜 Próximo

- [ ] Query params: recién tiene sentido validar cuando se agregue filtrado/paginación real (hoy no hay ningún endpoint que lea `req.query`) (un `:projectId` que no es ObjectId hoy llega hasta Mongoose).
- [ ] Logger estructurado (`pino`) en lugar del `console.log` de `app.ts`.

## 💤 Descartado / no vale el tiempo por ahora

- Documentación OpenAPI/Swagger completa — el README ya lista los endpoints y nadie va a consumir esta API sin leerlo.
- Tests unitarios de services por separado — los de integración ya cubren esos caminos. Duplicar cobertura no agrega señal.
- Migrar a Express 5 — no resuelve ningún problema que tengamos hoy.

---

## Registro

**2026-08-04 (3)** — Rate limiting en `/api/auth/login` y `/register` con `express-rate-limit` (10 intentos / 15 min por IP). `authRateLimiter` va antes de `validateBody` en `auth.routes.ts`. Se desactiva en `NODE_ENV=test` para no romper `auth.test.ts` (comparte IP en supertest); comportamiento real cubierto por `rateLimiter.test.ts` forzando `NODE_ENV=production`. 46/46 tests verdes.

**2026-08-04 (2)** — Validación de `params` con zod (`validateParams` + `objectIdSchema`). Aplicado en las rutas de `projects` y `tasks` que reciben `:id`/`:projectId`/`:taskId`. 3 tests nuevos que prueban el caso puntual (id malformado → 400, no 500). 44/44 tests verdes.

**2026-08-04** — `auth.repository.ts` agregado. El service ya no importa `User` directo: usa `authRepository.{create, findByEmail, findById, updateRefreshToken}`. `register`/`login`/`refresh` dejaron de mutar la instancia de Mongoose y hacer `.save()` a mano — ahora persisten con `findByIdAndUpdate` igual que `projects` y `tasks`. Typecheck limpio, 41/41 tests verdes sin tocarlos (la capa de arriba no cambió de contrato).

**2026-07-27** — Validación con zod en los 3 módulos. 30 → 41 tests. Hallazgo: el body llegaba crudo al service, así que un `priority` inválido devolvía 500 en vez de 400, y campos como `role` o `owner` mandados por el cliente podían persistirse.
