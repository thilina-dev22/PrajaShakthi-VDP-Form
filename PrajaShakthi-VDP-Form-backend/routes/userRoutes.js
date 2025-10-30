// PrajaShakthi-VDP-Form-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getActivityLogs,
    changeOwnPassword,
    getUsersUnderAuthority,
    updateSubordinatePassword
} = require('../controllers/userController');
const { protect, superAdminOnly, adminOnly } = require('../middleware/authMiddleware');

// Password management routes (before parameterized routes)
router.put('/change-password', protect, changeOwnPassword); // All users can change own password
router.get('/subordinates', protect, adminOnly, getUsersUnderAuthority); // Admins view subordinates
router.put('/:id/reset-password', protect, adminOnly, updateSubordinatePassword); // Admins reset subordinate password

// User management routes
router.post('/', protect, adminOnly, createUser); // SuperAdmin and DistrictAdmin can create users
router.get('/', protect, adminOnly, getUsers); // SuperAdmin and DistrictAdmin can view users
router.put('/:id', protect, adminOnly, updateUser); // Update user
router.delete('/:id', protect, adminOnly, deleteUser); // Delete user

// Activity logs routes
router.get('/logs', protect, getActivityLogs); // All users can see logs (filtered by role)

module.exports = router;
