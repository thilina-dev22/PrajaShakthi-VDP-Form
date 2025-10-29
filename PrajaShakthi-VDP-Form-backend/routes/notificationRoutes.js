// PrajaShakthi-VDP-Form-backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    getUnreadCount
} = require('../controllers/notificationController');

// All notification routes require authentication and admin role (Super Admin or District Admin)
router.use(protect);
router.use(adminOnly);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private (Super Admin & District Admin)
router.get('/unread-count', getUnreadCount);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private (Super Admin & District Admin)
router.put('/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/clear-read
// @desc    Delete all read notifications
// @access  Private (Super Admin & District Admin)
router.delete('/clear-read', clearReadNotifications);

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in admin
// @access  Private (Super Admin & District Admin)
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Private (Super Admin & District Admin)
router.put('/:id/read', markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a specific notification
// @access  Private (Super Admin & District Admin)
router.delete('/:id', deleteNotification);

module.exports = router;
