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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const handleNavClick = (route) => {
    setShowMobileMenu(false);
    setCurrentRoute(route);
  };

  return (
    <header className="bg-[#680921] text-white shadow-md w-full">
      <div className="p-4">
        {/* Desktop Layout - Single Row */}
        <div className="flex justify-between items-center">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PrajaShakthi Logo"
              className="h-10 sm:h-12 md:h-14 w-auto"
            />
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                CDC Data Collection Portal
              </h1>
            </div>
          </div>

          {/* Center: Desktop Navigation - Hidden on mobile */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center">
              {isDSUser && (
                <nav className="flex gap-2">
                  <button
                    onClick={() => handleNavClick("council")}
                    className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors text-sm whitespace-nowrap"
                  >
                    {t("nav.councilForm")}
                  </button>
                  <button
                    onClick={() => handleNavClick("submissions")}
                    className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors text-sm whitespace-nowrap"
                  >
                    {t("nav.mySubmissions")}
                  </button>
                </nav>
              )}

              {(isSuperAdmin || isDistrictAdmin) && (
                <nav className="flex gap-2">
                  <button
                    onClick={() => handleNavClick("submissions")}
                    className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors text-sm whitespace-nowrap"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleNavClick("users")}
                    className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors text-sm whitespace-nowrap"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => handleNavClick("logs")}
                    className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors text-sm whitespace-nowrap"
                  >
                    Activity Logs
                  </button>
                </nav>
              )}
            </div>
          )}

          {/* Right side: Hamburger (mobile), Language, Notification, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger Menu Button - Only show when authenticated on mobile */}
            {isAuthenticated && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showMobileMenu ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}

            {/* Notification Bell */}
            {isAuthenticated && <NotificationBell setCurrentRoute={setCurrentRoute} />}

            {/* Language Switcher - Only show for non-authenticated users and DS Users */}
            {(!isAuthenticated || isDSUser) && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                  {["si", "ta", "en"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors ${
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

            {/* Profile Dropdown - Only show when authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-2 sm:px-3 rounded-lg transition-colors"
                >
                  {/* User Icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 sm:h-6 sm:w-6" 
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
                  <span className="hidden md:inline text-sm">{user?.fullName || user?.username}</span>
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
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#A8234A] rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                          {(user?.fullName || user?.username)?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
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
                            <p className="text-xs sm:text-sm text-gray-900 font-medium truncate">{user.district}</p>
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
                            <p className="text-xs sm:text-sm text-gray-900 font-medium truncate">{user.divisionalSecretariat}</p>
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
            )}

            {/* Login button for non-authenticated users */}
            {!isAuthenticated && (
              <button
                onClick={() => setCurrentRoute("login")}
                className="bg-[#F37021] text-white font-semibold rounded px-3 sm:px-4 py-2 text-sm hover:bg-[#D65F1A] transition-colors"
              >
                {t("nav.loginAdmin")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && isAuthenticated && (
        <div className="lg:hidden border-t border-white/20 bg-[#680921]">
          <nav className="p-4 space-y-2">
            {isDSUser && (
              <>
                <button
                  onClick={() => handleNavClick("council")}
                  className="w-full text-left bg-transparent text-white border border-white rounded px-4 py-3 hover:bg-[#8B1C3D] transition-colors text-sm"
                >
                  {t("nav.councilForm")}
                </button>
                <button
                  onClick={() => handleNavClick("submissions")}
                  className="w-full text-left bg-transparent text-white border border-white rounded px-4 py-3 hover:bg-[#8B1C3D] transition-colors text-sm"
                >
                  {t("nav.mySubmissions")}
                </button>
              </>
            )}

            {(isSuperAdmin || isDistrictAdmin) && (
              <>
                <button
                  onClick={() => handleNavClick("submissions")}
                  className="w-full text-left bg-transparent text-white border border-white rounded px-4 py-3 hover:bg-[#8B1C3D] transition-colors text-sm"
                >
                  View Submissions
                </button>
                <button
                  onClick={() => handleNavClick("users")}
                  className="w-full text-left bg-transparent text-white border border-white rounded px-4 py-3 hover:bg-[#8B1C3D] transition-colors text-sm"
                >
                  User Management
                </button>
                <button
                  onClick={() => handleNavClick("logs")}
                  className="w-full text-left bg-transparent text-white border border-white rounded px-4 py-3 hover:bg-[#8B1C3D] transition-colors text-sm"
                >
                  Activity Logs
                </button>
              </>
            )}

            {/* Language Switcher for Mobile - DS Users only */}
            {isDSUser && (
              <div className="pt-2 border-t border-white/20">
                <p className="text-xs text-white/70 mb-2 px-2">Language</p>
                <div className="flex gap-2">
                  {["si", "ta", "en"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                        i18n.language === lang
                          ? "bg-white text-[#680921] font-semibold"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {getLanguageLabel(lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
