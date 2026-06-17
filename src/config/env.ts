import 'dotenv/config'

export interface Env {
  port: number
  mongoUri: string
  jwtSecret: string
  jwtRefreshSecret: string
  jwtExpiresIn: string
  jwtRefreshExpiresIn: string
  nodeEnv: string
}

const env: Env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  nodeEnv: process.env.NODE_ENV ?? 'development',
}

export default env
