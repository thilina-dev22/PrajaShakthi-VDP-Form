// PrajaShakthi-VDP-Form-backend/utils/notificationHelper.js

const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');

/**
 * Create notifications for all super admins
 * @param {String} action - Action type
 * @param {Object} data - Notification data
 * @param {ObjectId} triggeredBy - User who triggered the action (can be null for system notifications)
 * @param {String} priority - Priority level (low, medium, high, critical)
 * @param {String} category - Category (submission, user, security, system, export, summary)
 */
const notifySuperAdmins = async (action, data, triggeredBy = null, priority = 'medium', category = 'submission') => {
    try {
        const superAdmins = await User.find({ role: 'superadmin', isActive: true }).select('_id');

        if (superAdmins.length === 0) {
            console.log('No active super admins found to notify');
            return;
        }

        const message = generateNotificationMessage(action, data, triggeredBy);

        const notifications = superAdmins.map(admin => ({
            recipientId: admin._id,
            triggeredBy: triggeredBy?._id || triggeredBy,
            action,
            submissionId: data.submissionId,
            relatedUserId: data.relatedUserId,
            message,
            priority,
            category,
            details: data.details || {}
        }));

        await Notification.insertMany(notifications);
        console.log(`✅ [${category.toUpperCase()}] Created ${notifications.length} notification(s): ${action}`);
    } catch (error) {
        console.error('Error creating notifications for super admins:', error);
    }
};

/**
 * Create notifications for district admins of a specific district
 * @param {String} district - District name
 * @param {String} action - Action type
 * @param {Object} data - Notification data
 * @param {ObjectId} triggeredBy - User who triggered the action
 * @param {String} priority - Priority level
 * @param {String} category - Category
 */
const notifyDistrictAdmins = async (district, action, data, triggeredBy = null, priority = 'medium', category = 'submission') => {
    try {
        const districtAdmins = await User.find({ 
            role: 'district_admin', 
            district,
            isActive: true 
        }).select('_id');

        if (districtAdmins.length === 0) {
            console.log(`No active district admins found for ${district}`);
            return;
        }

        const message = generateNotificationMessage(action, data, triggeredBy);

        const notifications = districtAdmins.map(admin => ({
            recipientId: admin._id,
            triggeredBy: triggeredBy?._id || triggeredBy,
            action,
            submissionId: data.submissionId,
            relatedUserId: data.relatedUserId,
            message,
            priority,
            category,
            details: data.details || {}
        }));

        await Notification.insertMany(notifications);
        console.log(`✅ [${category.toUpperCase()}] Created ${notifications.length} notification(s) for ${district} district admins: ${action}`);
    } catch (error) {
        console.error('Error creating notifications for district admins:', error);
    }
};

/**
 * Generate notification message based on action and details
 */
const generateNotificationMessage = (action, data, triggeredBy) => {
    const userName = triggeredBy?.fullName || triggeredBy?.username || 'System';
    const details = data.details || {};
    
    switch (action) {
        // Phase 1: Submission notifications
        case 'CREATE_SUBMISSION':
            return `New ${details.formType === 'council_info' ? 'CDC Form' : 'Development Plan'} submitted by ${userName} in ${details.district}`;
        
        case 'UPDATE_SUBMISSION':
            const changeCount = details.changeCount || 0;
            const changeText = changeCount > 0 ? ` (${changeCount} field${changeCount !== 1 ? 's' : ''} changed)` : '';
            return `${details.formType === 'council_info' ? 'CDC Form' : 'Development Plan'} updated by ${userName} in ${details.gnDivision || details.district}${changeText}`;
        
        case 'DELETE_SUBMISSION':
            return `${details.formType === 'council_info' ? 'CDC Form' : 'Development Plan'} deleted by ${userName} from ${details.district}`;

        // Phase 1: User management
        case 'CREATE_USER':
            return `New ${details.role} created: ${details.username} for ${details.district} by ${userName}`;
        
        case 'UPDATE_USER':
            return `User updated: ${details.username} (${details.role}) by ${userName}`;
        
        case 'DELETE_USER':
            return `User deleted: ${details.username} (${details.role}) from ${details.district} by ${userName}`;
        
        case 'ACTIVATE_USER':
            return `User activated: ${details.username} by ${userName}`;
        
        case 'DEACTIVATE_USER':
            return `User deactivated: ${details.username} by ${userName}`;

        // Phase 2: Security
        case 'FAILED_LOGIN':
            return `Failed login attempts: ${details.count} attempts for ${details.username} from IP ${details.ipAddress}`;
        
        case 'MULTIPLE_EDITS':
            return `Multiple edits detected: Submission edited ${details.count} times by ${userName}`;
        
        case 'CRITICAL_FIELD_CHANGE':
            return `Critical field changed in submission: ${details.changes} by ${userName}`;
        
        case 'DUPLICATE_NIC':
            return `Duplicate NIC detected: ${details.oldValue} found in ${details.count} submissions`;
        
        case 'DATA_ANOMALY':
            return `Data anomaly detected: ${details.changes}`;

        // Phase 3: Summaries
        case 'DAILY_SUMMARY':
            return `Daily Summary for ${details.district}: ${details.count} submissions received`;
        
        case 'WEEKLY_SUMMARY':
            return `Weekly Summary for ${details.district}: ${details.count} total submissions`;

        // Phase 4: Advanced
        case 'MONTHLY_SUMMARY':
            return `Monthly Report: ${details.count} submissions received in ${details.timeframe}`;
        
        case 'QUARTERLY_REPORT':
            return `Quarterly Report due: Please review and export submissions for ${details.timeframe}`;
        
        case 'INACTIVE_USER_ALERT':
            return `Inactive user alert: ${details.username} hasn't submitted in ${details.timeframe}`;
        
        case 'MILESTONE_REACHED':
            return `Milestone reached: ${details.count} submissions received for ${details.district}`;

        // Phase 5: System Maintenance
        case 'LOG_DELETION_REMINDER':
            return `⚠️ Activity Log Cleanup: ${details.count} logs will be deleted on ${details.deletionDate}. Download logs before deletion if needed.`;
        
        case 'SYSTEM_CLEANUP':
            return `System Cleanup Complete: ${details.count} ${details.cleanupType} deleted (older than ${details.cutoffDate})`;

        default:
            return `Notification: ${action} by ${userName}`;
    }
};

