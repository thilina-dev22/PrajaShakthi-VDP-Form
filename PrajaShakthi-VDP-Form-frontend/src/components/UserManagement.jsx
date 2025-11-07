// PrajaShakthi-VDP-Form-frontend/src/components/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import provincialData from '../data/provincial_data.json';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        district: '',
        divisionalSecretariat: ''
    });

    // Get districts from provincial data
    const [districts, setDistricts] = useState([]);
    const [dsDivisions, setDSDivisions] = useState([]);

    useEffect(() => {
        fetchUsers();
        loadDistricts();
    }, []);

    const loadDistricts = () => {
        try {
            const districtList = provincialData.flatMap(province => 
                province.districts.map(d => d.district)
            );
            setDistricts([...new Set(districtList)]);
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    };

    const loadDSDivisions = (selectedDistrict) => {
        try {
            for (const province of provincialData) {
                const district = province.districts.find(d => d.district === selectedDistrict);
                if (district) {
                    setDSDivisions(district.ds_divisions.map(ds => ds.ds_division_name));
                    break;
                }
            }
        } catch (error) {
            console.error('Error loading DS divisions:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.USERS.BASE, {
                withCredentials: true
            });
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'district') {
            loadDSDivisions(value);
            setFormData(prev => ({ ...prev, divisionalSecretariat: '' }));
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userData = {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email,
                role: user.role === 'superadmin' ? 'district_admin' : 'ds_user',
                district: formData.district,
                divisionalSecretariat: user.role === 'district_admin' ? formData.divisionalSecretariat : undefined
            };

            await axios.post(API_ENDPOINTS.USERS.BASE, userData, {
                withCredentials: true
            });

            setShowCreateForm(false);
            setFormData({
                username: '',
                password: '',
                fullName: '',
                email: '',
                district: '',
                divisionalSecretariat: ''
            });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await axios.put(API_ENDPOINTS.USERS.BY_ID(userId), {
                isActive: !currentStatus
            }, {
                withCredentials: true
            });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(API_ENDPOINTS.USERS.BY_ID(userId), {
                withCredentials: true
            });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting user');
        }
    };

    const handleResetUserPassword = async (userId, username) => {
        const password = prompt(`Enter new password for ${username}:`);
        if (!password) return;

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            await axios.put(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), {
                newPassword: password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setSuccess(`Password reset successfully for ${username}`);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            console.error('Password reset error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error resetting password';
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#A8234A]">
                    {user.role === 'superadmin' ? 'District Admin Management' : 'DS User Management'}
                </h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-[#F37021] text-white px-4 sm:px-6 py-2 rounded hover:bg-[#d96520] transition text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
                >
                    {showCreateForm ? 'Cancel' : `Create ${user.role === 'superadmin' ? 'District Admin' : 'DS User'}`}
                </button>
            </div>

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

            {showCreateForm && (
                <div className="bg-white shadow-md rounded px-8 py-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Create New User</h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    District *
                                </label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    required
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                >
                                    <option value="">Select District</option>
                                    {user.role === 'superadmin' ? (
                                        districts.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))
                                    ) : (
                                        <option value={user.district}>{user.district}</option>
                                    )}
                                </select>
                            </div>
                            {user.role === 'district_admin' && (
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Divisional Secretariat *
                                    </label>
                                    <select
                                        name="divisionalSecretariat"
                                        value={formData.divisionalSecretariat}
                                        onChange={handleInputChange}
                                        required
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                    >
                                        <option value="">Select DS Division</option>
                                        {dsDivisions.map(ds => (
                                            <option key={ds} value={ds}>{ds}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#A8234A] text-white px-6 py-2 rounded hover:bg-[#8B1C3D] transition disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-md rounded overflow-hidden">
                {/* Horizontal scroll wrapper for mobile */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#680921] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left whitespace-nowrap">Username</th>
                                <th className="py-3 px-4 text-left whitespace-nowrap">Full Name</th>
                                <th className="py-3 px-4 text-left whitespace-nowrap">District</th>
                                {user.role === 'district_admin' && (
                                    <th className="py-3 px-4 text-left whitespace-nowrap">DS Division</th>
                                )}
                                <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
                                <th className="py-3 px-4 text-left whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No users found</td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 whitespace-nowrap">{u.username}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{u.fullName || '-'}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{u.district}</td>
                                        {user.role === 'district_admin' && (
                                            <td className="py-3 px-4 whitespace-nowrap">{u.divisionalSecretariat || '-'}</td>
                                        )}
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs ${u.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleActive(u._id, u.isActive)}
                                                className="text-blue-600 hover:underline mr-3"
                                            >
                                                {u.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleResetUserPassword(u._id, u.username)}
                                                className="text-[#F37021] hover:underline mr-3"
                                            >
                                                Reset Password
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
