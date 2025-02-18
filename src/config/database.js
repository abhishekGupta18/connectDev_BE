require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_connection_secret);
};
module.exports = connectDB;
