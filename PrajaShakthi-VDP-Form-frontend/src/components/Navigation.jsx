import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ setCurrentRoute = () => {} }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isDevelopmentFormDisabled = false;

  return (
    <header className="bg-blue-700 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-md w-full">
      <h1 className="text-xl font-bold mb-4 sm:mb-0">PrajaShakthi VDP Form</h1>

      {/* Public and regular user navigation (hide for admin) */}
      {!isAdmin && (
        <nav className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0">
          <button
            onClick={() => setCurrentRoute('development')}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDevelopmentFormDisabled}
          >
            සංවර්ධන සැලැස්ම (Main Form)
          </button>
          <button
            onClick={() => setCurrentRoute('council')}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-blue-800"
          >
            ප්‍රජා සභා තොරතුරු (Council Info)
          </button>

          {/* Show login as admin for public users only */}
          {!isAuthenticated && (
            <button
              onClick={() => setCurrentRoute('login')}
              className="bg-yellow-500 text-blue-900 font-semibold rounded px-4 py-2 hover:bg-yellow-400"
            >
              Log in as admin
            </button>
          )}
        </nav>
      )}

      {/* Right side: user info & actions */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>
            Logged in as{' '}
            <strong className="font-semibold">
              {user ? `${user.username} (${user.role})` : ''}
            </strong>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;