require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const http = require("http");

// Enhanced Logging Middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

app.use(loggingMiddleware);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://connectdev-community.vercel.app",
    ],
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

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", paymentRouter);
// app.use("/", chatRouter);
// app.use("/", aiChatRouter);
// app.use("/", jobsRouter);
// Error-Safe Route Registration
const safeRouteRegistration = (path, router) => {
  try {
    app.use(path, router);
    console.log(`Route ${path} registered successfully`);
  } catch (error) {
    console.error(`Failed to register route ${path}:, error`);
  }
};

safeRouteRegistration("/", authRouter);
safeRouteRegistration("/", profileRouter);
safeRouteRegistration("/", requestRouter);
safeRouteRegistration("/", userRouter);
safeRouteRegistration("/", paymentRouter);
safeRouteRegistration("/", chatRouter);
safeRouteRegistration("/", aiChatRouter);
safeRouteRegistration("/", jobsRouter);

const server = http.createServer(app);

// Comprehensive Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevTinder Backend is Running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
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
