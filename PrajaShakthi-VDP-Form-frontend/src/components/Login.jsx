// PrajaShakthi-VDP-Form-frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, authError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

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
        <div className="min-h-screen bg-gray-50">
            {/* Login Navbar */}
            <header className="bg-[#680921] text-white p-4 shadow-md w-full">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <img
                            src="/logo.png"
                            alt="CDC Logo"
                            className="h-12 sm:h-14 w-auto"
                        />
                        <h1 className="text-xl sm:text-2xl font-bold">CDC Data Collection Portal</h1>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2">
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
                </div>
            </header>

            {/* Login Form */}
            <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-[#A8234A] mb-8">{t('login.title')}</h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        {t('login.username')}:
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        {t('login.password')}:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-[#A8234A] focus:ring-2 focus:ring-[#F37021]/20"
                        required
                    />
                </div>
                {authError && <p className="text-red-500 text-center text-xs italic mb-4">{authError}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-[#F37021] hover:bg-[#D65F1A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {loading ? t('login.loggingIn') : t('login.loginButton')}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default Login;