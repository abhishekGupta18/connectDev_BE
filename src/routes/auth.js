const express = require("express");
const bcyrpt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { validationSignUpData } = require("../utilities/validation");

const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("write a valid emailid");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("wrong credentials");
    }

    const checkPassword = await user.validatePassword(password);

    if (checkPassword) {
      // create token

      const token = await user.getJwtToken();

      // set cookie

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("login successfully");
    } else {
      throw new Error("wrong credentials");
    }
  } catch (e) {
    res.status(400).send("Login failed " + e.message);
  }
});

// logout api

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.send("logout successfully");
});

module.exports = authRouter;
