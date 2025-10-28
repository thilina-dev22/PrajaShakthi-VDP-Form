// PrajaShakthi-VDP-Form-backend/scripts/createSuperAdmin.js
// Run this script once to create the super admin account
// Usage: node scripts/createSuperAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel');

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        
        if (existingSuperAdmin) {
            console.log('Super Admin already exists:', existingSuperAdmin.username);
            process.exit(0);
        }

        // Create super admin
        const superAdmin = await User.create({
            username: 'superadmin',
            password: 'Admin@123', // Change this password after first login!
            role: 'superadmin',
            fullName: 'System Administrator',
            email: 'admin@prajashakthi.lk',
            isActive: true
        });

        console.log('✅ Super Admin created successfully!');
        console.log('Username:', superAdmin.username);
        console.log('Password: Admin@123');
        console.log('⚠️  IMPORTANT: Please change this password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating super admin:', error);
        process.exit(1);
    }
};

createSuperAdmin();
