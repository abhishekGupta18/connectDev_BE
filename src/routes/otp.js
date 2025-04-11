const express = require("express");
const OTP = require("../models/otp");
const sendEmail = require("../utilities/sendEmail");

const otpRouter = express.Router();

const generateOtp = () => Math.floor(100000 + Math.random() * 90000).toString();

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

module.exports = otpRouter;
