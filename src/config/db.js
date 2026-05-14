const mongoose = require('mongoose')
const { mongoUri } = require('./env')

const connectDB = async () => {
  const conn = await mongoose.connect(mongoUri)
  console.log(`MongoDB connected: ${conn.connection.host}`)
}

module.exports = connectDB