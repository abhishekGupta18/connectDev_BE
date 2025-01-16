const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const socketIo = require("socket.io");
const http = require("http");

const app = express();

const server = http.createServer(app); // creating http server

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Socket.IO: Handle connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for a new message
  socket.on("newMessage", (data) => {
    console.log("New message:", data);

    // Emit the message to the recipient
    io.to(data.toUserId).emit("receiveMessage", data); // Replace with actual user ID logic
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

connectDB()
  .then(() => {
    console.log("DB connection established..");
    app.listen(3000, () => {
      console.log("app is running on server 3000");
    });
  })
  .catch((e) => {
    console.log("DB connection failed.." + e.message);
  });
