// src/utils/auth.js

// Helper to check if token is expired
export const isTokenExpired = () => {
    const expiresAt = localStorage.getItem('expires_at');
    return !expiresAt || new Date().getTime() > Number(expiresAt);
  };
  
  // Refresh token function
  export const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch('http://localhost:8000/api/accounts/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      
      // Set new expiry time
      const expiresAt = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
      localStorage.setItem('expires_at', expiresAt);
      
      return data.access;
    } catch (error) {
      // Token refresh failed - force logout
      logout();
      throw error;
    }
  };
  
  // API fetch with automatic token handling
  export const authenticatedFetch = async (url, options = {}) => {
    // Check if token is expired and refresh if needed
    if (isTokenExpired()) {
      await refreshToken();
    }
    
    // Get the current access token
    const token = localStorage.getItem('access_token');
    
    // Set up headers with authorization
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    
    // Make the API call
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      try {
        // Try to refresh the token
        await refreshToken();
        
        // Retry the original request with new token
        const newToken = localStorage.getItem('access_token');
        const newHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        
        return fetch(url, {
          ...options,
          headers: newHeaders,
        });
      } catch (error) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        throw error;
      }
    }
    
    return response;
  };
  
  // Logout function
  export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };