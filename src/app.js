require('express-async-errors')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { errorHandler } = require('./middleware/errorHandler')
const { authenticate } = require('./middleware/authenticate')
const authRoutes = require('./modules/auth/auth.routes')
const projectRoutes = require('./modules/projects/project.routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/projects', authenticate, projectRoutes)

app.use(errorHandler)

module.exports = app