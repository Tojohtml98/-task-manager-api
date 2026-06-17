import jwt, { SignOptions } from 'jsonwebtoken'
import User from './user.model'
import { AppError } from '../../middleware/errorHandler'
import env from '../../config/env'
import { AuthPayload } from '../../types'

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ id: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions)
  const refreshToken = jwt.sign({ id: userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as SignOptions)
  return { accessToken, refreshToken }
}

const register = async ({ name, email, password }: RegisterInput) => {
  const exists = await User.findOne({ email })
  if (exists) throw new AppError('Email already in use', 400)

  const user = await User.create({ name, email, password })
  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role)

  user.refreshToken = refreshToken
  await user.save()

  return { user, accessToken, refreshToken }
}

const login = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email })
  if (!user) throw new AppError('Invalid credentials', 401)

  const valid = await user.comparePassword(password)
  if (!valid) throw new AppError('Invalid credentials', 401)

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role)
  user.refreshToken = refreshToken
  await user.save()

  return { user, accessToken, refreshToken }
}

const refresh = async (token: string) => {
  if (!token) throw new AppError('No refresh token', 401)

  let payload: AuthPayload
  try {
    payload = jwt.verify(token, env.jwtRefreshSecret) as AuthPayload
  } catch {
    throw new AppError('Invalid refresh token', 401)
  }

  const user = await User.findById(payload.id)

  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401)

  const tokens = generateTokens(user._id.toString(), user.role)
  user.refreshToken = tokens.refreshToken
  await user.save()

  return tokens
}

const logout = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}

export default { register, login, refresh, logout }
