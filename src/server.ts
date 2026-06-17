import app from './app'
import connectDB from './config/db'
import env from './config/env'

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${env.port}`)
  connectDB().catch((err: Error) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
})
