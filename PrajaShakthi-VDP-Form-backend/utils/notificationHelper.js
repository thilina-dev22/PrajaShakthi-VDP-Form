// PrajaShakthi-VDP-Form-backend/utils/notificationHelper.js

const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');

/**
 * Create notifications for all super admins
 * @param {Object} data - Notification data
 * @param {String} data.action - Action type (CREATE_SUBMISSION, UPDATE_SUBMISSION, DELETE_SUBMISSION)
 * @param {ObjectId} data.triggeredBy - User who triggered the action
 * @param {ObjectId} data.submissionId - Related submission ID
 * @param {String} data.message - Notification message
 * @param {Object} data.details - Additional details (district, dsDivision, gnDivision, formType, changes)
 */
const notifySuperAdmins = async (data) => {
    try {
        // Find all super admins
        const superAdmins = await User.find({ role: 'superadmin' }).select('_id');

        if (superAdmins.length === 0) {
            console.log('No super admins found to notify');
            return;
        }

        // Create notifications for each super admin
        const notifications = superAdmins.map(admin => ({
            recipientId: admin._id,
            triggeredBy: data.triggeredBy,
            action: data.action,
            submissionId: data.submissionId,
            message: data.message,
            details: data.details || {}
        }));

        await Notification.insertMany(notifications);

        console.log(`✅ Created ${notifications.length} notification(s) for super admins`);
    } catch (error) {
        console.error('Error creating notifications for super admins:', error);
        // Don't throw error - notification failure shouldn't break the main operation
    }
};

/**
 * Generate notification message based on action and details
 * @param {String} action - Action type
 * @param {Object} user - User who performed the action
 * @param {Object} details - Action details
 * @returns {String} - Formatted notification message
 */
const generateNotificationMessage = (action, user, details) => {
    const userName = user.fullName || user.username;
    const location = `${details.gnDivision || 'Unknown GN'}, ${details.dsDivision || 'Unknown DS'}, ${details.district || 'Unknown District'}`;
    const formTypeText = details.formType === 'council_info' ? 'Community Council' : 'Development Planning';

    switch (action) {
        case 'CREATE_SUBMISSION':
            return `${userName} created a new ${formTypeText} submission for ${location}`;
        
        case 'UPDATE_SUBMISSION':
            const changesText = details.changes ? ` - Changes: ${details.changes}` : '';
            return `${userName} updated ${formTypeText} submission for ${location}${changesText}`;
        
        case 'DELETE_SUBMISSION':
            return `${userName} deleted ${formTypeText} submission for ${location}`;
        
        default:
            return `${userName} performed an action on ${formTypeText} submission for ${location}`;
    }
};

module.exports = {
    notifySuperAdmins,
    generateNotificationMessage
};
