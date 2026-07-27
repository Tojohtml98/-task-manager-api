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

## 🔜 Próximo

- [ ] `auth` no tiene `repository` — el service habla directo al model. Es la única inconsistencia de capas que queda. Agregar `auth.repository.ts` para que los 3 módulos sigan el mismo patrón.
- [ ] Validar también `params` y `query`, no solo `body` (un `:projectId` que no es ObjectId hoy llega hasta Mongoose).
- [ ] Rate limiting en `/api/auth/login` y `/register` (`express-rate-limit`) — estándar en cualquier API pública.
- [ ] Logger estructurado (`pino`) en lugar del `console.log` de `app.ts`.
- [ ] CI en GitHub Actions: correr `tsc --noEmit` + `npm test` en cada push.

## 💤 Descartado / no vale el tiempo por ahora

- Documentación OpenAPI/Swagger completa — el README ya lista los endpoints y nadie va a consumir esta API sin leerlo.
- Tests unitarios de services por separado — los de integración ya cubren esos caminos. Duplicar cobertura no agrega señal.
- Migrar a Express 5 — no resuelve ningún problema que tengamos hoy.

---

## Registro

**2026-07-27** — Validación con zod en los 3 módulos. 30 → 41 tests. Hallazgo: el body llegaba crudo al service, así que un `priority` inválido devolvía 500 en vez de 400, y campos como `role` o `owner` mandados por el cliente podían persistirse.
