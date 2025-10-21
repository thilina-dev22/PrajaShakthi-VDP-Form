import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SubmissionList from './SubmissionList';
import CommunityCouncilForm from './CommunityCouncilForm';
import DevelopmentForm from './DevelopmentForm';

const AppRoutes = () => {
  const { isAdmin } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('development'); // public landing

  if (isAdmin) {
    return <SubmissionList />;
  }

  switch (currentRoute) {
    case 'login':
      return <Login />;
    case 'council':
      return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
    case 'development':
    default:
      return <DevelopmentForm setCurrentRoute={setCurrentRoute} />;
  }
};

export default AppRoutes;