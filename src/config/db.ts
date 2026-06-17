import mongoose from 'mongoose'
import env from './env'

const connectDB = async (): Promise<void> => {
  console.log('MONGODB_URI prefix:', env.mongoUri ? env.mongoUri.substring(0, 40) : 'UNDEFINED')
  const conn = await mongoose.connect(env.mongoUri)
  console.log(`MongoDB connected: ${conn.connection.host}`)
}

export default connectDB
