require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const app = express();

// Fixed CORS options to handle both production and development environments
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://connectdev-community.vercel.app",
      "http://localhost:5173",
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

// Apply middleware in correct order: CORS first, then parsers, then routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const aiChatRouter = require("./routes/aiChat");
const jobsRouter = require("./routes/jobs");
const eventRouter = require("./routes/event");

// Apply routes after middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/", aiChatRouter);
app.use("/", jobsRouter);
app.use("/", eventRouter);

// Comprehensive Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevTinder Backend is Running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
  });
});

// Create server
const server = http.createServer(app);

// Initialize socket
const initializeSocket = require("./utilities/socket");
initializeSocket(server);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("DB connection established..");
    server.listen(process.env.PORT, () => {
      console.log(
        `App is running on port ${process.env.PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });
  })
  .catch((e) => {
    console.log("DB connection failed: " + e.message);
  });
