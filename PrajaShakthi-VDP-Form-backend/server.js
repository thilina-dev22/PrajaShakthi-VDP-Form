// PrajaShakthi-VDP-Form-backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const submissionRoutes = require("./routes/submissionRoutes");
const authRoutes = require("./routes/authRoutes");

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
    origin: "http://localhost:5173", // The origin of your frontend app
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow DELETE
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure necessary headers are allowed
  })
);

app.use(express.json());
app.use(cookieParser());

// ⭐ NEW: Custom Request Logging Middleware ⭐
app.use((req, res, next) => {
  console.log("--- Incoming Request ---");
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.originalUrl}`);
  // Log the entire parsed body for POST/PUT/PATCH requests
  if (req.method !== "GET" && req.method !== "DELETE" && req.body) {
    // Log the JSON body, formatted for readability
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  console.log("------------------------");
  next();
});
// ⭐ END Logging Middleware ⭐

// Mount the routers
app.use("/api/submissions", submissionRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
