const mongoose = require('mongoose')
const { mongoUri } = require('./env')

const connectDB = async () => {
  console.log('MONGODB_URI prefix:', mongoUri ? mongoUri.substring(0, 40) : 'UNDEFINED')
  const conn = await mongoose.connect(mongoUri)
  console.log(`MongoDB connected: ${conn.connection.host}`)
}

module.exports = connectDB