// PrajaShakthi-VDP-Form-frontend/src/config/api.js
// Centralized API configuration for all components

/**
 * API Base URL Configuration
 * 
 * For VM Deployment: Uses http://192.168.4.7 (your VM IP)
 */

// Use window.location.origin so it works with both IP and domain
export const API_BASE_URL = window.location.origin;

// API endpoint paths
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        STATUS: `${API_BASE_URL}/api/auth/status`,
        RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    },
    
    // User management endpoints
    USERS: {
        BASE: `${API_BASE_URL}/api/users`,
        BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
        RESET_PASSWORD: (id) => `${API_BASE_URL}/api/users/${id}/reset-password`,
        LOGS: `${API_BASE_URL}/api/users/logs`,
    },
    
    // Submission endpoints
    SUBMISSIONS: {
        BASE: `${API_BASE_URL}/api/submissions`,
        BY_ID: (id) => `${API_BASE_URL}/api/submissions/${id}`,
    },
    
    // Notification endpoints
    NOTIFICATIONS: {
        BASE: `${API_BASE_URL}/api/notifications`,
        BY_ID: (id) => `${API_BASE_URL}/api/notifications/${id}`,
        READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
        UNREAD_COUNT: `${API_BASE_URL}/api/notifications/unread-count`,
        MARK_ALL_READ: `${API_BASE_URL}/api/notifications/mark-all-read`,
        CLEAR_READ: `${API_BASE_URL}/api/notifications/clear-read`,
    },
    
    // Activity log endpoints
    ACTIVITY_LOGS: {
        BASE: `${API_BASE_URL}/api/activity-logs`,
        EXPORT: `${API_BASE_URL}/api/activity-logs/export`,
    },
    
    // Health check
    HEALTH: `${API_BASE_URL}/api/health`,
};

// Export the base URL for backward compatibility
export default API_BASE_URL;
