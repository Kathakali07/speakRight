import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import SignupButton from "./components/signup/signup";
import SignupForm from "./components/signup/signupform";
import SigninForm from "./components/signup/signin";
import VoiceInput from './components/voiceInput/inputbar';
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';
import './App.css';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: '',
    isLoading: true // Initial loading state
  });
  const contactRef = useRef(null);
  const navigate = useNavigate();

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const res = await fetch('http://127.0.0.1:8000/api/accounts/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });
    
          if (!res.ok) {
            throw new Error("Token expired or invalid");
          }
    
          // Valid token
          setAuthState({
            isAuthenticated: true,
            username: localStorage.getItem('username') || '',
            isLoading: false
          });
        } else {
          // No token
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Token invalid or expired, logout user
        localStorage.clear();
        setAuthState({
          isAuthenticated: false,
          username: '',
          isLoading: false
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthSuccess = (responseData) => {
    localStorage.setItem('access_token', responseData.access);
    localStorage.setItem('refresh_token', responseData.refresh);
    localStorage.setItem('username', responseData.username);
    
    // Calculate token expiration (15 minutes from now)
    const expiresAt = new Date().getTime() + (15 * 60 * 1000);
    localStorage.setItem('expires_at', expiresAt);
    
    setAuthState({
      isAuthenticated: true,
      username: responseData.username,
      isLoading: false
    });
    navigate('/');
  };

  const handleSignOut = () => {
    // Clear all auth-related storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('expires_at');
    
    setAuthState({
      isAuthenticated: false,
      username: '',
      isLoading: false
    });
    navigate('/login');
  };

  if (authState.isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Navbar 
        isAuthenticated={authState.isAuthenticated}
        username={authState.username}
        onContactClick={scrollToContact}
        onSignOut={handleSignOut}
      />

      <div className="main-content">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            authState.isAuthenticated ? (
              <>
                <VoiceInput username={authState.username} />
                <div id="mission-vision" className="mission-vision-section">
                  <p>
                    Welcome back, {authState.username}! At SpeakRight, we believe that effective 
                    communication is the key to success.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className="cursive-text">Welcome to SpeakRight</h1>
                <h2 className="next-big-text">English is A Journey</h2>
                <div className="signup-line-wrapper">
                  <p className="signup_line">To Talk Your Way to the Top!</p>
                </div>
                <SignupButton onClick={() => navigate('/signup')} />
              </>
            )
          } />

          {/* Signup Route */}
          <Route path="/signup" element={
            authState.isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignupForm 
                onAuthSuccess={handleAuthSuccess}
                onSwitchToSignin={() => navigate('/login')}
              />
            )
          } />

          {/* Login Route */}
          <Route path="/login" element={
            authState.isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SigninForm 
                onAuthSuccess={handleAuthSuccess}
                onSwitchToSignup={() => navigate('/signup')}
              />
            )
          } />
        </Routes>

        {/* Common UI Elements */}
        <div className="centered-text">
          <p>At SpeakRight, your confidence will soar,</p>
          <p>With tools and support, you'll fear no more.</p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div ref={contactRef} className="contact-us-section">
        <h2>Contact Us</h2>
        <div className="team-icons">
          {/* Your team member components */}
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}