// PrajaShakthi-VDP-Form-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getActivityLogs
} = require('../controllers/userController');
const { protect, superAdminOnly, adminOnly } = require('../middleware/authMiddleware');

// User management routes
router.post('/', protect, adminOnly, createUser); // SuperAdmin and DistrictAdmin can create users
router.get('/', protect, adminOnly, getUsers); // SuperAdmin and DistrictAdmin can view users
router.put('/:id', protect, adminOnly, updateUser); // Update user
router.delete('/:id', protect, adminOnly, deleteUser); // Delete user

// Activity logs routes
router.get('/logs', protect, getActivityLogs); // All users can see logs (filtered by role)

module.exports = router;
