import Cookies from 'js-cookie';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = Cookies.get('authToken')
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default ProtectedRoute;
