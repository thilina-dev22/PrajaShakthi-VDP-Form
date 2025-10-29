// Script to delete all old failed login notifications
// Run this to clean up and start fresh

require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/NotificationModel');

const cleanupFailedLogins = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const result = await Notification.deleteMany({
            action: 'FAILED_LOGIN'
        });

        console.log(`🗑️  Deleted ${result.deletedCount} failed login notifications`);
        console.log('✅ Cleanup completed! You can now test the new failed login tracking.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

cleanupFailedLogins();
