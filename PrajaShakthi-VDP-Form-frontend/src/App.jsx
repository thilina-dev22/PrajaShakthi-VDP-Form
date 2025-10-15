import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// We create a new component so it can access the context from AuthProvider
function AppContent() {
  return (
    <>
      <Navigation />
      <div style={{ padding: '20px' }}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;