import React, { createContext, useState, useContext, useEffect } from 'react';
// ⭐ 1. Import the new checkAuthStatus function
import { login, logout, checkAuthStatus } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Stores { _id, username, role }
    const [user, setUser] = useState(null); 
    // ⭐ 2. Start in a loading state until the initial check is done
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // ⭐ 3. This hook now verifies the user's session on initial load
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const userData = await checkAuthStatus();
                // If the backend returns user data, it means we have a valid session
                if (userData) {
                    setUser(userData);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                // This is not a critical error, just means the user isn't logged in
                console.log("Not authenticated.");
                setUser(null);
            } finally {
                // The check is complete, so we are no longer loading
                setLoading(false);
            }
        };

        verifyUser();
    }, []); // Empty array ensures this runs only once when the app starts

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

    // Your existing derived state is perfect, no changes needed here
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
            {/* ⭐ 4. Don't render the app until the initial auth check is finished */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);