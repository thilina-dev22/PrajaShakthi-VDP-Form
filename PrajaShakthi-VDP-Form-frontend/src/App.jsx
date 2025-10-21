import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login';
import DevelopmentForm from './components/DevelopmentForm';
import CommunityCouncilForm from './components/CommunityCouncilForm';
import SubmissionList from './components/SubmissionList';
import { useAuth } from './context/AuthContext';

function App() {
  // Keep App focused on rendering the content; AuthProvider is applied in main.jsx
  return <AppContent />;
}

// AppContent handles simple client-side routing via local state
function AppContent() {
  // Make the public landing page the main Development form by default
  const [currentRoute, setCurrentRoute] = useState('development'); // 'development' | 'council' | 'login'
  const { isAdmin } = useAuth();

  // Admin-only view remains protected
  if (isAdmin) {
    return (
      <>
        <Navigation />
        <div className="p-4 sm:p-8">
          <SubmissionList />
        </div>
      </>
    );
  }

  // Public view (no login required). Optionally show Login screen when user clicks "Log in as admin".
  return (
    <>
      <Navigation setCurrentRoute={setCurrentRoute} />
      <div className="p-4 sm:p-8">
        {currentRoute === 'login' ? (
          <Login />
        ) : (
          <>
            {currentRoute === 'development' && <DevelopmentForm />}
            {currentRoute === 'council' && <CommunityCouncilForm />}
          </>
        )}
      </div>
    </>
  );
}

export default App;