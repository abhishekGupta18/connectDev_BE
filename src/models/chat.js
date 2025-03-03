const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    message: [messageSchema],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
