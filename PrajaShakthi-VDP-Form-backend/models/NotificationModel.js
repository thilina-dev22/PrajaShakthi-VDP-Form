// PrajaShakthi-VDP-Form-backend/models/NotificationModel.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // Recipient user (super admin)
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // User who triggered the notification
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Type of action
    action: {
        type: String,
        enum: ['CREATE_SUBMISSION', 'UPDATE_SUBMISSION', 'DELETE_SUBMISSION'],
        required: true
    },
    // Related submission
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    },
    // Notification details
    message: {
        type: String,
        required: true
    },
    // Additional context
    details: {
        district: String,
        dsDivision: String,
        gnDivision: String,
        formType: String,
        changes: String
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
