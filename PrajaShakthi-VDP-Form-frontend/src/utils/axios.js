import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Token added to request:', config.url);
        } else {
            console.log('⚠️ No token found for request:', config.url);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.config.url);
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('❌ 401 Unauthorized - Clearing token and redirecting to login');
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
