import mongoose from 'mongoose'
import env from './env'
import logger from './logger'

const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(env.mongoUri)
  logger.info(`MongoDB connected: ${conn.connection.host}`)
}

export default connectDB
