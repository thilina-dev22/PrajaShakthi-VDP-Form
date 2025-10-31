// PrajaShakthi-VDP-Form-frontend/src/components/ActivityLogs.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Normalize API base URL to avoid double slashes when joining paths
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const ActivityLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        action: '',
        startDate: '',
        endDate: ''
    });

    // Check if user is Super Admin
    const isSuperAdmin = user?.role === 'superadmin';

    useEffect(() => {
        fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filters]);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50'
            });

            if (filters.action) params.append('action', filters.action);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await axios.get(`${API_URL}/api/users/logs?${params.toString()}`, {
                withCredentials: true
            });

            setLogs(response.data.logs);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page on filter change
    };

    // Download activity logs
    const downloadActivityLogs = async (includeOldLogs = false) => {
        try {
            const params = new URLSearchParams({
                includeOldLogs: includeOldLogs.toString()
            });
            
            // Add current filters if not downloading old logs
            if (!includeOldLogs) {
                if (filters.action) params.append('action', filters.action);
                if (filters.startDate) params.append('startDate', filters.startDate);
                if (filters.endDate) params.append('endDate', filters.endDate);
            }
            
            const response = await axios.get(`${API_URL}/api/activity-logs/export?${params.toString()}`, {
                withCredentials: true,
                responseType: 'blob' // Important for file download
            });
            
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `activity-logs-${includeOldLogs ? 'old-' : ''}${timestamp}.json`);
            
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert('Activity logs downloaded successfully!');
        } catch (err) {
            console.error('Error downloading activity logs:', err);
            alert('Failed to download activity logs. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getActionColor = (action) => {
        const colors = {
            'LOGIN': 'bg-green-100 text-green-800',
            'LOGOUT': 'bg-gray-100 text-gray-800',
            'CREATE_USER': 'bg-blue-100 text-blue-800',
            'UPDATE_USER': 'bg-yellow-100 text-yellow-800',
            'DELETE_USER': 'bg-red-100 text-red-800',
            'CREATE_SUBMISSION': 'bg-purple-100 text-purple-800',
            'UPDATE_SUBMISSION': 'bg-indigo-100 text-indigo-800',
            'DELETE_SUBMISSION': 'bg-red-100 text-red-800',
            'VIEW_SUBMISSIONS': 'bg-cyan-100 text-cyan-800',
            'VIEW_USERS': 'bg-teal-100 text-teal-800'
        };
        return colors[action] || 'bg-gray-100 text-gray-800';
    };

    const formatDetails = (action, details) => {
        if (!details) return '-';

        try {
            switch (action) {
                case 'LOGIN':
                case 'LOGOUT':
                    return '-';
                
                case 'CREATE_USER':
                    return `Created user: ${details.username || 'N/A'} (${details.role || 'N/A'})`;
                
                case 'UPDATE_USER':
                    return `Updated user: ${details.username || 'N/A'}`;
                
                case 'DELETE_USER':
                    return `Deleted user: ${details.username || 'N/A'}`;
                
                case 'CREATE_SUBMISSION':
                    return `Created ${details.formType === 'council_info' ? 'Council' : 'Development'} form for ${details.location?.gnDivision || 'N/A'}`;
                
                case 'UPDATE_SUBMISSION':
                    return `Updated ${details.formType === 'council_info' ? 'Council' : 'Development'} form for ${details.gnDivision || details.location?.gnDivision || 'N/A'}`;
                
                case 'DELETE_SUBMISSION':
                    return `Deleted submission: ${details.submissionId || 'N/A'}`;
                
                case 'VIEW_SUBMISSIONS': {
                    const filters = details.filters || {};
                    const count = details.count || 0;
                    const filterText = [];
                    if (filters.formType) filterText.push(`Type: ${filters.formType === 'council_info' ? 'Council' : 'Development'}`);
                    if (filters.district) filterText.push(`District: ${filters.district}`);
                    if (filters.divisionalSec) filterText.push(`DS: ${filters.divisionalSec}`);
                    if (filters.gnDivision) filterText.push(`GN: ${filters.gnDivision}`);
                    
                    return `Viewed ${count} submission${count !== 1 ? 's' : ''}${filterText.length > 0 ? ` (${filterText.join(', ')})` : ''}`;
                }
                
                case 'VIEW_USERS':
                    return `Viewed ${details.count || 0} user${details.count !== 1 ? 's' : ''}`;
                
                default: {
                    // For unknown actions, show a shortened version
                    const str = JSON.stringify(details);
                    return str.length > 50 ? str.substring(0, 47) + '...' : str;
                }
            }
        } catch {
            return '-';
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-[#A8234A] mb-6">Activity Logs</h2>

            {/* Filters */}
            <div className="bg-white shadow-md rounded px-6 py-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Action Type
                        </label>
                        <select
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        >
                            <option value="">All Actions</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                            <option value="CREATE_USER">Create User</option>
                            <option value="UPDATE_USER">Update User</option>
                            <option value="DELETE_USER">Delete User</option>
                            <option value="CREATE_SUBMISSION">Create Submission</option>
                            <option value="UPDATE_SUBMISSION">Update Submission</option>
                            <option value="DELETE_SUBMISSION">Delete Submission</option>
                            <option value="VIEW_SUBMISSIONS">View Submissions</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setFilters({ action: '', startDate: '', endDate: '' });
                                setPage(1);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition w-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Download Actions - Only for Super Admin */}
                {isSuperAdmin && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => downloadActivityLogs(false)}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
                            title="Download activity logs with current filters applied"
                        >
                            <span>📥</span>
                            <span>Download Logs</span>
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                            💡 Download logs in JSON format with current filters. Logs older than 1 month are automatically deleted.
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Logs Table */}
            <div className="bg-white shadow-md rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#680921] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Date/Time</th>
                                <th className="py-3 px-4 text-left">User</th>
                                <th className="py-3 px-4 text-left">Role</th>
                                <th className="py-3 px-4 text-left">Action</th>
                                {user.role === 'superadmin' && (
                                    <>
                                        <th className="py-3 px-4 text-left">District</th>
                                        <th className="py-3 px-4 text-left">DS Division</th>
                                    </>
                                )}
                                <th className="py-3 px-4 text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No logs found</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{formatDate(log.createdAt)}</td>
                                        <td className="py-3 px-4">{log.username}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                                                {log.userRole}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        {user.role === 'superadmin' && (
                                            <>
                                                <td className="py-3 px-4 text-sm">{log.district || '-'}</td>
                                                <td className="py-3 px-4 text-sm">{log.divisionalSecretariat || '-'}</td>
                                            </>
                                        )}
                                        <td className="py-3 px-4 text-sm">
                                            {formatDetails(log.action, log.details)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{page}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
