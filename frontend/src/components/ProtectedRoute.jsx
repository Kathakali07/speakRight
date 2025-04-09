import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired, refreshToken } from '../utils/auth';

function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!isAuthenticated()) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        // If token is expired, try to refresh it
        if (isTokenExpired()) {
          await refreshToken();
        }
        
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  if (isLoading) {
    // You can add a loading spinner here
    return <div>Loading...</div>;
  }
  
  if (!isAuthorized) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default ProtectedRoute;