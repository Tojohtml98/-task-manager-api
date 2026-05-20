require('express-async-errors')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { errorHandler } = require('./middleware/errorHandler')
const { authenticate } = require('./middleware/authenticate')
const authRoutes = require('./modules/auth/auth.routes')
const projectRoutes = require('./modules/projects/project.routes')

const app = express()

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => res.json({
  name: 'Taskflow API',
  status: 'live',
  version: '1.0.0',
  frontend: 'https://taskflow-client-nu.vercel.app',
  repository: 'https://github.com/Tojohtml98/taskflow-api',
  endpoints: {
    health: 'GET /health',
    auth: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout'
    },
    projects: 'GET|POST|PUT|DELETE /api/projects (Bearer token required)'
  }
}))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', authenticate, projectRoutes)

app.use(errorHandler)

module.exports = app