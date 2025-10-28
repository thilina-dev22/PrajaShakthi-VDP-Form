// PrajaShakthi-VDP-Form-backend/utils/activityLogger.js

const ActivityLog = require('../models/ActivityLogModel');

/**
 * Log user activity
 * @param {Object} params - Activity details
 * @param {ObjectId} params.userId - User who performed the action
 * @param {String} params.username - Username
 * @param {String} params.userRole - User's role
 * @param {String} params.action - Action performed
 * @param {String} params.targetType - Type of target (User, Submission, etc.)
 * @param {ObjectId} params.targetId - ID of the target
 * @param {Object} params.details - Additional details
 * @param {String} params.ipAddress - User's IP address
 * @param {String} params.userAgent - User's browser/agent
 * @param {String} params.district - District (if applicable)
 * @param {String} params.divisionalSecretariat - DS (if applicable)
 */
const logActivity = async ({
    userId,
    username,
    userRole,
    action,
    targetType = null,
    targetId = null,
    details = {},
    ipAddress = null,
    userAgent = null,
    district = null,
    divisionalSecretariat = null
}) => {
    try {
        await ActivityLog.create({
            user: userId,
            username,
            userRole,
            action,
            targetType,
            targetId,
            details,
            ipAddress,
            userAgent,
            district,
            divisionalSecretariat
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw error - logging should not break the main flow
    }
};

module.exports = { logActivity };
