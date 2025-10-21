// PrajaShakthi-VDP-Form-backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const submissionRoutes = require("./routes/submissionRoutes");
const authRoutes = require("./routes/authRoutes");
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

//CORRECTED CORS setup to allow DELETE method 
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ], // Allow common vite dev ports
    credentials: true,
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
