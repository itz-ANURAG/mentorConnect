const mongoose = require('mongoose');
require('dotenv').config(); 

// Function to connect to the MongoDB database using Mongoose.
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the provided URI.
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Handle connection errors by logging the error message.
    console.error(`Error: ${error.message}`);

    process.exit(1);
  }
};

module.exports = connectDB;
