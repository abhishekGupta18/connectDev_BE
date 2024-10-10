const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = profileRouter;
