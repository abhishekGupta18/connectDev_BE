const express = require("express");
const bcyrpt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validationEditProfileData } = require("../utilities/validation");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const checkValidData = validationEditProfileData(req);
    if (!checkValidData) {
      throw new Error("send valid data");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.validate(); // validate with schema
    await loggedInUser.save();
    await res.json({
      message: "updation successfull",
      data: loggedInUser,
    });
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});

profileRouter.post("/updatePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    await req.body.password.validate();

    loggedInUser.password = await bcyrpt.hash(req.body.password, 10);

    loggedInUser.save();
    res.send("password updated successfully !!");
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

// profile of any user

profileRouter.get("/profile/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const user = await User.findById({ _id: targetUserId });
    res.send(user);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = profileRouter;
