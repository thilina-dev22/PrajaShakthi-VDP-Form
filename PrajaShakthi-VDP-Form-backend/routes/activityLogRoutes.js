// PrajaShakthi-VDP-Form-backend/routes/activityLogRoutes.js

const express = require('express');
const router = express.Router();
const {
    getActivityLogs,
    getPendingDeletionLogs,
    exportActivityLogs,
    getActivityLogStats
} = require('../controllers/activityLogController');
const { protect, superAdminOnly, adminOnly } = require('../middleware/authMiddleware');

// All routes require authentication and admin access
router.use(protect);
router.use(adminOnly); // Super Admin & District Admin

// @route   GET /api/activity-logs
// @desc    Get activity logs with filtering
// @access  Super Admin & District Admin
router.get('/', getActivityLogs);

// @route   GET /api/activity-logs/stats
// @desc    Get activity log statistics
// @access  Super Admin & District Admin
router.get('/stats', getActivityLogStats);

// @route   GET /api/activity-logs/pending-deletion
// @desc    Get logs that will be deleted in next cleanup
// @access  Super Admin only
router.get('/pending-deletion', superAdminOnly, getPendingDeletionLogs);

// @route   GET /api/activity-logs/export
// @desc    Export activity logs to JSON
// @access  Super Admin & District Admin
router.get('/export', exportActivityLogs);

module.exports = router;
