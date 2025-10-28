// PrajaShakthi-VDP-Form-backend/models/ActivityLogModel.js

const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN',
            'LOGOUT',
            'CREATE_USER',
            'UPDATE_USER',
            'DELETE_USER',
            'CREATE_SUBMISSION',
            'UPDATE_SUBMISSION',
            'DELETE_SUBMISSION',
            'VIEW_SUBMISSIONS',
            'VIEW_USERS',
            'EXPORT_DATA'
        ]
    },
    targetType: {
        type: String,
        enum: ['User', 'Submission', 'System', null]
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed // Flexible field for additional context
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    district: {
        type: String // For filtering logs by district
    },
    divisionalSecretariat: {
        type: String // For filtering logs by DS
    }
}, {
    timestamps: true
});

// Index for efficient querying
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ district: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = ActivityLog;
