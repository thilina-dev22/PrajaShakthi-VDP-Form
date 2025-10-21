import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SubmissionList from './SubmissionList';
import CommunityCouncilForm from './CommunityCouncilForm';
import DevelopmentForm from './DevelopmentForm';

const AppRoutes = () => {
  const { isAdmin } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('council'); // public landing defaults to Council Info

  if (isAdmin) {
    return <SubmissionList />;
  }

  switch (currentRoute) {
    case 'login':
      return <Login />;
    case 'council':
      return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
    case 'development':
      // Main Form is currently disabled; fall back to Council Info
      return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
    default:
      return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
  }
};

export default AppRoutes;