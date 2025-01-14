const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    attachment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
