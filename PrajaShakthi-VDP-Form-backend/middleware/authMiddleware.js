// PrajaShakthi-VDP-Form-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    let token;

    // JWT is expected to be in the HttpOnly cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.userId).select('-password');
            req.userRole = decoded.role; // Attach role to request
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to restrict access to only 'admin' role
const admin = (req, res, next) => {
    if (req.user && req.userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };