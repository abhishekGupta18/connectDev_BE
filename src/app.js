const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { validationSignUpData } = require("./utilities/validation");
const bcyrpt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

connectDB()
  .then(() => {
    console.log("DB connection established..");
    app.listen(3000, () => {
      console.log("app is running on server 3000");
    });
  })
  .catch((e) => {
    console.log("DB connection failed.." + e.message);
  });
