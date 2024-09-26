import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Check the authentication status once user state is determined
  useEffect(() => {
    if (user !== null) {
      setIsLoading(false); // Set loading to false once user state is known
    }
  }, [user]);

  // Show a loading spinner or nothing until the user state is resolved
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
