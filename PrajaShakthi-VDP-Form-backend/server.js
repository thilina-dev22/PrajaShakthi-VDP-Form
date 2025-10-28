// PrajaShakthi-VDP-Form-backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const submissionRoutes = require("./routes/submissionRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { Logger } = require('./middleware/loggingMiddleware')

dotenv.config();

// MANDATORY FIX: Enforce JWT_SECRET for security
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined. Please create a .env file and set a secure secret."
  );
  process.exit(1);
}

connectDB();

const app = express();

// CORS setup to allow required methods and specific origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  // Add your production frontend domain(s) below without trailing slash
  "https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app",
  process.env.CORS_ORIGIN, // optional single origin via env
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use(cookieParser());
app.use(Logger); // Custom Request Logging Middleware


// Mount the routers
app.use("/api/submissions", submissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// Simple health check endpoint for uptime and deployment verification
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
