import app from './app'
import connectDB from './config/db'
import env from './config/env'
import logger from './config/logger'

app.listen(env.port, '0.0.0.0', () => {
  logger.info(`Server running on 0.0.0.0:${env.port}`)
  connectDB().catch((err: Error) => {
    logger.error({ err }, 'MongoDB connection failed')
    process.exit(1)
  })
})
