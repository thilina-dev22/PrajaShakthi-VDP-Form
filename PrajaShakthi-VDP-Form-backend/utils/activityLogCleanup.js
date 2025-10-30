// PrajaShakthi-VDP-Form-backend/utils/activityLogCleanup.js

const cron = require('node-cron');
const ActivityLog = require('../models/ActivityLogModel');
const User = require('../models/UserModel');
const { notifySuperAdmins } = require('./notificationHelper');

/**
 * Get logs that will be deleted in the next cleanup
 * (logs older than 1 month from now)
 */
const getLogsToBeDeleted = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        const logsToDelete = await ActivityLog.find({
            createdAt: { $lt: oneMonthAgo }
        }).sort({ createdAt: 1 });

        return logsToDelete;
    } catch (error) {
        console.error('Error fetching logs to be deleted:', error);
        return [];
    }
};

/**
 * Get count of logs to be deleted
 */
const getLogsToDeleteCount = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        const count = await ActivityLog.countDocuments({
            createdAt: { $lt: oneMonthAgo }
        });

        return count;
    } catch (error) {
        console.error('Error counting logs to be deleted:', error);
        return 0;
    }
};

/**
 * Delete activity logs older than 1 month
 */
const deleteOldActivityLogs = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        const result = await ActivityLog.deleteMany({
            createdAt: { $lt: oneMonthAgo }
        });

        console.log(`🗑️  [CLEANUP] Deleted ${result.deletedCount} activity logs older than ${oneMonthAgo.toLocaleDateString()}`);

        // Notify super admins about the deletion
        if (result.deletedCount > 0) {
            await notifySuperAdmins(
                'SYSTEM_CLEANUP',
                {
                    details: {
                        count: result.deletedCount,
                        cutoffDate: oneMonthAgo.toLocaleDateString(),
                        cleanupType: 'Activity Logs'
                    }
                },
                null,
                'low',
                'system'
            );
        }

        return result.deletedCount;
    } catch (error) {
        console.error('Error deleting old activity logs:', error);
        return 0;
    }
};

/**
 * Notify users 3 days before deletion (27th of each month)
 */
const notifyUpcomingLogDeletion = async () => {
    try {
        const count = await getLogsToDeleteCount();

        if (count === 0) {
            console.log('📊 [LOG CLEANUP] No logs to be deleted in the upcoming cleanup.');
            return;
        }

        const deletionDate = getNextLastDayOfMonth();
        
        await notifySuperAdmins(
            'LOG_DELETION_REMINDER',
            {
                details: {
                    count: count,
                    deletionDate: deletionDate.toLocaleDateString(),
                    daysRemaining: 3,
                    message: 'Activity logs older than 1 month will be deleted. Download them before deletion if needed.'
                }
            },
            null,
            'medium',
            'system'
        );

        console.log(`📢 [LOG CLEANUP] Notified admins: ${count} logs will be deleted on ${deletionDate.toLocaleDateString()}`);
    } catch (error) {
        console.error('Error notifying upcoming log deletion:', error);
    }
};

/**
 * Helper: Get the last day of current month
 */
const getNextLastDayOfMonth = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay;
};

/**
 * Initialize scheduled tasks for activity log cleanup
 */
const initializeLogCleanupScheduler = () => {
    console.log('📅 Initializing activity log cleanup scheduler...');

    // Reminder notification - 27th of every month at 9:00 AM
    cron.schedule('0 9 27 * *', () => {
        console.log('🔔 Running log deletion reminder task (27th of month)...');
        notifyUpcomingLogDeletion();
    });

    // Auto-deletion - Last day of every month at 11:59 PM
    cron.schedule('59 23 28-31 * *', () => {
        // Check if tomorrow is the 1st (meaning today is the last day)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (tomorrow.getDate() === 1) {
            console.log('🔔 Running auto-deletion of old activity logs (last day of month)...');
            deleteOldActivityLogs();
        }
    });

    console.log('✅ Activity log cleanup scheduler initialized');
    console.log('📋 Scheduled tasks:');
    console.log('  - Deletion reminder: 9:00 AM on 27th of every month');
    console.log('  - Auto-deletion: 11:59 PM on last day of every month');
};

module.exports = {
    deleteOldActivityLogs,
    getLogsToBeDeleted,
    getLogsToDeleteCount,
    notifyUpcomingLogDeletion,
    initializeLogCleanupScheduler
};
