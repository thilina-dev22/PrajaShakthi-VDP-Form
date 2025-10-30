// PrajaShakthi-VDP-Form-backend/controllers/userController.js

const User = require('../models/UserModel');
const { logActivity } = require('../utils/activityLogger');
const { notifySuperAdmins } = require('../utils/notificationHelper');

// @desc    Create a new user (District Admin or DS User)
// @route   POST /api/users
// @access  Private (SuperAdmin creates District Admin, District Admin creates DS User)
const createUser = async (req, res) => {
    try {
        const { username, password, role, district, divisionalSecretariat, fullName, email } = req.body;
        const creator = req.user;

        // Validation: SuperAdmin can only create District Admins
        if (creator.role === 'superadmin' && role !== 'district_admin') {
            return res.status(403).json({ 
                message: 'Super Admin can only create District Admin accounts' 
            });
        }

        // Validation: Maximum 25 district admin accounts (Sri Lanka has 25 districts)
        if (role === 'district_admin') {
            const districtAdminCount = await User.countDocuments({ role: 'district_admin' });
            if (districtAdminCount >= 25) {
                return res.status(400).json({ 
                    message: 'Maximum limit of 25 District Admin accounts reached. Sri Lanka has only 25 districts.' 
                });
            }

            // Validation: Only one district admin per district
            const existingDistrictAdmin = await User.findOne({ 
                role: 'district_admin', 
                district: district 
            });
            if (existingDistrictAdmin) {
                return res.status(400).json({ 
                    message: `A District Admin already exists for ${district} district.`,
                    existingUser: existingDistrictAdmin.username
                });
            }
        }

        // Validation: District Admin can only create DS Users in their district
        if (creator.role === 'district_admin') {
            if (role !== 'ds_user') {
                return res.status(403).json({ 
                    message: 'District Admin can only create DS User accounts' 
                });
            }
            if (district !== creator.district) {
                return res.status(403).json({ 
                    message: 'You can only create users for your own district' 
                });
            }
        }

        // Validation: Only one DS user per DS office
        if (role === 'ds_user') {
            const existingDSUser = await User.findOne({ 
                role: 'ds_user', 
                district: district,
                divisionalSecretariat: divisionalSecretariat 
            });
            if (existingDSUser) {
                return res.status(400).json({ 
                    message: `A DS User already exists for ${divisionalSecretariat} office in ${district} district.`,
                    existingUser: existingDSUser.username
                });
            }
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const newUser = await User.create({
            username,
            password,
            role,
            district,
            divisionalSecretariat,
            fullName,
            email,
            createdBy: creator._id
        });

        // Log activity
        await logActivity({
            userId: creator._id,
            username: creator.username,
            userRole: creator.role,
            action: 'CREATE_USER',
            targetType: 'User',
            targetId: newUser._id,
            details: {
                createdUsername: username,
                createdRole: role,
                district,
                divisionalSecretariat
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: creator.district,
            divisionalSecretariat: creator.divisionalSecretariat
        });

        // Notify super admins when user is created (Phase 1)
        await notifySuperAdmins(
            'CREATE_USER',
            {
                relatedUserId: newUser._id,
                details: {
                    username: newUser.username,
                    role: newUser.role,
                    district: newUser.district,
                    dsDivision: newUser.divisionalSecretariat
                }
            },
            creator,
            'medium',
            'user'
        );

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            district: newUser.district,
            divisionalSecretariat: newUser.divisionalSecretariat,
            fullName: newUser.fullName,
            email: newUser.email,
            isActive: newUser.isActive
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// @desc    Get users based on role
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        let filter = {};

        // SuperAdmin sees all District Admins
        if (currentUser.role === 'superadmin') {
            filter.role = 'district_admin';
        }
        // District Admin sees DS Users in their district
        else if (currentUser.role === 'district_admin') {
            filter.role = 'ds_user';
            filter.district = currentUser.district;
        }
        // DS Users don't see other users
        else {
            return res.status(403).json({ message: 'Not authorized to view users' });
        }

        const users = await User.find(filter)
            .select('-password')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'VIEW_USERS',
            details: { count: users.length },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, isActive, password } = req.body;
        const currentUser = req.user;

        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Permission check
        if (currentUser.role === 'district_admin' && 
            userToUpdate.district !== currentUser.district) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        // Update fields
        if (fullName !== undefined) userToUpdate.fullName = fullName;
        if (email !== undefined) userToUpdate.email = email;
        if (isActive !== undefined) userToUpdate.isActive = isActive;
        if (password) userToUpdate.password = password; // Will be hashed by pre-save hook

        await userToUpdate.save();

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'UPDATE_USER',
            targetType: 'User',
            targetId: userToUpdate._id,
            details: {
                updatedUsername: userToUpdate.username,
                changes: { fullName, email, isActive: isActive !== undefined }
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        // Notify about activation/deactivation specifically (Phase 1)
        if (isActive !== undefined) {
            await notifySuperAdmins(
                isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
                {
                    relatedUserId: userToUpdate._id,
                    details: {
                        username: userToUpdate.username,
                        role: userToUpdate.role,
                        district: userToUpdate.district
                    }
                },
                currentUser,
                'medium',
                'user'
            );
        }

        // Notify super admins when user details are updated (Phase 1)
        // Only send UPDATE_USER if fields other than isActive were changed
        const hasOtherChanges = fullName !== undefined || email !== undefined || password;
        if (hasOtherChanges) {
            await notifySuperAdmins(
                'UPDATE_USER',
                {
                    relatedUserId: userToUpdate._id,
                    details: {
                        username: userToUpdate.username,
                        role: userToUpdate.role,
                        district: userToUpdate.district,
                        changes: `Updated: ${Object.keys({ fullName, email }).filter(k => eval(k) !== undefined).join(', ')}`
                    }
                },
                currentUser,
                'low',
                'user'
            );
        }

        res.json({
            _id: userToUpdate._id,
            username: userToUpdate.username,
            role: userToUpdate.role,
            district: userToUpdate.district,
            divisionalSecretariat: userToUpdate.divisionalSecretariat,
            fullName: userToUpdate.fullName,
            email: userToUpdate.email,
            isActive: userToUpdate.isActive
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Permission check
        if (currentUser.role === 'district_admin' && 
            userToDelete.district !== currentUser.district) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }

        await userToDelete.deleteOne();

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'DELETE_USER',
            targetType: 'User',
            targetId: id,
            details: {
                deletedUsername: userToDelete.username,
                deletedRole: userToDelete.role
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        // Notify super admins when user is deleted (Phase 1)
        await notifySuperAdmins(
            'DELETE_USER',
            {
                details: {
                    username: userToDelete.username,
                    role: userToDelete.role,
                    district: userToDelete.district
                }
            },
            currentUser,
            'high',
            'user'
        );

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// @desc    Get activity logs
// @route   GET /api/users/logs
// @access  Private (SuperAdmin sees all, District Admin sees their district)
const getActivityLogs = async (req, res) => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 50, action, startDate, endDate } = req.query;

        let filter = {};

        // SuperAdmin sees all logs
        if (currentUser.role === 'superadmin') {
            // No additional filter
        }
        // District Admin sees only their district's logs
        else if (currentUser.role === 'district_admin') {
            filter.district = currentUser.district;
        }
        // DS Users see only their own logs
        else {
            filter.user = currentUser._id;
        }

        // Additional filters
        if (action) filter.action = action;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const ActivityLog = require('../models/ActivityLogModel');
        const logs = await ActivityLog.find(filter)
            .populate('user', 'username role district divisionalSecretariat')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await ActivityLog.countDocuments(filter);

        res.json({
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

// @desc    Change own password
// @route   PUT /api/users/change-password
// @access  Private (All authenticated users)
const changeOwnPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const currentUser = req.user;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Get user with password
        const user = await User.findById(currentUser._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordCorrect = await user.matchPassword(currentPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save hook
        await user.save();

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'CHANGE_OWN_PASSWORD',
            details: { 
                message: 'User changed their own password'
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

// @desc    Get users under authority (for password management)
// @route   GET /api/users/subordinates
// @access  Private (SuperAdmin and DistrictAdmin only)
const getUsersUnderAuthority = async (req, res) => {
    try {
        const currentUser = req.user;
        let filter = {};

        // SuperAdmin sees all District Admins
        if (currentUser.role === 'superadmin') {
            filter.role = 'district_admin';
        }
        // District Admin sees DS Users in their district
        else if (currentUser.role === 'district_admin') {
            filter.role = 'ds_user';
            filter.district = currentUser.district;
        }
        // DS Users cannot manage other users
        else {
            return res.status(403).json({ message: 'Not authorized to view subordinate users' });
        }

        const users = await User.find(filter)
            .select('username role district divisionalSecretariat fullName email isActive createdAt')
            .sort({ district: 1, divisionalSecretariat: 1, username: 1 });

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'VIEW_SUBORDINATE_USERS',
            details: { 
                count: users.length,
                purpose: 'password_management'
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching subordinate users:', error);
        res.status(500).json({ message: 'Error fetching subordinate users', error: error.message });
    }
};

// @desc    Update subordinate user password (Admin to subordinate)
// @route   PUT /api/users/:id/reset-password
// @access  Private (SuperAdmin and DistrictAdmin only)
const updateSubordinatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const currentUser = req.user;

        // Validate input
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Cannot reset own password through this endpoint
        if (id === currentUser._id.toString()) {
            return res.status(400).json({ message: 'Use change-password endpoint to update your own password' });
        }

        // Get user to update
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Permission check - SuperAdmin can reset district_admin passwords
        if (currentUser.role === 'superadmin') {
            if (userToUpdate.role !== 'district_admin') {
                return res.status(403).json({ 
                    message: 'Super Admin can only reset District Admin passwords' 
                });
            }
        }
        // District Admin can reset DS user passwords in their district
        else if (currentUser.role === 'district_admin') {
            if (userToUpdate.role !== 'ds_user' || userToUpdate.district !== currentUser.district) {
                return res.status(403).json({ 
                    message: 'District Admin can only reset DS User passwords in their district' 
                });
            }
        }
        // DS Users cannot reset any passwords
        else {
            return res.status(403).json({ message: 'Not authorized to reset passwords' });
        }

        // Update password
        userToUpdate.password = newPassword; // Will be hashed by pre-save hook
        await userToUpdate.save();

        // Log activity
        await logActivity({
            userId: currentUser._id,
            username: currentUser.username,
            userRole: currentUser.role,
            action: 'RESET_SUBORDINATE_PASSWORD',
            targetType: 'User',
            targetId: userToUpdate._id,
            details: {
                targetUsername: userToUpdate.username,
                targetRole: userToUpdate.role,
                targetDistrict: userToUpdate.district,
                targetDS: userToUpdate.divisionalSecretariat
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            district: currentUser.district,
            divisionalSecretariat: currentUser.divisionalSecretariat
        });

        // Notify super admins about password reset (Phase 1)
        await notifySuperAdmins(
            'RESET_USER_PASSWORD',
            {
                relatedUserId: userToUpdate._id,
                details: {
                    resetBy: currentUser.username,
                    resetByRole: currentUser.role,
                    targetUsername: userToUpdate.username,
                    targetRole: userToUpdate.role,
                    targetDistrict: userToUpdate.district
                }
            },
            currentUser,
            'medium',
            'security'
        );

        res.json({ 
            message: 'Password reset successfully',
            username: userToUpdate.username
        });
    } catch (error) {
        console.error('Error resetting subordinate password:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getActivityLogs,
    changeOwnPassword,
    getUsersUnderAuthority,
    updateSubordinatePassword
};
