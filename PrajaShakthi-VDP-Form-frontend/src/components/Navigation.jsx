import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ setCurrentRoute }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isDevelopmentFormDisabled = true;

  return (
    <header className="bg-blue-700 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-md">
      <h1 className="text-xl font-bold mb-4 sm:mb-0">PrajaShakthi VDP Form</h1>

      {isAuthenticated && !isAdmin && (
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
        </nav>
      )}

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>
            Logged in as:{' '}
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
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
};

export default Navigation;