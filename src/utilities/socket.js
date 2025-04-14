const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("-"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "https://connectdev-community.vercel.app",
        "http://localhost:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // whenever chat happens it happens in a room and in that room  there are too many participants

      const roomId = getSecretRoomId(userId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text, createdAt }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              message: [],
            });
          }

          chat.message.push({ senderId: userId, text });
          await chat.save();
          io.to(roomId).emit("messageRecevied", { firstName, text, createdAt });
        } catch (e) {
          console.log(e);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
