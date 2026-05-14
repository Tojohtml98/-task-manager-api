const jwt = require('jsonwebtoken')
const { AppError } = require('./errorHandler')
const { jwtSecret } = require('../config/env')

const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError('No token provided', 401)

  const token = header.split(' ')[1]
  const payload = jwt.verify(token, jwtSecret)
  req.user = payload  // { id, role } disponible en todos los controllers
  next()
}

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new AppError('Forbidden', 403)
  next()
}

module.exports = { authenticate, authorize }