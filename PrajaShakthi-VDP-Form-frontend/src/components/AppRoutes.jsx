import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SubmissionList from './SubmissionList';
import CommunityCouncilForm from './CommunityCouncilForm';
import DevelopmentForm from './DevelopmentForm';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('council');

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isAdmin) {
    return <SubmissionList />;
  }

  // Pass setCurrentRoute to the Navigation component
  // This state is now local to the routing logic
  switch (currentRoute) {
    case 'council':
      return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
    case 'development':
    default:
      return <DevelopmentForm setCurrentRoute={setCurrentRoute} />;
  }
};

export default AppRoutes;