const express = require("express");
const connectDB = require("./config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("database connection established...");
    app.listen(3000, () => {
      console.log("app is running on port number 3000");
    });
  })
  .catch((e) => {
    console.log("databse connection failed!!", e);
  });
