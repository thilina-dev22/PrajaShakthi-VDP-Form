// PrajaShakthi-VDP-Form-frontend/src/App.jsx

import React from "react";
import "./App.css";
import DevelopmentForm from "./components/DevelopmentForm";
import SubmissionList from './components/SubmissionList';
import Login from "./components/Login"; // NEW
import { useAuth } from "./context/AuthContext"; // NEW

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Simple Header with Login/Logout status
  return (
    <header style={{ padding: '10px 40px', background: '#0056b3', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>PrajaShakthi VDP Form</h1>
      {isAuthenticated ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Logged in as: <strong>{user.username} ({user.role})</strong></span>
          <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
};

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  let content;

  if (!isAuthenticated) {
    // Not logged in: Show login page
    content = <Login />;
  } else if (isAdmin) {
    // Admin logged in: Show submission list
    content = <SubmissionList />;
  } else {
    // User logged in: Show development form
    content = <DevelopmentForm />;
  }

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        {content}
      </div>
    </>
  );
}

export default App;