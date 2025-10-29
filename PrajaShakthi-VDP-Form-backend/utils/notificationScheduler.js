// PrajaShakthi-VDP-Form-backend/utils/notificationScheduler.js

const cron = require('node-cron');
const {
    generateDailySummary,
    generateWeeklySummary,
    checkInactiveUsers
} = require('./notificationHelper');
const { notifySuperAdmins } = require('./notificationHelper');
const Submission = require('../models/SubmissionModel');

/**
 * Generate monthly summary (Phase 4)
 */
const generateMonthlySummary = async () => {
    try {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);

        const submissions = await Submission.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthAgo }
                }
            },
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalCount = submissions.reduce((sum, d) => sum + d.count, 0);

        await notifySuperAdmins(
            'MONTHLY_SUMMARY',
            {
                details: {
                    count: totalCount,
                    timeframe: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
            },
            null,
            'low',
            'summary'
        );

        console.log(`✅ Generated monthly summary: ${totalCount} submissions`);
    } catch (error) {
        console.error('Error generating monthly summary:', error);
    }
};

/**
 * Check for milestones reached (Phase 4)
 */
const checkMilestones = async () => {
    try {
        const milestones = [50, 100, 250, 500, 1000];
        
        const districts = await Submission.aggregate([
            {
                $group: {
                    _id: '$location.district',
                    count: { $sum: 1 }
                }
            }
        ]);

        for (const district of districts) {
            for (const milestone of milestones) {
                // Check if count is within 5 of milestone (recently reached)
                if (Math.abs(district.count - milestone) <= 5) {
                    await notifySuperAdmins(
                        'MILESTONE_REACHED',
                        {
                            details: {
                                district: district._id,
                                count: milestone
                            }
                        },
                        null,
                        'medium',
                        'system'
                    );
                }
            }
        }

        console.log('✅ Checked milestones for all districts');
    } catch (error) {
        console.error('Error checking milestones:', error);
    }
};

/**
 * Initialize all scheduled tasks
 */
const initializeScheduler = () => {
    console.log('📅 Initializing notification scheduler...');

    // Daily summary - Every day at 6:00 PM
    cron.schedule('0 18 * * *', () => {
        console.log('🔔 Running daily summary task...');
        generateDailySummary();
    });

    // Weekly summary - Every Monday at 9:00 AM
    cron.schedule('0 9 * * 1', () => {
        console.log('🔔 Running weekly summary task...');
        generateWeeklySummary();
    });

    // Check inactive users - Every Sunday at 10:00 AM
    cron.schedule('0 10 * * 0', () => {
        console.log('🔔 Checking inactive users...');
        checkInactiveUsers();
    });

    // Monthly summary - First day of each month at 9:00 AM
    cron.schedule('0 9 1 * *', () => {
        console.log('🔔 Generating monthly summary...');
        generateMonthlySummary();
    });

    // Check milestones - Every day at 8:00 PM
    cron.schedule('0 20 * * *', () => {
        console.log('🔔 Checking milestones...');
        checkMilestones();
    });

    console.log('✅ Notification scheduler initialized');
    console.log('📋 Scheduled tasks:');
    console.log('  - Daily summary: 6:00 PM daily');
    console.log('  - Weekly summary: 9:00 AM every Monday');
    console.log('  - Inactive users check: 10:00 AM every Sunday');
    console.log('  - Monthly summary: 9:00 AM first day of month');
    console.log('  - Milestones check: 8:00 PM daily');
};

module.exports = {
    initializeScheduler,
    generateMonthlySummary,
    checkMilestones
};
