

const mongoose = require('mongoose');

require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log('Connected to MongoDB server');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the app if connection fails
  }
};

// connectDB(); // ✅ Call the function to connect

module.exports = connectDB;


