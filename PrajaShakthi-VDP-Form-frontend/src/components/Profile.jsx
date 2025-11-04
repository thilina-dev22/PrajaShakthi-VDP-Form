// PrajaShakthi-VDP-Form-frontend/src/components/Profile.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Normalize API base URL to avoid double slashes when joining paths
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const Profile = () => {
    const { user } = useAuth();
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirm password do not match');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await axios.put(`${API_URL}/api/auth/reset-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                withCredentials: true
            });

            setSuccess('Password reset successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordReset(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    const getRoleDisplay = (role) => {
        switch (role) {
            case 'superadmin':
                return 'Super Admin';
            case 'district_admin':
                return 'District Admin';
            case 'ds_user':
                return 'DS User';
            default:
                return role;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#A8234A] mb-6">My Profile</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Profile Information Card */}
                <div className="bg-white shadow-md rounded-lg px-8 py-6 mb-6">
                    <h3 className="text-xl font-bold text-[#680921] mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Username</label>
                            <p className="text-gray-800 font-medium">{user?.username}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Role</label>
                            <p className="text-gray-800 font-medium">{getRoleDisplay(user?.role)}</p>
                        </div>
                        {user?.fullName && (
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Full Name</label>
                                <p className="text-gray-800 font-medium">{user.fullName}</p>
                            </div>
                        )}
                        {user?.email && (
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
                                <p className="text-gray-800 font-medium">{user.email}</p>
                            </div>
                        )}
                        {user?.district && (
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">District</label>
                                <p className="text-gray-800 font-medium">{user.district}</p>
                            </div>
                        )}
                        {user?.divisionalSecretariat && (
                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Divisional Secretariat</label>
                                <p className="text-gray-800 font-medium">{user.divisionalSecretariat}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Reset Section */}
                <div className="bg-white shadow-md rounded-lg px-8 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#680921]">Password Settings</h3>
                        {!showPasswordReset && (
                            <button
                                onClick={() => setShowPasswordReset(true)}
                                className="bg-[#F37021] text-white px-4 py-2 rounded hover:bg-[#d96520] transition"
                            >
                                Reset Password
                            </button>
                        )}
                    </div>

                    {showPasswordReset && (
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Current Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8234A]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        New Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8234A]"
                                    />
                                    <p className="text-gray-600 text-xs mt-1">Minimum 6 characters</p>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Confirm New Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8234A]"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#A8234A] text-white px-6 py-2 rounded hover:bg-[#8B1C3D] transition disabled:opacity-50"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordReset(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setError(null);
                                    }}
                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {!showPasswordReset && (
                        <p className="text-gray-600 text-sm">
                            Click the button above to reset your password
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
