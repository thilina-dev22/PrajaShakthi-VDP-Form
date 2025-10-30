// PrajaShakthi-VDP-Form-backend/scripts/resetAllAdminAccounts.js
// This script deletes all existing district admin and DS user accounts,
// then creates new accounts for all 25 districts and their DS divisions
// 
// Usage: node scripts/resetAllAdminAccounts.js
// 
// WARNING: This will delete all existing district admin and DS user accounts!
// Make sure you have a database backup before running this script.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Load provincial data to get all districts and DS divisions
const provincialDataPath = path.join(__dirname, '../../PrajaShakthi-VDP-Form-frontend/src/data/provincial_data.json');
let provincialData;

try {
    const rawData = fs.readFileSync(provincialDataPath, 'utf8');
    provincialData = JSON.parse(rawData);
} catch (error) {
    console.error('❌ Error loading provincial_data.json:', error.message);
    process.exit(1);
}

// Extract unique districts from provincial data
function extractDistrictsAndDS() {
    const districtMap = new Map();
    
    provincialData.forEach(province => {
        province.districts.forEach(districtObj => {
            // Clean district name (remove Sinhala/Tamil, keep only English)
            const fullName = districtObj.district.trim();
            const districtName = fullName.split('/').pop().trim();
            
            if (!districtMap.has(districtName)) {
                districtMap.set(districtName, []);
            }
            
            // Extract DS divisions for this district
            if (districtObj.ds_divisions) {
                districtObj.ds_divisions.forEach(ds => {
                    const fullDSName = ds.ds_division_name.trim();
                    const dsName = fullDSName.split('/').pop().trim();
                    
                    // Add to district's DS list if not already present
                    const dsList = districtMap.get(districtName);
                    if (!dsList.includes(dsName)) {
                        dsList.push(dsName);
                    }
                });
            }
        });
    });
    
    return districtMap;
}

// Generate username from district/DS name (lowercase, no spaces)
function generateUsername(name, prefix = '') {
    const cleanName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')  // Replace non-alphanumeric with underscore
        .replace(/_+/g, '_')           // Replace multiple underscores with single
        .replace(/^_|_$/g, '');        // Remove leading/trailing underscores
    
    return prefix ? `${prefix}_${cleanName}` : cleanName;
}

// Generate email from username
function generateEmail(username, domain = 'prajashakthi.lk') {
    return `${username}@${domain}`;
}

// Main function
async function resetAllAdminAccounts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Extract districts and DS divisions
        const districtMap = extractDistrictsAndDS();
        console.log(`📊 Found ${districtMap.size} districts in provincial data\n`);

        // Step 1: Delete all existing district admin and DS user accounts
        console.log('🗑️  STEP 1: Deleting existing accounts...');
        console.log('─'.repeat(60));
        
        const deleteResult = await User.deleteMany({
            role: { $in: ['district_admin', 'ds_user'] }
        });
        
        console.log(`✅ Deleted ${deleteResult.deletedCount} existing accounts`);
        console.log(`   - District Admins and DS Users removed\n`);

        // Step 2: Create district admin accounts
        console.log('👤 STEP 2: Creating District Admin accounts...');
        console.log('─'.repeat(60));
        
        let districtAdminCount = 0;
        const districtAdmins = [];
        
        for (const [districtName, dsList] of districtMap.entries()) {
            const username = generateUsername(districtName, 'admin');
            const email = generateEmail(username);
            
            try {
                const admin = await User.create({
                    username: username,
                    password: 'District@123',  // Default password
                    role: 'district_admin',
                    fullName: `${districtName} District Administrator`,
                    email: email,
                    district: districtName,
                    isActive: true
                });
                
                districtAdmins.push({
                    district: districtName,
                    username: username,
                    password: 'District@123',
                    dsCount: dsList.length
                });
                
                districtAdminCount++;
                console.log(`✅ [${districtAdminCount}/25] ${districtName}`);
                console.log(`   Username: ${username}`);
                console.log(`   Email: ${email}`);
                console.log(`   DS Divisions: ${dsList.length}\n`);
            } catch (error) {
                console.log(`❌ Failed to create admin for ${districtName}: ${error.message}\n`);
            }
        }
        
        console.log(`✅ Created ${districtAdminCount} District Admin accounts\n`);

        // Step 3: Create DS user accounts
        console.log('👥 STEP 3: Creating DS User accounts...');
        console.log('─'.repeat(60));
        
        let dsUserCount = 0;
        const dsUsers = [];
        
        for (const [districtName, dsList] of districtMap.entries()) {
            console.log(`\n📍 District: ${districtName} (${dsList.length} DS divisions)`);
            
            for (const dsName of dsList) {
                const username = generateUsername(`${districtName}_${dsName}`, 'ds');
                const email = generateEmail(username);
                
                try {
                    const dsUser = await User.create({
                        username: username,
                        password: 'DSUser@123',  // Default password
                        role: 'ds_user',
                        fullName: `${dsName} DS User`,
                        email: email,
                        district: districtName,
                        divisionalSecretariat: dsName,
                        isActive: true
                    });
                    
                    dsUsers.push({
                        district: districtName,
                        dsOffice: dsName,
                        username: username,
                        password: 'DSUser@123'
                    });
                    
                    dsUserCount++;
                    console.log(`  ✅ [${dsUserCount}] ${dsName} → ${username}`);
                } catch (error) {
                    console.log(`  ❌ Failed: ${dsName} - ${error.message}`);
                }
            }
        }
        
        console.log(`\n✅ Created ${dsUserCount} DS User accounts\n`);

        // Step 4: Generate summary report
        console.log('📋 STEP 4: Generating summary report...');
        console.log('─'.repeat(60));
        
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalDistricts: districtAdminCount,
                totalDSUsers: dsUserCount,
                deletedAccounts: deleteResult.deletedCount
            },
            districtAdmins: districtAdmins.map(admin => ({
                district: admin.district,
                username: admin.username,
                password: admin.password,
                email: `${admin.username}@prajashakthi.lk`,
                dsOfficesCount: admin.dsCount
            })),
            dsUsers: dsUsers.map(user => ({
                district: user.district,
                dsOffice: user.dsOffice,
                username: user.username,
                password: user.password,
                email: `${user.username}@prajashakthi.lk`
            }))
        };
        
        // Save report to file
        const reportPath = path.join(__dirname, 'admin_accounts_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Report saved to: ${reportPath}\n`);

        // Display summary
        console.log('═'.repeat(60));
        console.log('🎉 ACCOUNT RESET COMPLETE!');
        console.log('═'.repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   - Deleted accounts: ${deleteResult.deletedCount}`);
        console.log(`   - District Admins created: ${districtAdminCount}`);
        console.log(`   - DS Users created: ${dsUserCount}`);
        console.log(`   - Total new accounts: ${districtAdminCount + dsUserCount}`);
        console.log();
        console.log(`🔑 Default Passwords:`);
        console.log(`   - District Admins: District@123`);
        console.log(`   - DS Users: DSUser@123`);
        console.log();
        console.log(`⚠️  IMPORTANT:`);
        console.log(`   1. All users should change their passwords after first login`);
        console.log(`   2. Check admin_accounts_report.json for full credentials list`);
        console.log(`   3. Keep this report file secure!`);
        console.log('═'.repeat(60));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
resetAllAdminAccounts();
