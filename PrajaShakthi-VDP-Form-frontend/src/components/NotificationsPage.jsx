// PrajaShakthi-VDP-Form-frontend/src/components/NotificationsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NotificationsPage = () => {
    const { isSuperAdmin } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [actionFilter, setActionFilter] = useState('all'); // 'all', 'CREATE_SUBMISSION', 'UPDATE_SUBMISSION', 'DELETE_SUBMISSION'

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const unreadOnly = filter === 'unread';
            const response = await axios.get(`${API_URL}/api/notifications?limit=100&unreadOnly=${unreadOnly}`, {
                withCredentials: true
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchNotifications();
        }
    }, [filter, isSuperAdmin, fetchNotifications]);

    // Redirect if not super admin
    if (!isSuperAdmin) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="mt-2 text-gray-600">Only super admins can view notifications.</p>
            </div>
        );
    }

    // Mark as read
    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${API_URL}/api/notifications/${notificationId}/read`, {}, {
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
            await axios.put(`${API_URL}/api/notifications/mark-all-read`, {}, {
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
            await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
                withCredentials: true
            });
            
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Clear all read notifications
    const clearReadNotifications = async () => {
        if (!confirm('Are you sure you want to clear all read notifications?')) return;
        
        try {
            await axios.delete(`${API_URL}/api/notifications/clear-read`, {
                withCredentials: true
            });
            
            setNotifications(prev => prev.filter(n => !n.isRead));
        } catch (error) {
            console.error('Error clearing read notifications:', error);
        }
    };

    // Filter notifications by action type
    const filteredNotifications = actionFilter === 'all' 
        ? notifications 
        : notifications.filter(n => n.action === actionFilter);

    // Filter by read status (client-side for 'read' filter)
    const displayNotifications = filter === 'read' 
        ? filteredNotifications.filter(n => n.isRead)
        : filteredNotifications;

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

    // Get action badge color
    const getActionBadgeColor = (action) => {
        switch (action) {
            case 'CREATE_SUBMISSION':
                return 'bg-green-100 text-green-800';
            case 'UPDATE_SUBMISSION':
                return 'bg-blue-100 text-blue-800';
            case 'DELETE_SUBMISSION':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action label
    const getActionLabel = (action) => {
        switch (action) {
            case 'CREATE_SUBMISSION':
                return 'Created';
            case 'UPDATE_SUBMISSION':
                return 'Updated';
            case 'DELETE_SUBMISSION':
                return 'Deleted';
            default:
                return action;
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'unread' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'read' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Read
                        </button>
                    </div>

                    {/* Action Filter */}
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Actions</option>
                        <option value="CREATE_SUBMISSION">Created</option>
                        <option value="UPDATE_SUBMISSION">Updated</option>
                        <option value="DELETE_SUBMISSION">Deleted</option>
                    </select>

                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Mark All Read
                            </button>
                        )}
                        {notifications.some(n => n.isRead) && (
                            <button
                                onClick={clearReadNotifications}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                ) : displayNotifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-600 text-lg">No notifications found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {filter === 'unread' && 'All notifications have been read'}
                            {filter === 'read' && 'No read notifications'}
                            {filter === 'all' && actionFilter !== 'all' && 'No notifications for this action type'}
                        </p>
                    </div>
                ) : (
                    displayNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
                                !notification.isRead ? 'border-l-4 border-blue-600' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(notification.action)}`}>
                                            {getActionLabel(notification.action)}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {formatDate(notification.createdAt)}
                                        </span>
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
                                        {notification.triggeredBy && (
                                            <span>
                                                👤 {notification.triggeredBy.fullName || notification.triggeredBy.username}
                                                {notification.triggeredBy.role && ` (${notification.triggeredBy.role})`}
                                            </span>
                                        )}
                                    </div>

                                    {/* Changes (for updates) */}
                                    {notification.details?.changes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Changes:</p>
                                            <p className="text-sm text-gray-700">{notification.details.changes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 ml-4">
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
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
