// Script to consolidate duplicate failed login notifications
// Run this once to clean up old notification spam

require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/NotificationModel');

const consolidateFailedLogins = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find all failed login notifications grouped by username
        const failedLogins = await Notification.find({
            action: 'FAILED_LOGIN'
        }).sort({ createdAt: 1 });

        console.log(`📊 Found ${failedLogins.length} failed login notifications`);

        // Group by recipientId and username
        const grouped = {};
        
        for (const notification of failedLogins) {
            const key = `${notification.recipientId}_${notification.details.username}`;
            
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(notification);
        }

        console.log(`👥 Found ${Object.keys(grouped).length} unique recipient-username combinations`);

        let consolidated = 0;
        let deleted = 0;

        // Process each group
        for (const [key, notifications] of Object.entries(grouped)) {
            if (notifications.length > 1) {
                // Keep the oldest notification and update it
                const [firstNotification, ...duplicates] = notifications;
                
                // Calculate total attempts
                const totalAttempts = notifications.reduce((sum, n) => sum + (n.details.count || 1), 0);
                
                // Get the latest IP and timestamp
                const lastNotification = notifications[notifications.length - 1];
                
                // Update priority based on total attempts
                let priority = 'medium';
                if (totalAttempts >= 5) {
                    priority = 'critical';
                } else if (totalAttempts >= 3) {
                    priority = 'high';
                }

                // Update the first notification
                firstNotification.details.count = totalAttempts;
                firstNotification.details.lastAttemptIp = lastNotification.details.ipAddress;
                firstNotification.details.lastAttemptAt = lastNotification.createdAt;
                firstNotification.priority = priority;
                firstNotification.message = `Failed login attempts: ${totalAttempts} attempts for ${firstNotification.details.username} from IP ${lastNotification.details.ipAddress}`;
                
                await firstNotification.save();
                
                // Delete duplicates
                for (const duplicate of duplicates) {
                    await duplicate.deleteOne();
                    deleted++;
                }
                
                consolidated++;
                console.log(`✅ Consolidated ${notifications.length} notifications for ${firstNotification.details.username} (Total: ${totalAttempts} attempts, Priority: ${priority})`);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`  - Consolidated groups: ${consolidated}`);
        console.log(`  - Deleted duplicates: ${deleted}`);
        console.log(`  - Remaining notifications: ${failedLogins.length - deleted}`);
        console.log('\n✅ Migration completed successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error consolidating notifications:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

consolidateFailedLogins();
