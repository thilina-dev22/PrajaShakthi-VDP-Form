// PrajaShakthi-VDP-Form-backend/scripts/listAllAdminAccounts.js
// This script lists all existing district admin and DS user accounts
// Use this to review accounts before running resetAllAdminAccounts.js
// 
// Usage: node scripts/listAllAdminAccounts.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel');

dotenv.config();

async function listAllAdminAccounts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all district admins
        const districtAdmins = await User.find({ role: 'district_admin' })
            .select('username fullName district email isActive createdAt')
            .sort({ district: 1 });

        // Get all DS users
        const dsUsers = await User.find({ role: 'ds_user' })
            .select('username fullName district divisionalSecretariat email isActive createdAt')
            .sort({ district: 1, divisionalSecretariat: 1 });

        console.log('═'.repeat(80));
        console.log('📋 EXISTING ADMIN ACCOUNTS');
        console.log('═'.repeat(80));
        console.log();

        // Display District Admins
        console.log('👤 DISTRICT ADMIN ACCOUNTS');
        console.log('─'.repeat(80));
        if (districtAdmins.length === 0) {
            console.log('   No district admin accounts found.\n');
        } else {
            districtAdmins.forEach((admin, index) => {
                console.log(`${index + 1}. District: ${admin.district || 'N/A'}`);
                console.log(`   Username: ${admin.username}`);
                console.log(`   Full Name: ${admin.fullName || 'N/A'}`);
                console.log(`   Email: ${admin.email || 'N/A'}`);
                console.log(`   Status: ${admin.isActive ? '✅ Active' : '❌ Inactive'}`);
                console.log(`   Created: ${admin.createdAt?.toLocaleDateString() || 'N/A'}`);
                console.log();
            });
            console.log(`Total District Admins: ${districtAdmins.length}\n`);
        }

        // Display DS Users grouped by district
        console.log('👥 DS USER ACCOUNTS');
        console.log('─'.repeat(80));
        if (dsUsers.length === 0) {
            console.log('   No DS user accounts found.\n');
        } else {
            const dsUsersByDistrict = {};
            dsUsers.forEach(user => {
                const district = user.district || 'Unknown';
                if (!dsUsersByDistrict[district]) {
                    dsUsersByDistrict[district] = [];
                }
                dsUsersByDistrict[district].push(user);
            });

            let totalCount = 0;
            Object.keys(dsUsersByDistrict).sort().forEach(district => {
                console.log(`\n📍 ${district} District (${dsUsersByDistrict[district].length} DS Users):`);
                dsUsersByDistrict[district].forEach((user, index) => {
                    totalCount++;
                    console.log(`  ${index + 1}. DS Office: ${user.divisionalSecretariat || 'N/A'}`);
                    console.log(`     Username: ${user.username}`);
                    console.log(`     Email: ${user.email || 'N/A'}`);
                    console.log(`     Status: ${user.isActive ? '✅ Active' : '❌ Inactive'}`);
                });
            });
            console.log(`\nTotal DS Users: ${totalCount}\n`);
        }

        // Summary
        console.log('═'.repeat(80));
        console.log('📊 SUMMARY');
        console.log('═'.repeat(80));
        console.log(`District Admins: ${districtAdmins.length}`);
        console.log(`DS Users: ${dsUsers.length}`);
        console.log(`Total: ${districtAdmins.length + dsUsers.length}`);
        console.log('═'.repeat(80));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listAllAdminAccounts();
