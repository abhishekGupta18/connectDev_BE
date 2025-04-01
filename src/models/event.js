const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      minLength: 4,
    },
    description: {
      type: String,
      required: true,
    },
    eventStartTime: {
      type: Date,
      required: true,
    },
    eventEndTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
    },
    registrationLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
