const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishekg12703:lfKPAYfhxGaXdjbk@cluster0.urnqx.mongodb.net/devTinder"
  );
};
module.exports = connectDB;

// "mongodb+srv://abhishekg12703:lfKPAYfhxGaXdjbk@cluster0.urnqx.mongodb.net/"