/**
 * Track failed login attempts and create/update notifications
 * Groups attempts by username within a 1-hour window
 */
const trackFailedLogin = async (username, ipAddress) => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        // Find existing unread notification for this user within the last hour
        const existingNotification = await Notification.findOne({
            action: 'FAILED_LOGIN',
            'details.username': username,
            createdAt: { $gte: oneHourAgo },
            isRead: false
        }).sort({ createdAt: -1 });

        let attemptNumber = 1;

        if (existingNotification) {
            // Update existing notification with cumulative count
            attemptNumber = (existingNotification.details.count || 0) + 1;
            
            // Update priority based on cumulative attempts
            let priority = 'medium';
            if (attemptNumber >= 5) {
                priority = 'critical';
            } else if (attemptNumber >= 3) {
                priority = 'high';
            }

            // Update the notification
            existingNotification.details.count = attemptNumber;
            existingNotification.details.lastAttemptIp = ipAddress;
            existingNotification.details.lastAttemptAt = new Date();
            existingNotification.priority = priority;
            existingNotification.message = `Failed login attempts: ${attemptNumber} attempts for ${username} from IP ${ipAddress}`;
            
            await existingNotification.save();
            
            console.log(`🔒 Updated failed login notification: ${username} (Total: ${attemptNumber} attempts, Priority: ${priority})`);
        } else {
            // Create new notification for first attempt
            let priority = 'medium';

            await notifySuperAdmins(
                'FAILED_LOGIN',
                {
                    details: {
                        username,
                        ipAddress,
                        count: attemptNumber,
                        lastAttemptIp: ipAddress,
                        lastAttemptAt: new Date()
                    }
                },
                null,
                priority,
                'security'
            );

            console.log(`🔒 Created failed login notification: ${username} (Attempt 1)`);
        }

        return attemptNumber;
    } catch (error) {
        console.error('Error tracking failed login:', error);
        return 0;
    }
};

/**
 * Check for duplicate NIC entries
 */
const checkDuplicateNIC = async (nic, submissionId) => {
    try {
        const Submission = require('../models/SubmissionModel');
        const count = await Submission.countDocuments({
            'councilMembers.nic': nic,
            _id: { $ne: submissionId }
        });

        if (count > 0) {
            await notifySuperAdmins(
                'DUPLICATE_NIC',
                {
                    details: {
                        oldValue: nic,
                        count: count + 1
                    }
                },
                null,
                'medium',
                'security'
            );
        }

        return count;
    } catch (error) {
        console.error('Error checking duplicate NIC:', error);
        return 0;
    }
};

/**
 * Generate daily summary notifications
 */
const generateDailySummary = async () => {
    try {
        const Submission = require('../models/SubmissionModel');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const submissions = await Submission.aggregate([
            {
                $match: {
                    createdAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 }
                }
            }
        ]);

        for (const district of submissions) {
            await notifyDistrictAdmins(
                district._id,
                'DAILY_SUMMARY',
                {
                    details: {
                        district: district._id,
                        count: district.count
                    }
                },
                null,
                'low',
                'summary'
            );
        }

        console.log('✅ Daily summaries generated');
    } catch (error) {
        console.error('Error generating daily summary:', error);
    }
};

/**
 * Generate weekly summary notifications
 */
const generateWeeklySummary = async () => {
    try {
        const Submission = require('../models/SubmissionModel');
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const submissions = await Submission.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekAgo }
                }
            },
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 }
                }
            }
        ]);

        for (const district of submissions) {
            await notifyDistrictAdmins(
                district._id,
                'WEEKLY_SUMMARY',
                {
                    details: {
                        district: district._id,
                        count: district.count
                    }
                },
                null,
                'low',
                'summary'
            );
        }

        console.log('✅ Weekly summaries generated');
    } catch (error) {
        console.error('Error generating weekly summary:', error);
    }
};

/**
 * Check for inactive users
 */
const checkInactiveUsers = async () => {
    try {
        const Submission = require('../models/SubmissionModel');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const activeUsers = await Submission.distinct('submittedBy', {
            createdAt: { $gte: thirtyDaysAgo }
        });

        const inactiveUsers = await User.find({
            role: 'ds_user',
            isActive: true,
            _id: { $nin: activeUsers }
        });

        for (const user of inactiveUsers) {
            await notifySuperAdmins(
                'INACTIVE_USER_ALERT',
                {
                    relatedUserId: user._id,
                    details: {
                        username: user.username,
                        district: user.district,
                        timeframe: '30 days'
                    }
                },
                null,
                'low',
                'system'
            );
        }

        console.log(`✅ Checked ${inactiveUsers.length} inactive users`);
    } catch (error) {
        console.error('Error checking inactive users:', error);
    }
};

module.exports = {
    notifySuperAdmins,
    notifyDistrictAdmins,
    generateNotificationMessage,
    trackFailedLogin,
    checkDuplicateNIC,
    generateDailySummary,
    generateWeeklySummary,
    checkInactiveUsers
};
