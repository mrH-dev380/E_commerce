const mongoose = require('mongoose');

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log('Connect to MongoDB successful!');
  } catch (error) {
    console.log('Connect to MongoDB failed');
  }
};

module.exports = dbConnect;
