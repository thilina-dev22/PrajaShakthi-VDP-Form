// PrajaShakthi-VDP-Form-backend/controllers/notificationController.js

const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');

// @desc   Get notifications for the logged-in user
// @route  GET /api/notifications
// @access Private (Super Admin only)
const getNotifications = async (req, res) => {
    try {
        const user = req.user;
        const { 
            limit = 50, 
            skip = 0, 
            unreadOnly = false,
            category,
            priority,
            action
        } = req.query;

        const filter = { recipientId: user._id };
        
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (priority) {
            filter.priority = priority;
        }
        
        if (action) {
            filter.action = action;
        }

        const notifications = await Notification.find(filter)
            .populate('triggeredBy', 'username fullName role district divisionalSecretariat')
            .populate('submissionId', 'location formType')
            .populate('relatedUserId', 'username fullName role district divisionalSecretariat')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const unreadCount = await Notification.countDocuments({
            recipientId: user._id,
            isRead: false
        });

        res.json({
            notifications,
            unreadCount,
            total: notifications.length
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// @desc   Mark notification as read
// @route  PUT /api/notifications/:id/read
// @access Private (Super Admin only)
const markAsRead = async (req, res) => {
    try {
        const user = req.user;
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Verify notification belongs to the user
        if (notification.recipientId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this notification' });
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

// @desc   Mark all notifications as read
// @route  PUT /api/notifications/mark-all-read
// @access Private (Super Admin only)
const markAllAsRead = async (req, res) => {
    try {
        const user = req.user;

        await Notification.updateMany(
            { recipientId: user._id, isRead: false },
            { $set: { isRead: true, readAt: new Date() } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
};

// @desc   Delete a notification
// @route  DELETE /api/notifications/:id
// @access Private (Super Admin only)
const deleteNotification = async (req, res) => {
    try {
        const user = req.user;
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Verify notification belongs to the user
        if (notification.recipientId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this notification' });
        }

        await notification.deleteOne();

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};

// @desc   Delete all read notifications
// @route  DELETE /api/notifications/clear-read
// @access Private (Super Admin & District Admin)
const clearReadNotifications = async (req, res) => {
    try {
        const user = req.user;

        console.log(`🗑️  Clearing read notifications for user: ${user.username} (${user._id})`);

        const result = await Notification.deleteMany({
            recipientId: user._id,
            isRead: true
        });

        console.log(`✅ Deleted ${result.deletedCount} read notifications`);

        res.json({ 
            message: 'Read notifications cleared successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing read notifications:', error);
        res.status(500).json({ message: 'Error clearing notifications', error: error.message });
    }
};

// @desc   Get unread notification count
// @route  GET /api/notifications/unread-count
// @access Private (Super Admin only)
const getUnreadCount = async (req, res) => {
    try {
        const user = req.user;

        const count = await Notification.countDocuments({
            recipientId: user._id,
            isRead: false
        });

        res.json({ unreadCount: count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Error getting count', error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    getUnreadCount
};
