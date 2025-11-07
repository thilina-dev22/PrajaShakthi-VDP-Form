// PrajaShakthi-VDP-Form-frontend/src/components/NotificationsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

const NotificationsPage = () => {
    const { isSuperAdmin, isDistrictAdmin } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [actionFilter, setActionFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [expandedNotifications, setExpandedNotifications] = useState(new Set());

    // Can view notifications if Super Admin or District Admin
    const canViewNotifications = isSuperAdmin || isDistrictAdmin;

    // Toggle expanded state for a notification
    const toggleExpanded = (notificationId) => {
        setExpandedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });
    };

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const unreadOnly = filter === 'unread';
            const params = new URLSearchParams({
                limit: '100',
                unreadOnly: unreadOnly.toString()
            });
            
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (priorityFilter !== 'all') params.append('priority', priorityFilter);
            if (actionFilter !== 'all') params.append('action', actionFilter);
            
            const response = await axios.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}?${params.toString()}`, {
                withCredentials: true
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [filter, categoryFilter, priorityFilter, actionFilter]);

    useEffect(() => {
        if (canViewNotifications) {
            fetchNotifications();
        }
    }, [filter, categoryFilter, priorityFilter, actionFilter, canViewNotifications, fetchNotifications]);

    // Redirect if not super admin or district admin
    if (!canViewNotifications) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="mt-2 text-gray-600">Only Super Admins and District Admins can view notifications.</p>
            </div>
        );
    }

    // Mark as read
    const markAsRead = async (notificationId) => {
        try {
            await axios.put(API_ENDPOINTS.NOTIFICATIONS.READ(notificationId), {}, {
                withCredentials: true
            });
            
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await axios.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {}, {
                withCredentials: true
            });
            
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;
        
        try {
            await axios.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId), {
                withCredentials: true
            });
            
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Download activity logs
    const downloadActivityLogs = async (includeOldLogs = false) => {
        try {
            const params = new URLSearchParams({
                includeOldLogs: includeOldLogs.toString()
            });
            
            const response = await axios.get(`${API_ENDPOINTS.ACTIVITY_LOGS.EXPORT}?${params.toString()}`, {
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
        } catch (error) {
            console.error('Error downloading activity logs:', error);
            alert('Failed to download activity logs. Please try again.');
        }
    };

    // Clear all read notifications
    const clearReadNotifications = async () => {
        if (!confirm('Are you sure you want to clear all read notifications?')) return;
        
        try {
            await axios.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_READ, {
                withCredentials: true
            });
            
            setNotifications(prev => prev.filter(n => !n.isRead));
            
            // Refresh notifications from server
            await fetchNotifications();
        } catch (error) {
            console.error('Error clearing read notifications:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to clear notifications: ' + (error.response?.data?.message || error.message));
        }
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get priority badge color
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Get category badge color
    const getCategoryBadgeColor = (category) => {
        switch (category) {
            case 'submission':
                return 'bg-green-100 text-green-800';
            case 'user':
                return 'bg-purple-100 text-purple-800';
            case 'security':
                return 'bg-red-100 text-red-800';
            case 'system':
                return 'bg-indigo-100 text-indigo-800';
            case 'export':
                return 'bg-cyan-100 text-cyan-800';
            case 'summary':
                return 'bg-teal-100 text-teal-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action badge color
    const getActionBadgeColor = (action) => {
        switch (action) {
            // Submission actions
            case 'CREATE_SUBMISSION':
                return 'bg-green-100 text-green-800';
            case 'UPDATE_SUBMISSION':
                return 'bg-blue-100 text-blue-800';
            case 'DELETE_SUBMISSION':
                return 'bg-red-100 text-red-800';
            
            // User management actions
            case 'CREATE_USER':
                return 'bg-purple-100 text-purple-800';
            case 'UPDATE_USER':
                return 'bg-purple-100 text-purple-800';
            case 'DELETE_USER':
                return 'bg-red-100 text-red-800';
            case 'ACTIVATE_USER':
                return 'bg-green-100 text-green-800';
            case 'DEACTIVATE_USER':
                return 'bg-orange-100 text-orange-800';
            
            // Security actions
            case 'FAILED_LOGIN':
                return 'bg-red-100 text-red-800';
            case 'MULTIPLE_EDITS':
                return 'bg-orange-100 text-orange-800';
            case 'CRITICAL_FIELD_CHANGE':
                return 'bg-red-100 text-red-800';
            case 'DUPLICATE_NIC':
                return 'bg-orange-100 text-orange-800';
            case 'DATA_ANOMALY':
                return 'bg-yellow-100 text-yellow-800';
            
            // Summary actions
            case 'DAILY_SUMMARY':
                return 'bg-teal-100 text-teal-800';
            case 'WEEKLY_SUMMARY':
                return 'bg-teal-100 text-teal-800';
            case 'MONTHLY_SUMMARY':
                return 'bg-teal-100 text-teal-800';
            case 'QUARTERLY_REPORT':
                return 'bg-teal-100 text-teal-800';
            
            // System actions
            case 'INACTIVE_USER_ALERT':
                return 'bg-orange-100 text-orange-800';
            case 'MILESTONE_REACHED':
                return 'bg-green-100 text-green-800';
            case 'LOG_DELETION_REMINDER':
                return 'bg-yellow-100 text-yellow-800';
            case 'SYSTEM_CLEANUP':
                return 'bg-blue-100 text-blue-800';
            
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action label
    const getActionLabel = (action) => {
        switch (action) {
            // Submission actions
            case 'CREATE_SUBMISSION':
                return 'Created';
            case 'UPDATE_SUBMISSION':
                return 'Updated';
            case 'DELETE_SUBMISSION':
                return 'Deleted';
            
            // User management
            case 'CREATE_USER':
                return 'User Created';
            case 'UPDATE_USER':
                return 'User Updated';
            case 'DELETE_USER':
                return 'User Deleted';
            case 'ACTIVATE_USER':
                return 'User Activated';
            case 'DEACTIVATE_USER':
                return 'User Deactivated';
            
            // Security
            case 'FAILED_LOGIN':
                return 'Failed Login';
            case 'MULTIPLE_EDITS':
                return 'Multiple Edits';
            case 'CRITICAL_FIELD_CHANGE':
                return 'Critical Change';
            case 'DUPLICATE_NIC':
                return 'Duplicate NIC';
            case 'DATA_ANOMALY':
                return 'Data Anomaly';
            
            // Summary
            case 'DAILY_SUMMARY':
                return 'Daily Summary';
            case 'WEEKLY_SUMMARY':
                return 'Weekly Summary';
            case 'MONTHLY_SUMMARY':
                return 'Monthly Summary';
            case 'QUARTERLY_REPORT':
                return 'Quarterly Report';
            
            // System
            case 'INACTIVE_USER_ALERT':
                return 'Inactive User';
            case 'MILESTONE_REACHED':
                return 'Milestone';
            case 'LOG_DELETION_REMINDER':
                return 'Log Cleanup Warning';
            case 'SYSTEM_CLEANUP':
                return 'System Cleanup';
            
            default:
                return action.replace(/_/g, ' ');
        }
    };

    // Get action icon
    const getActionIcon = (action, category) => {
        // Category-based icons
        switch (category) {
            case 'submission':
                return '📝';
            case 'user':
                return '👤';
            case 'security':
                return '🔒';
            case 'system':
                return '⚙️';
            case 'export':
                return '📊';
            case 'summary':
                return '📈';
            default:
                break;
        }
        
        // Action-specific icons
        switch (action) {
            case 'CREATE_SUBMISSION':
            case 'CREATE_USER':
                return '➕';
            case 'UPDATE_SUBMISSION':
            case 'UPDATE_USER':
                return '✏️';
            case 'DELETE_SUBMISSION':
            case 'DELETE_USER':
                return '🗑️';
            case 'ACTIVATE_USER':
                return '✅';
            case 'DEACTIVATE_USER':
                return '⏸️';
            case 'FAILED_LOGIN':
                return '🔐';
            case 'MULTIPLE_EDITS':
            case 'CRITICAL_FIELD_CHANGE':
                return '⚡';
            case 'DUPLICATE_NIC':
            case 'DATA_ANOMALY':
                return '⚠️';
            case 'DAILY_SUMMARY':
            case 'WEEKLY_SUMMARY':
            case 'MONTHLY_SUMMARY':
            case 'QUARTERLY_REPORT':
                return '📊';
            case 'INACTIVE_USER_ALERT':
                return '💤';
            case 'MILESTONE_REACHED':
                return '🎉';
            case 'LOG_DELETION_REMINDER':
                return '⚠️';
            case 'SYSTEM_CLEANUP':
                return '🧹';
            default:
                return '📄';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-sm sm:text-base text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                filter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                filter === 'unread' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                filter === 'read' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Read
                        </button>
                    </div>

                    {/* Dropdown Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        >
                            <option value="all">All Categories</option>
                            <option value="submission">📝 Submissions</option>
                            <option value="user">👤 Users</option>
                            <option value="security">🔒 Security</option>
                            <option value="system">⚙️ System</option>
                            <option value="summary">📈 Summaries</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">🔴 Critical</option>
                            <option value="high">🟠 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🔵 Low</option>
                        </select>

                        {/* Action Filter */}
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base sm:col-span-2 lg:col-span-1"
                        >
                            <option value="all">All Actions</option>
                            <optgroup label="Submissions">
                                <option value="CREATE_SUBMISSION">Created</option>
                                <option value="UPDATE_SUBMISSION">Updated</option>
                                <option value="DELETE_SUBMISSION">Deleted</option>
                            </optgroup>
                            <optgroup label="Users">
                                <option value="CREATE_USER">User Created</option>
                                <option value="UPDATE_USER">User Updated</option>
                                <option value="DELETE_USER">User Deleted</option>
                                <option value="ACTIVATE_USER">User Activated</option>
                                <option value="DEACTIVATE_USER">User Deactivated</option>
                            </optgroup>
                            <optgroup label="Security">
                                <option value="FAILED_LOGIN">Failed Login</option>
                                <option value="MULTIPLE_EDITS">Multiple Edits</option>
                                <option value="CRITICAL_FIELD_CHANGE">Critical Change</option>
                                <option value="DUPLICATE_NIC">Duplicate NIC</option>
                            </optgroup>
                            <optgroup label="Summaries">
                                <option value="DAILY_SUMMARY">Daily Summary</option>
                                <option value="WEEKLY_SUMMARY">Weekly Summary</option>
                                <option value="MONTHLY_SUMMARY">Monthly Summary</option>
                            </optgroup>
                            <optgroup label="System">
                                <option value="INACTIVE_USER_ALERT">Inactive User</option>
                                <option value="MILESTONE_REACHED">Milestone</option>
                                <option value="LOG_DELETION_REMINDER">Log Cleanup Warning</option>
                                <option value="SYSTEM_CLEANUP">System Cleanup</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                            >
                                Mark All Read
                            </button>
                        )}
                        {notifications.some(n => n.isRead) && (
                            <button
                                onClick={clearReadNotifications}
                                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                                Clear Read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-600 text-lg">No notifications found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {filter === 'unread' && 'All notifications have been read'}
                            {filter === 'read' && 'No read notifications'}
                            {filter === 'all' && (categoryFilter !== 'all' || priorityFilter !== 'all' || actionFilter !== 'all') && 'No notifications match your filters'}
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const isExpanded = expandedNotifications.has(notification._id);
                        const hasDetailedChanges = notification.action === 'UPDATE_SUBMISSION' && 
                                                   notification.details?.detailedChanges && 
                                                   notification.details.detailedChanges.length > 0;
                        
                        return (
                        <div
                            key={notification._id}
                            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
                                !notification.isRead ? 'border-l-4 border-blue-600' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        {/* Icon */}
                                        <span className="text-2xl">
                                            {getActionIcon(notification.action, notification.category)}
                                        </span>
                                        
                                        {/* Action Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(notification.action)}`}>
                                            {getActionLabel(notification.action)}
                                        </span>
                                        
                                        {/* Category Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(notification.category)}`}>
                                            {notification.category?.toUpperCase() || 'SYSTEM'}
                                        </span>
                                        
                                        {/* Priority Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadgeColor(notification.priority)}`}>
                                            {notification.priority === 'critical' && '🔴 '}
                                            {notification.priority === 'high' && '🟠 '}
                                            {notification.priority === 'medium' && '🟡 '}
                                            {notification.priority === 'low' && '🔵 '}
                                            {notification.priority?.toUpperCase() || 'MEDIUM'}
                                        </span>
                                        
                                        {/* Timestamp */}
                                        <span className="text-gray-500 text-sm">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                        
                                        {/* Unread Badge */}
                                        {!notification.isRead && (
                                            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <p className="text-gray-900 text-lg mb-2">
                                        {notification.message}
                                    </p>

                                    {/* Details */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        {notification.details?.district && (
                                            <span>📍 {notification.details.district}</span>
                                        )}
                                        {notification.details?.dsDivision && (
                                            <span>• {notification.details.dsDivision}</span>
                                        )}
                                        {notification.details?.gnDivision && (
                                            <span>• {notification.details.gnDivision}</span>
                                        )}
                                        {notification.details?.formType && (
                                            <span>📋 {notification.details.formType === 'council_info' ? 'CDC Form' : 'Development Plan'}</span>
                                        )}
                                        {notification.details?.username && (
                                            <span>👤 {notification.details.username}</span>
                                        )}
                                        {notification.details?.count !== undefined && (
                                            <span>📊 Count: {notification.details.count}</span>
                                        )}
                                        {notification.details?.ipAddress && (
                                            <span>🌐 {notification.details.ipAddress}</span>
                                        )}
                                        {notification.triggeredBy && (
                                            <span>
                                                👤 By: {notification.triggeredBy.fullName || notification.triggeredBy.username}
                                                {notification.triggeredBy.role && ` (${notification.triggeredBy.role})`}
                                            </span>
                                        )}
                                    </div>

                                    {/* Expandable Detailed Changes for UPDATE_SUBMISSION */}
                                    {hasDetailedChanges && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => toggleExpanded(notification._id)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                                            >
                                                <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
                                                {isExpanded ? 'Hide' : 'Show'} Detailed Changes ({notification.details.changeCount})
                                            </button>
                                            
                                            {isExpanded && (
                                                <div className="mt-3 space-y-2 animate-fadeIn">
                                                    {notification.details.detailedChanges.map((change, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className={`p-4 rounded-lg border-l-4 ${
                                                                change.category === 'location' 
                                                                    ? 'bg-blue-50 border-blue-500' 
                                                                    : 'bg-yellow-50 border-yellow-500'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <p className="font-semibold text-gray-800 text-sm">
                                                                            {change.field}
                                                                        </p>
                                                                        {change.category === 'location' && (
                                                                            <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                                                                                📍 Location
                                                                            </span>
                                                                        )}
                                                                        {change.category === 'member' && (
                                                                            <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                                                                                👤 Member
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm flex-wrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500 font-medium">From:</span>
                                                                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded font-mono text-sm border border-red-200">
                                                                                {change.oldValue || '(empty)'}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-gray-400 font-bold">→</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500 font-medium">To:</span>
                                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-mono text-sm border border-green-200">
                                                                                {change.newValue || '(empty)'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Old Changes Display (fallback for old notifications without detailedChanges) */}
                                    {!hasDetailedChanges && notification.details?.changes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Changes:</p>
                                            <p className="text-sm text-gray-700">{notification.details.changes}</p>
                                        </div>
                                    )}

                                    {/* Changes (for updates) */}
                                    {!hasDetailedChanges && notification.details?.changeCount !== undefined && notification.action === 'UPDATE_SUBMISSION' && (
                                        <div className="mt-3">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                                📝 {notification.details.changeCount} field{notification.details.changeCount !== 1 ? 's' : ''} updated
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Old/New Values */}
                                    {(notification.details?.oldValue || notification.details?.newValue) && (
                                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                            {notification.details.oldValue && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Old:</span> {notification.details.oldValue}
                                                </p>
                                            )}
                                            {notification.details.newValue && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">New:</span> {notification.details.newValue}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 ml-4">
                                    {/* Download button for log deletion reminders */}
                                    {notification.action === 'LOG_DELETION_REMINDER' && isSuperAdmin && (
                                        <button
                                            onClick={() => downloadActivityLogs(true)}
                                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
                                            title="Download logs before deletion"
                                        >
                                            <span>📥</span>
                                            <span>Download Old Logs</span>
                                        </button>
                                    )}
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
