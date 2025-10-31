// PrajaShakthi-VDP-Form-frontend/src/components/NotificationBell.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Normalize API base URL to avoid double slashes when joining paths
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const NotificationBell = ({ setCurrentRoute }) => {
    const { isSuperAdmin, isDistrictAdmin } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    // Show notification bell for Super Admins and District Admins
    const canViewNotifications = isSuperAdmin || isDistrictAdmin;

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/notifications/unread-count`, {
                withCredentials: true
            });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/notifications?limit=10`, {
                withCredentials: true
            });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark as read
    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${API_URL}/api/notifications/${notificationId}/read`, {}, {
                withCredentials: true
            });
            
            // Update local state
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
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
            
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Fetch count on mount and set up polling
    useEffect(() => {
        if (!canViewNotifications) return;
        
        fetchUnreadCount();
        
        // Poll every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        
        return () => clearInterval(interval);
    }, [canViewNotifications]);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (!canViewNotifications) return;
        
        if (showDropdown) {
            fetchNotifications();
        }
    }, [showDropdown, canViewNotifications]);

    // Only show for super admins and district admins
    if (!canViewNotifications) return null;

    // Format time ago
    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
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
            default:
                return '📄';
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    // Get category badge
    const getCategoryBadge = (category) => {
        const badges = {
            submission: '📝',
            user: '👤',
            security: '🔒',
            system: '⚙️',
            export: '📊',
            summary: '📈'
        };
        return badges[category] || '📄';
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Notifications"
            >
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>
                
                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start">
                                        {/* Icon and Priority Indicator */}
                                        <div className="flex flex-col items-center mr-3">
                                            <span className="text-2xl">{getActionIcon(notification.action, notification.category)}</span>
                                            {notification.priority === 'critical' && <span className="text-xs">🔴</span>}
                                            {notification.priority === 'high' && <span className="text-xs">🟠</span>}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            {/* Category Badge */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-gray-500 uppercase">
                                                    {getCategoryBadge(notification.category)} {notification.category || 'system'}
                                                </span>
                                                {notification.priority && (
                                                    <span className={`text-xs font-bold ${getPriorityColor(notification.priority)}`}>
                                                        {notification.priority.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Message */}
                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.message}
                                            </p>
                                            
                                            {/* Details */}
                                            {notification.details?.changes && (
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    {notification.details.changes}
                                                </p>
                                            )}
                                            {notification.details?.district && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    📍 {notification.details.district}
                                                </p>
                                            )}
                                            {notification.details?.count !== undefined && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    📊 Count: {notification.details.count}
                                                </p>
                                            )}
                                            
                                            {/* Footer */}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTimeAgo(notification.createdAt)}
                                                {notification.triggeredBy && ` • ${notification.triggeredBy.fullName || notification.triggeredBy.username}`}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 text-center">
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    if (setCurrentRoute) {
                                        setCurrentRoute('notifications');
                                    }
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
};

export default NotificationBell;
