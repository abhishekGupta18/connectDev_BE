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

// signup api
app.post("/signup", async (req, res) => {
  try {
    // validating user data
    validationSignUpData(req);

    const { firstName, lastName, password, email, gender } = req.body;
    // encrypt password

    const enryptedPassword = await bcyrpt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      password: enryptedPassword,
      email,
      gender,
    });

    await user.save();
    res.send("data is successfully added");
  } catch (e) {
    res.status(400).send("data is not added" + e.message);
  }
});

// login api

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("write a valid emailid");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("wrong credentials");
    }

    const checkPassword = await bcyrpt.compare(password, user.password);

    if (checkPassword) {
      // create token

      const token = await jwt.sign({ _id: user._id }, "abhi12703");

      // set cookie

      res.cookie("token", token);

      res.send("login successfully");
    } else {
      throw new Error("wrong credentials");
    }
  } catch (e) {
    res.status(400).send("Login failed " + e.message);
  }
});

// profile api

app.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

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
