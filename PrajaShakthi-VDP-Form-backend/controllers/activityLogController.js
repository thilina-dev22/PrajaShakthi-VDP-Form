// PrajaShakthi-VDP-Form-backend/controllers/activityLogController.js

const ActivityLog = require('../models/ActivityLogModel');
const { logActivity } = require('../utils/activityLogger');
const { getLogsToBeDeleted, getLogsToDeleteCount } = require('../utils/activityLogCleanup');

// @desc   Get activity logs with filtering
// @route  GET /api/activity-logs
// @access Private (Super Admin & District Admin)
const getActivityLogs = async (req, res) => {
    try {
        const user = req.user;
        const { 
            action, 
            district, 
            divisionalSec,
            startDate,
            endDate,
            limit = 100,
            skip = 0
        } = req.query;

        const filter = {};

        // Role-based filtering
        if (user.role === 'district_admin') {
            filter.district = user.district;
        }

        // Additional filters
        if (action) filter.action = action;
        if (district) filter.district = district;
        if (divisionalSec) filter.divisionalSecretariat = divisionalSec;
        
        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        const logs = await ActivityLog.find(filter)
            .populate('user', 'username fullName role')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await ActivityLog.countDocuments(filter);

        res.json({
            logs,
            total,
            hasMore: total > (parseInt(skip) + logs.length)
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
    }
};

// @desc   Get logs that will be deleted in next cleanup
// @route  GET /api/activity-logs/pending-deletion
// @access Private (Super Admin only)
const getPendingDeletionLogs = async (req, res) => {
    try {
        const logs = await getLogsToBeDeleted();
        const count = logs.length;

        res.json({
            count,
            logs: logs.slice(0, 100), // Return first 100 for preview
            message: `${count} logs older than 1 month will be deleted on the last day of this month`
        });
    } catch (error) {
        console.error('Error fetching pending deletion logs:', error);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

// @desc   Export activity logs to JSON
// @route  GET /api/activity-logs/export
// @access Private (Super Admin & District Admin)
const exportActivityLogs = async (req, res) => {
    try {
        const user = req.user;
        const { 
            action, 
            district, 
            divisionalSec,
            startDate,
            endDate,
            includeOldLogs = false
        } = req.query;

        const filter = {};

        // Role-based filtering
        if (user.role === 'district_admin') {
            filter.district = user.district;
        }

        // Additional filters
        if (action) filter.action = action;
        if (district) filter.district = district;
        if (divisionalSec) filter.divisionalSecretariat = divisionalSec;
        
        // Date range or old logs filter
        if (includeOldLogs === 'true') {
            // Export logs older than 1 month (pending deletion)
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filter.createdAt = { $lt: oneMonthAgo };
        } else if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        const logs = await ActivityLog.find(filter)
            .populate('user', 'username fullName role district divisionalSecretariat')
            .sort({ createdAt: -1 })
            .lean();

        // Log the export activity
        await logActivity({
            userId: user._id,
            username: user.username,
            userRole: user.role,
            action: 'EXPORT_DATA',
            details: {
                exportType: 'Activity Logs',
                count: logs.length,
                filters: { action, district, divisionalSec, startDate, endDate, includeOldLogs }
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: user.district,
            divisionalSecretariat: user.divisionalSecretariat
        });

        // Prepare filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `activity-logs-${timestamp}.json`;

        // Prepare export data
        const exportData = {
            exportDate: new Date().toISOString(),
            exportedBy: {
                username: user.username,
                fullName: user.fullName,
                role: user.role
            },
            totalRecords: logs.length,
            filters: filter,
            logs: logs
        };

        // Send as downloadable file with pretty-printed JSON
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(JSON.stringify(exportData, null, 2)); // Pretty print with 2-space indentation
    } catch (error) {
        console.error('Error exporting activity logs:', error);
        res.status(500).json({ message: 'Error exporting logs', error: error.message });
    }
};

// @desc   Get activity log statistics
// @route  GET /api/activity-logs/stats
// @access Private (Super Admin & District Admin)
const getActivityLogStats = async (req, res) => {
    try {
        const user = req.user;
        const filter = {};

        // Role-based filtering
        if (user.role === 'district_admin') {
            filter.district = user.district;
        }

        const totalLogs = await ActivityLog.countDocuments(filter);
        const pendingDeletionCount = await getLogsToDeleteCount();

        // Get logs by action type
        const actionStats = await ActivityLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get logs by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await ActivityLog.aggregate([
            {
                $match: {
                    ...filter,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalLogs,
            pendingDeletionCount,
            actionStats,
            dailyStats: dailyStats.slice(-30) // Last 30 days
        });
    } catch (error) {
        console.error('Error fetching activity log stats:', error);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};

module.exports = {
    getActivityLogs,
    getPendingDeletionLogs,
    exportActivityLogs,
    getActivityLogStats
};
