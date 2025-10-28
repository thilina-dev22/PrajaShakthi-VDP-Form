// PrajaShakthi-VDP-Form-backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    getUnreadCount
} = require('../controllers/notificationController');

// All notification routes require authentication and super admin role
router.use(protect);
router.use(superAdminOnly);

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in super admin
// @access  Private (Super Admin only)
router.get('/', getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private (Super Admin only)
router.get('/unread-count', getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Private (Super Admin only)
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private (Super Admin only)
router.put('/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a specific notification
// @access  Private (Super Admin only)
router.delete('/:id', deleteNotification);

// @route   DELETE /api/notifications/clear-read
// @desc    Delete all read notifications
// @access  Private (Super Admin only)
router.delete('/clear-read', clearReadNotifications);

module.exports = router;
