const express = require("express");
const bcyrpt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { validationSignUpData } = require("../utilities/validation");

const authRouter = express.Router();

// Helper function for consistent cookie settings
const setCookieWithToken = (res, token) => {
  res.cookie("token", token, {
    // No domain specified - let browser handle it based on same-site principle
    path: "/",
    expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    httpOnly: true,
    secure: true, // Always true for cross-site
    sameSite: "none", // Required for cross-site
  });
};

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

    // create token
    const token = await user.getJwtToken();

    // set cookie using helper function
    setCookieWithToken(res, token);

    // For debugging - set a visible cookie
    res.cookie("auth_status", "signed_up", {
      path: "/",
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: false, // Visible in browser
      secure: true,
      sameSite: "none",
    });

    await user.save();
    res.json({
      message: "user added successfully!!",
      data: user,
      token: token, // Send token in response for client-side storage if needed
    });
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

      // set cookie using helper function
      setCookieWithToken(res, token);

      // For debugging - set a visible cookie
      res.cookie("auth_status", "logged_in", {
        path: "/",
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: false, // Visible in browser
        secure: true,
        sameSite: "none",
      });

      res.json({
        message: "Login successful",
        data: user,
        token: token, // Send token in response for client-side storage if needed
      });
    } else {
      throw new Error("wrong credentials");
    }
  } catch (e) {
    res.status(400).send("Login failed " + e.message);
  }
});

// logout api
authRouter.post("/logout", async (req, res) => {
  // Clear the authentication cookie
  res.cookie("token", "", {
    path: "/",
    expires: new Date(0), // Expire immediately
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // Clear the debug cookie too
  res.cookie("auth_status", "", {
    path: "/",
    expires: new Date(0), // Expire immediately
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });

  res.json({
    message: "Logout successful",
  });
});

module.exports = authRouter;
