const mongoose = require('mongoose');

const dbConnect = () => {
  try {
    mongoose.connect('mongodb://localhost:27017/E_commerce');
    console.log('Connect to MongoDB successful!');
  } catch (error) {
    console.log('Connect to MongoDB failed');
  }
};

module.exports = dbConnect;
