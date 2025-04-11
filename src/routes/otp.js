const express = require("express");
const OTP = require("../models/otp");
const sendEmail = require("../utilities/sendEmail");
const VerifiedEmail = require("../models/verifiedEmail");

const otpRouter = express.Router();

const generateOtp = () => Math.floor(100000 + Math.random() * 90000).toString();

// send-otp api
otpRouter.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) res.status(400).json({ error: "email is required" });

    const otp = generateOtp();

    await OTP.create({ email, otp });

    const html = `
      <h1>ConnectDev Email Verification</h1>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    await sendEmail(email, "connectdev email verification", html);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (e) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// verify-otp api

// take eamil and otp, check for existing otp, save email to verified email, deleteotp,

otpRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await OTP.findOne({ email, otp });

    if (!existingOtp)
      res.status(400).json({ error: "Invalid or expired OTP." });

    await VerifiedEmail.create({ email });

    await OTP.findByIdAndDelete({ _id: existingOtp._id });

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (e) {
    console.error("Error verifying OTP:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = otpRouter;
