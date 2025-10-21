// PrajaShakthi-VDP-Form-backend/controllers/authController.js

const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// Helper to generate JWT and set as HttpOnly cookie (most secure session storage)
const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // For cross-domain cookies (frontend and backend on different domains):
  // - sameSite: "none" allows cross-site cookie sharing
  // - secure: true required when sameSite is "none" (HTTPS only)
  // In local dev with same origin, "lax" works fine
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // "none" for cross-domain in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id, user.role);

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role, // Send role to frontend for display/routing
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(0), // Clear cookie
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// --- Utility route for initial setup (Optional, but useful) ---
// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const user = await User.create({
      username,
      password,
      role: role || "user",
    });

    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Check user authentication status
// @route   GET /api/auth/status
// @access  Private
const checkAuthStatus = (req, res) => {
  // The 'protect' middleware has already run and attached the user to the request.
  // If we reach this point, the user is authenticated.
  const { _id, username, role } = req.user;
  res.status(200).json({ _id, username, role });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthStatus,
};
