import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SubmissionList from './SubmissionList';
import CommunityCouncilForm from './CommunityCouncilForm';
import DevelopmentForm from './DevelopmentForm';
import UserManagement from './UserManagement';
import ActivityLogs from './ActivityLogs';
import NotificationsPage from './NotificationsPage';
import Navigation from './Navigation';

const AppRoutes = () => {
  const { isAuthenticated, isSuperAdmin, isDistrictAdmin, isDSUser } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (!isAuthenticated) return 'login';
    if (isDSUser) return 'council';
    if (isSuperAdmin || isDistrictAdmin) return 'submissions';
    return 'login';
  });

  // Not authenticated - show login
  if (!isAuthenticated) {
    if (currentRoute === 'login') {
      return <Login />;
    }
    // Redirect to login if trying to access other routes
    setCurrentRoute('login');
    return <Login />;
  }

  // Render with Navigation for authenticated users
  return (
    <div>
      <Navigation setCurrentRoute={setCurrentRoute} />
      <div className="min-h-screen bg-gray-50">
        {renderRoute(currentRoute, isSuperAdmin, isDistrictAdmin, isDSUser, setCurrentRoute)}
      </div>
    </div>
  );
};

const renderRoute = (route, isSuperAdmin, isDistrictAdmin, isDSUser, setCurrentRoute) => {
  // DS Users routes
  if (isDSUser) {
    switch (route) {
      case 'council':
        return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
      case 'development':
        return <DevelopmentForm setCurrentRoute={setCurrentRoute} />;
      case 'submissions':
        return <SubmissionList />;
      default:
        return <CommunityCouncilForm setCurrentRoute={setCurrentRoute} />;
    }
  }

  // Super Admin and District Admin routes
  if (isSuperAdmin || isDistrictAdmin) {
    switch (route) {
      case 'submissions':
        return <SubmissionList />;
      case 'users':
        return <UserManagement />;
      case 'logs':
        return <ActivityLogs />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <SubmissionList />;
    }
  }

  // Fallback
  return <div className="p-6">Unauthorized</div>;
};

export default AppRoutes;