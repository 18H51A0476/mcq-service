const mongoose = require('mongoose');
require('dotenv').config();

async function connectToMongoDB() {
  const mongoURI = process.env.MONGODB_URI; // Replace with your MongoDB URI

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB Database');

    // You can start defining your models and perform database operations here...

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Export the function to be used in other files
module.exports = connectToMongoDB;
