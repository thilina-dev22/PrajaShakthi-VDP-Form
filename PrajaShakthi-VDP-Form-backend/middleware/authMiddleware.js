// PrajaShakthi-VDP-Form-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    let token;

    // 1) Try HttpOnly cookie first
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 2) Fallback to Authorization header: Bearer <token>
    if (!token && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (!req.user.isActive) {
                return res.status(403).json({ message: 'Account is deactivated' });
            }

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

// Middleware to restrict access to superadmin only
const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
};

// Middleware to restrict access to superadmin and district admins
const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'superadmin' || req.user.role === 'district_admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

// Middleware to restrict access to district admins and DS users (not superadmin)
const districtAndDSOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'district_admin' || req.user.role === 'ds_user')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied.' });
    }
};

module.exports = { protect, superAdminOnly, adminOnly, districtAndDSOnly };