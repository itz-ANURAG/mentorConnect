const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables from .env file

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect('mongodb+srv://anuraggolu123:U3MV4ghuIW9gmOQK@cluster0.my5qu.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
