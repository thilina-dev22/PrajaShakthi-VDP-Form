// PrajaShakthi-VDP-Form-backend/models/NotificationModel.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // Recipient user (super admin or district admin)
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // User who triggered the notification (can be null for system notifications)
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // Type of action
    action: {
        type: String,
        enum: [
            // Phase 1: Critical
            'CREATE_SUBMISSION', 
            'UPDATE_SUBMISSION', 
            'DELETE_SUBMISSION',
            'CREATE_USER',
            'UPDATE_USER',
            'DELETE_USER',
            'ACTIVATE_USER',
            'DEACTIVATE_USER',
            
            // Phase 2: Important
            'FAILED_LOGIN',
            'MULTIPLE_EDITS',
            'CRITICAL_FIELD_CHANGE',
            'DUPLICATE_NIC',
            'DATA_ANOMALY',
            
            // Phase 3: Nice-to-Have
            'DAILY_SUMMARY',
            'WEEKLY_SUMMARY',
            
            // Phase 4: Advanced
            'MONTHLY_SUMMARY',
            'QUARTERLY_REPORT',
            'INACTIVE_USER_ALERT',
            'MILESTONE_REACHED'
        ],
        required: true
    },
    // Related submission (optional)
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    },
    // Related user (optional - for user management notifications)
    relatedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Notification details
    message: {
        type: String,
        required: true
    },
    // Priority level
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    // Category for filtering
    category: {
        type: String,
        enum: ['submission', 'user', 'security', 'system', 'export', 'summary'],
        default: 'submission'
    },
    // Additional context
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Read status
    isRead: {
        type: Boolean,
        default: false
    },
    // Read timestamp
    readAt: {
        type: Date
    },
    // Creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
