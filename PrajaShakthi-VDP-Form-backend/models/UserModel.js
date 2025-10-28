// PrajaShakthi-VDP-Form-backend/models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'district_admin', 'ds_user'], // Three-tier hierarchy
        required: true
    },
    // For district_admin: the district they manage
    // For ds_user: the district they belong to
    district: {
        type: String,
        required: function() {
            return this.role === 'district_admin' || this.role === 'ds_user';
        }
    },
    // For ds_user: the divisional secretariat they manage
    divisionalSecretariat: {
        type: String,
        required: function() {
            return this.role === 'ds_user';
        }
    },
    // Reference to the user who created this account
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Full name or display name
    fullName: {
        type: String,
        trim: true
    },
    // Email for communication
    email: {
        type: String,
        trim: true
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;