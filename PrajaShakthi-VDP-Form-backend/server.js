// PrajaShakthi-VDP-Form-backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // NEW
const connectDB = require('./config/db');
const submissionRoutes = require('./routes/submissionRoutes');
const authRoutes = require('./routes/authRoutes'); // NEW

dotenv.config();

// Ensure JWT_SECRET is set for security
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined. Please create a .env file.");
    process.exit(1);
}

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Must match the frontend's Vite port
    credentials: true, // IMPORTANT: Allows cookies (HttpOnly JWT) to be sent
}));
app.use(express.json());
app.use(cookieParser()); // NEW: Parse cookies from incoming requests

// Mount the routers
app.use('/api/submissions', submissionRoutes);
app.use('/api/auth', authRoutes); // NEW: Auth routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));