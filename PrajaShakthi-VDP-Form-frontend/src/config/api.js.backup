// PrajaShakthi-VDP-Form-frontend/src/config/api.js
// Centralized API configuration for all components

/**
 * API Base URL Configuration
 * 
 * This is the single source of truth for all API endpoints.
 * 
 * For Development:
 * - Defaults to http://localhost:5000
 * 
 * For Production (Vercel/Cloud Server):
 * - Set VITE_API_URL environment variable to your backend URL
 * - Example: https://your-backend-server.com
 * - NO trailing slash!
 * 
 * For Private Cloud/VM Deployment:
 * - Set VITE_API_URL to your VM's backend URL
 * - Example: http://192.168.1.100:5000
 * - Or: https://yourcompany.internal/api
 */

// Normalize API base URL to avoid double slashes
export const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL)
    : "http://localhost:5000").replace(/\/+$/, '');

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

// Debug logging in development
if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:');
    console.log('  Base URL:', API_BASE_URL);
    console.log('  Environment:', import.meta.env.MODE);
}

// Export the base URL for backward compatibility
export default API_BASE_URL;
