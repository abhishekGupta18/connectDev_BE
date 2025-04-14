const express = require("express");
const OTP = require("../models/otp");
const sendEmail = require("../utilities/sendEmail");
const VerifiedEmail = require("../models/verifiedEmail");
const { validationSignUpData } = require("../utilities/validation");

const otpRouter = express.Router();

const generateOtp = () => Math.floor(100000 + Math.random() * 90000).toString();

// send-otp api
otpRouter.post("/send-otp", async (req, res) => {
  try {
    validationSignUpData(req);

    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const otp = generateOtp();

    // Upsert the OTP entry
    await OTP.findOneAndUpdate(
      { email },
      {
        otp,
        firstName,
        lastName,
        password,
        createdAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    const html = `
      <h1>ConnectDev Email Verification</h1>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    await sendEmail(email, "ConnectDev Email Verification", html);

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (e) {
    console.error("Failed to send OTP:", e);
    return res.status(400).json({ error: e.message });
  }
});

// verify-otp api

otpRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await OTP.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const alreadyVerified = await VerifiedEmail.findOne({ email });
    if (alreadyVerified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    await VerifiedEmail.create({ email });

    await OTP.findByIdAndDelete(existingOtp._id);

    return res.status(200).json({ message: "OTP verified successfully!" });
  } catch (e) {
    console.error("Error verifying OTP:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = otpRouter;
