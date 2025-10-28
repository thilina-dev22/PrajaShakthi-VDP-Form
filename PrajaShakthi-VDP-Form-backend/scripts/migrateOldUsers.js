// PrajaShakthi-VDP-Form-backend/scripts/migrateOldUsers.js
// This script migrates old 'admin' users to 'superadmin' role
// Run once: node scripts/migrateOldUsers.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel');

dotenv.config();

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all users with old 'admin' role
        const oldAdmins = await User.find({ role: 'admin' });
        
        if (oldAdmins.length === 0) {
            console.log('No old admin users found to migrate');
            process.exit(0);
        }

        console.log(`Found ${oldAdmins.length} old admin user(s)`);

        // Update each admin to superadmin
        for (const user of oldAdmins) {
            user.role = 'superadmin';
            user.isActive = true; // Ensure they are active
            await user.save();
            console.log(`✅ Migrated ${user.username} to superadmin`);
        }

        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error migrating users:', error);
        process.exit(1);
    }
};

migrateUsers();
