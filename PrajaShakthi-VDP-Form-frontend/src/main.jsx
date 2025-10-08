// PrajaShakthi-VDP-Form-frontend/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'; // NEW

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap App with AuthProvider */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>,
)