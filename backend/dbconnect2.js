const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://asharma7588:Ayush1234@cluster0.8ysl0ky.mongodb.net/Tax", {
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

module.exports = connectDB;
