const express = require("express");
const OTP = require("../models/otp");
const User = require("../models/user");
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Clean up any verified email record
      await VerifiedEmail.deleteOne({ email });
      return res.status(400).json({ error: "Email already exists" });
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

    // Enhanced HTML email template with better styling
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4f46e5;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
          }
          .content {
            background-color: #f9fafb;
            padding: 30px 20px;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          }
          .otp-container {
            margin: 20px 0;
            text-align: center;
          }
          .otp {
            font-size: 32px;
            letter-spacing: 5px;
            font-weight: bold;
            color: #4f46e5;
            padding: 10px 20px;
            background-color: #eef2ff;
            border-radius: 5px;
            border: 1px dashed #c7d2fe;
          }
          .message {
            text-align: center;
            margin-bottom: 25px;
            font-size: 16px;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-radius: 0 0 5px 5px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .name {
            font-weight: bold;
            color: #4f46e5;
          }
          .warning {
            font-size: 14px;
            color: #b91c1c;
            text-align: center;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ConnectDev Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello <span class="name">${firstName} ${lastName}</span>,</p>
            <p class="message">Thank you for registering with ConnectDev. To verify your email address, please use the OTP below:</p>
            
            <div class="otp-container">
              <span class="otp">${otp}</span>
            </div>
            
            <p>This OTP will expire in <strong>4 minutes</strong>.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            
            <p class="warning">Do not share this OTP with anyone, including ConnectDev support.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ConnectDev. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ email }); // Clean up OTP
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingOtp = await OTP.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Delete any existing verification first
    await VerifiedEmail.deleteOne({ email });

    // Then create a new verification
    await VerifiedEmail.create({ email });

    // Clean up OTP
    await OTP.findByIdAndDelete(existingOtp._id);

    return res.status(200).json({ message: "OTP verified successfully!" });
  } catch (e) {
    console.error("Error verifying OTP:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = otpRouter;
