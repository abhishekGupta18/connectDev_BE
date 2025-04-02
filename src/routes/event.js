const express = require("express");
const { userAuth } = require("../middlewares/auth");

const eventRouter = express.Router();

eventRouter.post("/add/event", userAuth, async (req, res) => {
  try {
    const user = req.user;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

module.exports = eventRouter;
