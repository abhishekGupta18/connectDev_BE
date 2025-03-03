const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "message.senderId", select: "firstName lastName" });

    if (!chat) {
      chat = new Chat({ participants: [userId, targetUserId], message: [] });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

module.exports = chatRouter;
