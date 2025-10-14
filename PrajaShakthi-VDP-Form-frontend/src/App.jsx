// PrajaShakthi-VDP-Form-frontend/src/App.jsx

import React, { useState } from "react"; // ADDED useState
import "./App.css";
import DevelopmentForm from "./components/DevelopmentForm";
import CommunityCouncilForm from "./components/CommunityCouncilForm"; // NEW IMPORT
import SubmissionList from './components/SubmissionList';
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

const Navigation = ({ setCurrentRoute, isAuthenticated, isAdmin, logout }) => (
  <header style={{ padding: '10px 40px', background: '#0056b3', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>PrajaShakthi VDP Form</h1>
    
    {isAuthenticated && !isAdmin && (
      <nav>
        <button onClick={() => setCurrentRoute('development')} style={{ background: 'none', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          සංවර්ධන සැලැස්ම (Main Form)
        </button>
        <button onClick={() => setCurrentRoute('council')} style={{ background: 'none', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          ප්‍රජා සභා තොරතුරු (Council Info)
        </button>
      </nav>
    )}
    
    {/* Login/Logout/User Info Section (Kept original logic) */}
    {isAuthenticated ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Logged in as: <strong>{useAuth().user.username} ({useAuth().user.role})</strong></span>
        <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    ) : (
      <span>Please log in</span>
    )}
  </header>
);

function App() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  // State to manage the current view for non-admin users
  const [currentRoute, setCurrentRoute] = useState('development');
  
  let content;

  if (!isAuthenticated) {
    // Not logged in: Show login page
    content = <Login />;
  } else if (isAdmin) {
    // Admin logged in: Show submission list
    content = <SubmissionList />;
  } else {
    // User logged in: Show form(s) based on route
    switch (currentRoute) {
      case 'council':
        content = <CommunityCouncilForm />;
        break;
      case 'development':
      default:
        content = <DevelopmentForm />;
    }
  }

  return (
    <>
      <Navigation 
        setCurrentRoute={setCurrentRoute} 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin}
        logout={logout}
      />
      <div style={{ padding: '20px' }}>
        {content}
      </div>
    </>
  );
}

export default App;