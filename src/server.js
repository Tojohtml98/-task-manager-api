const app = require('./app')
const connectDB = require('./config/db')
const { port } = require('./config/env')

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${port}`)
  connectDB().catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
})