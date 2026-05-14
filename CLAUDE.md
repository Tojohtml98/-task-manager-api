# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm test             # Run all tests (sequential, --runInBand)
```

Run a single test file:
```bash
npx jest src/modules/auth/__tests__/auth.test.js
npx jest src/modules/projects/__tests__/projects.test.js
npx jest src/modules/tasks/__tests__/tasks.test.js
```

## Environment

Copy `.env.example` to `.env`. Required variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`. `CORS_ORIGIN` defaults to `*` — restrict in production.

## Architecture

Strict 4-layer module pattern: **routes → controller → service → repository → model**. No layer skips another.

```
src/
  app.js                   # Express setup, middleware stack, route mounting
  server.js                # MongoDB connect + server listen
  config/env.js            # Centralised env var exports (all modules import from here)
  middleware/
    authenticate.js        # JWT verification → sets req.user = { id, role }
    errorHandler.js        # AppError class + global error handler
  modules/
    auth/                  # register, login, refresh, logout (no repository — service calls model directly)
    projects/              # Full 4-layer CRUD, owner-scoped
    tasks/                 # Full 4-layer CRUD, nested under projects
  tests/
    setup.js               # MongoMemoryServer lifecycle (beforeAll / afterAll / afterEach clear)
    helpers.js             # registerUser, createProject, createTask utilities
```

**Route nesting:** Tasks are mounted inside `project.routes.js` as `router.use('/:projectId/tasks', taskRoutes)` with `mergeParams: true`, so `req.params.projectId` is available in task controllers.

**Ownership enforcement:** Services own authorization, not controllers. `project.service.js` uses `assertOwner(project, userId)`; `task.service.js` calls `assertProjectAccess(userId, projectId)` (verifies parent project ownership) before every task operation.

**Error handling:** `express-async-errors` patches Express so async throws reach the global handler automatically. Always throw `new AppError(message, statusCode)` — never use `res.status()` directly for errors.

**Auth flow:** Short-lived access tokens (`JWT_SECRET`) + long-lived refresh tokens stored in `User.refreshToken`. `POST /api/auth/refresh` rotates both tokens; `POST /api/auth/logout` sets `refreshToken: null`. The `User.toJSON()` method strips `password` and `refreshToken` from all responses.

**Mongoose 9:** `pre('save')` hooks must be `async function()` with **no `next` parameter** — calling `next()` in Mongoose 9 async hooks causes errors.

## API Surface

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/refresh` | — |
| POST | `/api/auth/logout` | Bearer |
| GET / POST | `/api/projects` | Bearer |
| GET / PATCH / DELETE | `/api/projects/:id` | Bearer |
| GET / POST | `/api/projects/:projectId/tasks` | Bearer |
| GET / PATCH / DELETE | `/api/projects/:projectId/tasks/:taskId` | Bearer |
| GET | `/health` | — |

## Testing

Tests use `mongodb-memory-server` — no external MongoDB needed. `src/tests/setup.js` clears all collections `afterEach` for isolation. All 35 tests are integration tests hitting the full Express app via Supertest; there are no unit tests.
