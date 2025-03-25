require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const http = require("http");

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
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utilities/socket");
const chatRouter = require("./routes/chat");
const aiChatRouter = require("./routes/aiChat");
const jobsRouter = require("./routes/jobs");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/", aiChatRouter);
app.use("/", jobsRouter);

const server = http.createServer(app);

server.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB connection established..");
    server.listen(process.env.PORT, () => {
      console.log(`app is running on server ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.log("DB connection failed.." + e.message);
  });
