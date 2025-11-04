import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

const Navigation = ({ setCurrentRoute = () => {} }) => {
  const {
    user,
    isAuthenticated,
    isSuperAdmin,
    isDistrictAdmin,
    isDSUser,
    logout,
  } = useAuth();
  const { t, i18n } = useTranslation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case "en":
        return "English";
      case "si":
        return "සිංහල";
      case "ta":
        return "தமிழ்";
      default:
        return "සිංහල";
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'district_admin':
        return 'District Admin';
      case 'ds_user':
        return 'DS User';
      default:
        return role;
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    setCurrentRoute("profile");
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  return (
    <header className="bg-[#680921] text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-md w-full">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <img
          src="/logo.png"
          alt="PrajaShakthi Logo"
          className="h-12 sm:h-14 w-auto"
        />
        {/* <h1 className="text-xl font-bold">PrajaShakthi VDP Form</h1> */}
      </div>

      {/* Navigation for different user roles */}
      {isDSUser && (
        <nav className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0">
          <button
            onClick={() => setCurrentRoute("council")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            {t("nav.councilForm")}
          </button>
          {/* <button
            onClick={() => setCurrentRoute("development")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            Development Form
          </button> */}
          <button
            onClick={() => setCurrentRoute("submissions")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            {t("nav.mySubmissions")}
          </button>
        </nav>
      )}

      {(isSuperAdmin || isDistrictAdmin) && (
        <nav className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0">
          <button
            onClick={() => setCurrentRoute("submissions")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            View Submissions
          </button>
          <button
            onClick={() => setCurrentRoute("users")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            User Management
          </button>
          <button
            onClick={() => setCurrentRoute("logs")}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            Activity Logs
          </button>
        </nav>
      )}

      {/* Public navigation */}
      {!isAuthenticated && (
        <nav className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0">
          <button
            onClick={() => setCurrentRoute("login")}
            className="bg-[#F37021] text-white font-semibold rounded px-4 py-2 hover:bg-[#D65F1A] transition-colors"
          >
            {t("nav.loginAdmin")}
          </button>
        </nav>
      )}

      {/* Language Switcher - Only show for non-authenticated users and DS Users */}
      {(!isAuthenticated || isDSUser) && (
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <div className="flex gap-1 bg-white/10 rounded-lg p-1">
            {["si", "ta", "en"].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-3 py-1 rounded transition-colors ${
                  i18n.language === lang
                    ? "bg-white text-[#680921] font-semibold"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {getLanguageLabel(lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Right side: user info & actions */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {/* Notification Bell for Super Admin */}
          <NotificationBell setCurrentRoute={setCurrentRoute} />
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              {/* User Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              <span className="hidden md:inline">{user?.fullName || user?.username}</span>
              {/* Dropdown Arrow */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-12 h-12 bg-[#A8234A] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(user?.fullName || user?.username)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.fullName || user?.username}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getRoleDisplay(user?.role)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  {user?.district && (
                    <div className="flex items-start gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">District</p>
                        <p className="text-sm text-gray-900 font-medium truncate">{user.district}</p>
                      </div>
                    </div>
                  )}
                  {user?.divisionalSecretariat && (
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Divisional Secretariat</p>
                        <p className="text-sm text-gray-900 font-medium truncate">{user.divisionalSecretariat}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
