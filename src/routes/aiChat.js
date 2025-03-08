const express = require("express");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiChat = require("../models/aiChat");
const { userAuth } = require("../middlewares/auth");

const aiChatRouter = express.Router();
const genAI = new GoogleGenerativeAI(process.env.Gemini_Api_Secret);

aiChatRouter.post("/ask/ai", userAuth, async (req, res) => {
  try {
    const { question } = req.body;
    const { _id } = req.user;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Use the working model - gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(question);
    const answer = result.response.text();

    // Use userId instead of _id for the database
    await AiChat.create({
      userId: _id,
      question,
      answer,
    });

    return res.json({ answer });
  } catch (e) {
    console.error("Error with Gemini API:", e);
    return res.status(500).json({ error: "Failed to get response from AI" });
  }
});

module.exports = aiChatRouter;
