# Taskflow API

> Production-grade REST API for task management — JWT auth with refresh token rotation, layered architecture and 30 integration tests.

[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tests](https://img.shields.io/badge/tests-30%20passing-brightgreen)](#testing)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)](#docker)

### 🚀 Live

| | Link |
|---|---|
| **API** | https://taskflow-api-mti1.onrender.com |
| **Frontend** | https://taskflow-client-nu.vercel.app |
| **Repo (frontend)** | [taskflow-client](https://github.com/Tojohtml98/taskflow-client) |

> ⚠️ Render free tier sleeps after 15 min of inactivity — first request may take ~30s.

### Highlights

- 🔐 **Stateless auth** — access tokens (15m) + refresh token rotation with logout invalidation
- 🧱 **Strict layered architecture** — Route → Controller → Service → Repository → Model. No layer skips another.
- 🧪 **30 integration tests** — auth flows, CRUD, ownership enforcement. In-memory Mongo, no external DB needed.
- 🐳 **Dockerized** — `docker-compose up` and you have API + Mongo running locally.
- ☁️ **Deployed** — Blueprint config (`render.yaml`) ready to redeploy in 1 click.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access token 15m + refresh token 7d)
- **Testing:** Jest + Supertest + mongodb-memory-server
- **Containerization:** Docker + Docker Compose

## Architecture

Requests flow through a strict layered pipeline — no layer skips another:

```
Request → Route → Controller → Service → Repository → Model
```

```
src/
├── config/          # DB connection and env vars
├── middleware/       # JWT authenticate, role authorize, error handler
└── modules/
    ├── auth/         # Register, login, refresh, logout
    ├── projects/     # Project CRUD (model, repository, service, controller, routes)
    └── tasks/        # Task CRUD — nested under projects
```

## Features

- JWT authentication with refresh token rotation
- Token invalidation on logout
- Project CRUD — scoped to the authenticated owner
- Task CRUD — nested under projects with priority, status and due date
- Role-based authorization middleware (`admin` / `user`)
- Global async error handling via `express-async-errors`
- 30 integration tests covering auth, projects and tasks

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create account | ✗ |
| `POST` | `/api/auth/login` | Login | ✗ |
| `POST` | `/api/auth/refresh` | Refresh access token | ✗ |
| `POST` | `/api/auth/logout` | Logout and invalidate token | ✓ |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List user's projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id` | Get project |
| `PATCH` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/:projectId/tasks` | List tasks |
| `POST` | `/api/projects/:projectId/tasks` | Create task |
| `GET` | `/api/projects/:projectId/tasks/:taskId` | Get task |
| `PATCH` | `/api/projects/:projectId/tasks/:taskId` | Update task |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId` | Delete task |

All `/api/projects` routes require a `Bearer` token in the `Authorization` header.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or use Docker)

### Local setup

```bash
# 1. Clone the repo
git clone https://github.com/Tojohtml98/taskflow-api
cd taskflow-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start MongoDB (optional — uses Docker)
docker-compose up mongo -d

# 5. Start the server
npm run dev
```

The API will be available at `http://localhost:3000`.

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

## Testing

Tests use an in-memory MongoDB instance — no external database required.

```bash
npm test
```

```
Test Suites: 3 passed
Tests:       30 passed
  ✓ auth   — register, login, refresh, logout
  ✓ projects — CRUD + ownership enforcement
  ✓ tasks  — CRUD + project access control
```

## Docker

```bash
# Run API + MongoDB
docker-compose up --build

# MongoDB only (for local development)
docker-compose up mongo -d
```

## Frontend

The React frontend for this API lives at [taskflow-client](https://github.com/Tojohtml98/taskflow-client).
