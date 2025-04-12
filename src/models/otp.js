const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    otp: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
