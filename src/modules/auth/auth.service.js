const jwt = require('jsonwebtoken')
const User = require('./user.model')
const { AppError } = require('../../middleware/errorHandler')
const { jwtSecret, jwtRefreshSecret, jwtExpiresIn, jwtRefreshExpiresIn } = require('../../config/env')

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: jwtExpiresIn })
  const refreshToken = jwt.sign({ id: userId }, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn })
  return { accessToken, refreshToken }
}

const register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email })
  if (exists) throw new AppError('Email already in use', 400)

  const user = await User.create({ name, email, password })
  const { accessToken, refreshToken } = generateTokens(user._id, user.role)

  user.refreshToken = refreshToken
  await user.save()

  return { user, accessToken, refreshToken }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throw new AppError('Invalid credentials', 401)

  const valid = await user.comparePassword(password)
  if (!valid) throw new AppError('Invalid credentials', 401)

  const { accessToken, refreshToken } = generateTokens(user._id, user.role)
  user.refreshToken = refreshToken
  await user.save()

  return { user, accessToken, refreshToken }
}

const refresh = async (token) => {
  if (!token) throw new AppError('No refresh token', 401)

  let payload
  try {
    payload = jwt.verify(token, jwtRefreshSecret)
  } catch {
    throw new AppError('Invalid refresh token', 401)
  }

  const user = await User.findById(payload.id)

  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401)

  const tokens = generateTokens(user._id, user.role)
  user.refreshToken = tokens.refreshToken
  await user.save()

  return tokens
}

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}

module.exports = { register, login, refresh, logout }