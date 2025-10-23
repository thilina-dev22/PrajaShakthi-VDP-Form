import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navigation = ({ setCurrentRoute = () => {} }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, i18n } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const isDevelopmentFormDisabled = true;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getLanguageLabel = (lang) => {
    switch(lang) {
      case 'en': return 'English';
      case 'si': return 'සිංහල';
      case 'ta': return 'தமிழ்';
      default: return 'සිංහල';
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

      {/* Public and regular user navigation (hide for admin) */}
      {!isAdmin && (
        <nav className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0">
          {/* <button
            onClick={() => setCurrentRoute('development')}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isDevelopmentFormDisabled}
          >
            සංවර්ධන සැලැස්ම (Main Form)
          </button> */}
          <button
            onClick={() => setCurrentRoute('council')}
            className="bg-transparent text-white border border-white rounded px-4 py-2 hover:bg-[#8B1C3D] transition-colors"
          >
            {t('nav.councilForm')}
          </button>

          {/* Show login as admin for public users only */}
          {!isAuthenticated && (
            <button
              onClick={() => setCurrentRoute('login')}
              className="bg-[#F37021] text-white font-semibold rounded px-4 py-2 hover:bg-[#D65F1A] transition-colors"
            >
              {t('nav.loginAdmin')}
            </button>
          )}
        </nav>
      )}

      {/* Language Switcher */}
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
          {['si', 'ta', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-3 py-1 rounded transition-colors ${
                i18n.language === lang
                  ? 'bg-white text-[#680921] font-semibold'
                  : 'text-white hover:bg-white/20'
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
          <span>
            {t('nav.loggedInAs')}{' '}
            <strong className="font-semibold">
              {user ? `${user.username} (${user.role})` : ''}
            </strong>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            {t('nav.logout')}
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;