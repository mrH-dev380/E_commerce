const mongoose = require('mongoose')

const dbConnect = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connect to MongoDB successful!')
      })
      .catch((err) => console.error(err))
  } catch (error) {
    console.log('Connect to MongoDB failed')
  }
}

module.exports = dbConnect
