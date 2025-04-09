import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SigninForm from './components/signup/signin';
import SignupForm from './components/signup/signupform';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';
import './App.css';

function App() {
  const [showSignin, setShowSignin] = useState(true);
  
  const handleSwitchToSignup = () => setShowSignin(false);
  const handleSwitchToSignin = () => setShowSignin(true);
  
  // Authentication wrapper for login/signup pages
  const AuthWrapper = () => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Otherwise show the login/signup form
    return showSignin 
      ? <SigninForm onSwitchToSignup={handleSwitchToSignup} /> 
      : <SignupForm onSwitchToSignin={handleSwitchToSignin} />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login/Signup Route */}
          <Route path="/login" element={<AuthWrapper />} />
          
          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to login or dashboard based on auth status */}
          <Route path="/" element={
            isAuthenticated() 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } />
          
          {/* Catch-all route - redirect to login or dashboard */}
          <Route path="*" element={
            isAuthenticated() 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;