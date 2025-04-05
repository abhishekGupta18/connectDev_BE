const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Event = require("../models/event");

const eventRouter = express.Router();

eventRouter.post("/add/event", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const {
      eventName,
      description,
      eventStartTime,
      eventEndTime,
      location,
      registrationLink,
      createdAt,
      updatedAt,
    } = req.body;

    const event = new Event({
      userId: user._id,
      eventName,
      description,
      eventStartTime,
      eventEndTime,
      location,
      registrationLink,
      createdAt,
      updatedAt,
    });

    await event.save();
    res.status(200).json({
      msg: "event added successfully",
      data: event,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

eventRouter.get("/events", userAuth, async (req, res) => {
  try {
    const jobs = await Event.find()
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json({
      msg: "events fetched successfully",
      data: jobs,
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = eventRouter;
