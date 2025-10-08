// PrajaShakthi-VDP-Form-frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Stores { _id, username, role }
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // This hook will rely on the server side to determine if logged in.
    useEffect(() => {
        // Since the HttpOnly cookie cannot be read by JavaScript, the frontend 
        // starts unauthenticated. It gains auth status only after a successful login API call.
        // For a smoother UX, a real app would have a simple /api/auth/status endpoint.
    }, []);

    const handleLogin = async (username, password) => {
        setLoading(true);
        setAuthError(null);
        try {
            const userData = await login(username, password);
            setUser(userData);
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setAuthError(null);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = !!user;
    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isAdmin,
            loading,
            authError,
            login: handleLogin,
            logout: handleLogout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);