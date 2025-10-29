import React from 'react';
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

      {/* Language Switcher */}
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

      {/* Right side: user info & actions */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {/* Notification Bell for Super Admin */}
          <NotificationBell setCurrentRoute={setCurrentRoute} />
          
          <div className="text-right">
            <div className="text-sm">{user?.fullName || user?.username}</div>
            <div className="text-xs opacity-75">
              {user?.role === "superadmin" && "Super Admin"}
              {user?.role === "district_admin" &&
                `District Admin - ${user?.district}`}
              {user?.role === "ds_user" &&
                `DS User - ${user?.divisionalSecretariat}`}
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            {t("nav.logout")}
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
