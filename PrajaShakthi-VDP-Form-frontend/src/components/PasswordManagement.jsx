import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Base API URL: in production set VITE_API_BASE_URL to your backend URL; in dev falls back to relative paths (Vite proxy)
const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL)
    : "").replace(/\/$/, "");

// LocalStorage key for Bearer token (same as auth.js)
const TOKEN_KEY = "ps_token";

const PasswordManagement = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('own');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [subordinates, setSubordinates] = useState([]);

    // Own password change state
    const [ownPasswordData, setOwnPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Subordinate password reset state
    const [selectedUser, setSelectedUser] = useState(null);
    const [resetPasswordData, setResetPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Force English language for admins
        if (user && (user.role === 'superadmin' || user.role === 'district_admin')) {
            if (i18n.language !== 'en') {
                i18n.changeLanguage('en');
            }
            fetchSubordinates();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Ensure language stays in English for admins
    useEffect(() => {
        if (user && (user.role === 'superadmin' || user.role === 'district_admin') && i18n.language !== 'en') {
            i18n.changeLanguage('en');
        }
    }, [user, i18n, i18n.language]);

    const fetchSubordinates = async () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await axios.get(
                `${API_BASE}/api/users/subordinates`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Ensure we always set an array
            if (Array.isArray(response.data)) {
                setSubordinates(response.data);
            } else {
                console.error('Subordinates response is not an array:', response.data);
                setSubordinates([]);
            }
        } catch (err) {
            console.error('Error fetching subordinates:', err);
            setSubordinates([]); // Set to empty array on error
        }
    };

    const handleOwnPasswordChange = (e) => {
        setOwnPasswordData({
            ...ownPasswordData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleResetPasswordChange = (e) => {
        setResetPasswordData({
            ...resetPasswordData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const submitOwnPasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!ownPasswordData.currentPassword || !ownPasswordData.newPassword || !ownPasswordData.confirmPassword) {
            setError(t('passwordManagement.allFieldsRequired'));
            return;
        }

        if (ownPasswordData.newPassword.length < 6) {
            setError(t('passwordManagement.passwordMinLength'));
            return;
        }

        if (ownPasswordData.newPassword !== ownPasswordData.confirmPassword) {
            setError(t('passwordManagement.passwordMismatch'));
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            await axios.put(
                `${API_BASE}/api/users/change-password`,
                {
                    currentPassword: ownPasswordData.currentPassword,
                    newPassword: ownPasswordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(t('passwordManagement.ownPasswordSuccess'));
            setOwnPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || t('passwordManagement.error'));
        } finally {
            setLoading(false);
        }
    };

    const submitSubordinatePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedUser) {
            setError(t('passwordManagement.selectUser'));
            return;
        }

        if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
            setError(t('passwordManagement.allFieldsRequired'));
            return;
        }

        if (resetPasswordData.newPassword.length < 6) {
            setError(t('passwordManagement.passwordMinLength'));
            return;
        }

        if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            setError(t('passwordManagement.passwordMismatch'));
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            await axios.put(
                `${API_BASE}/api/users/${selectedUser._id}/reset-password`,
                {
                    newPassword: resetPasswordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(t('passwordManagement.subordinatePasswordSuccess', { username: selectedUser.username }));
            setResetPasswordData({
                newPassword: '',
                confirmPassword: ''
            });
            setSelectedUser(null);
        } catch (err) {
            setError(err.response?.data?.message || t('passwordManagement.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {t('passwordManagement.title')}
                </h1>

                {/* Tab Navigation */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('own')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                                    activeTab === 'own'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {t('passwordManagement.changeOwnPassword')}
                            </button>
                            {(user?.role === 'superadmin' || user?.role === 'district_admin') && (
                                <button
                                    onClick={() => setActiveTab('subordinates')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                                        activeTab === 'subordinates'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {t('passwordManagement.manageSubordinates')}
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Error and Success Messages */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{success}</span>
                            </div>
                        )}

                        {/* Own Password Change Tab */}
                        {activeTab === 'own' && (
                            <form onSubmit={submitOwnPasswordChange}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('passwordManagement.currentPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={ownPasswordData.currentPassword}
                                            onChange={handleOwnPasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('passwordManagement.newPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={ownPasswordData.newPassword}
                                            onChange={handleOwnPasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            {t('passwordManagement.passwordRequirement')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('passwordManagement.confirmPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={ownPasswordData.confirmPassword}
                                            onChange={handleOwnPasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {loading ? t('passwordManagement.updating') : t('passwordManagement.updatePassword')}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Subordinate Password Reset Tab */}
                        {activeTab === 'subordinates' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('passwordManagement.selectUserToReset')}
                                    </label>
                                    <select
                                        value={selectedUser?._id || ''}
                                        onChange={(e) => {
                                            const user = subordinates.find(u => u._id === e.target.value);
                                            setSelectedUser(user || null);
                                            setError('');
                                            setSuccess('');
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">{t('passwordManagement.selectUser')}</option>
                                        {Array.isArray(subordinates) && subordinates.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.username} - {user.role === 'district_admin' ? t('roles.districtAdmin') : t('roles.dsUser')}
                                                {user.district && ` - ${user.district}`}
                                                {user.divisionalSecretariat && ` - ${user.divisionalSecretariat}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedUser && (
                                    <form onSubmit={submitSubordinatePasswordReset}>
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <h3 className="font-medium text-gray-900 mb-2">
                                                {t('passwordManagement.selectedUser')}
                                            </h3>
                                            <dl className="grid grid-cols-2 gap-2 text-sm">
                                                <dt className="text-gray-600">{t('passwordManagement.username')}:</dt>
                                                <dd className="font-medium">{selectedUser.username}</dd>
                                                <dt className="text-gray-600">{t('passwordManagement.role')}:</dt>
                                                <dd className="font-medium">
                                                    {selectedUser.role === 'district_admin' ? t('roles.districtAdmin') : t('roles.dsUser')}
                                                </dd>
                                                {selectedUser.district && (
                                                    <>
                                                        <dt className="text-gray-600">{t('passwordManagement.district')}:</dt>
                                                        <dd className="font-medium">{selectedUser.district}</dd>
                                                    </>
                                                )}
                                                {selectedUser.divisionalSecretariat && (
                                                    <>
                                                        <dt className="text-gray-600">{t('passwordManagement.dsOffice')}:</dt>
                                                        <dd className="font-medium">{selectedUser.divisionalSecretariat}</dd>
                                                    </>
                                                )}
                                            </dl>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('passwordManagement.newPassword')}
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={resetPasswordData.newPassword}
                                                    onChange={handleResetPasswordChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {t('passwordManagement.passwordRequirement')}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('passwordManagement.confirmPassword')}
                                                </label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={resetPasswordData.confirmPassword}
                                                    onChange={handleResetPasswordChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                            >
                                                {loading ? t('passwordManagement.resetting') : t('passwordManagement.resetPassword')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">
                        {t('passwordManagement.securityTips')}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        <li>{t('passwordManagement.tip1')}</li>
                        <li>{t('passwordManagement.tip2')}</li>
                        <li>{t('passwordManagement.tip3')}</li>
                        {(user?.role === 'superadmin' || user?.role === 'district_admin') && (
                            <li>{t('passwordManagement.tip4')}</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PasswordManagement;
