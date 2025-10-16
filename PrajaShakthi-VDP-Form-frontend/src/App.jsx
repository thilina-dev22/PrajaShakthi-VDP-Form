import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import DevelopmentForm from './components/DevelopmentForm';
import CommunityCouncilForm from './components/CommunityCouncilForm';
import SubmissionList from './components/SubmissionList';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// This component now handles the routing logic and state
function AppContent() {
  const [currentRoute, setCurrentRoute] = useState('council');
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  // Admin View
  if (isAdmin) {
    return (
      <>
        {/* Navigation for admin doesn't need routing controls */}
        <Navigation />
        <div className="p-4 sm:p-8">
          <SubmissionList />
        </div>
      </>
    );
  }

  // Regular User View
  return (
    <>
      {/* Pass the setCurrentRoute function to Navigation */}
      <Navigation setCurrentRoute={setCurrentRoute} />
      <div className="p-4 sm:p-8">
        {currentRoute === 'development' && <DevelopmentForm />}
        {currentRoute === 'council' && <CommunityCouncilForm />}
      </div>
    </>
  );
}

export default App;