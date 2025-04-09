import React, { useState } from 'react';
import './signin.css';

function SigninForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Form submitted, attempting to log in with:", email);
    
    // Log the exact data being sent for debugging
    const payload = {
      email: email.trim(),
      password: password,
    };
    
    console.log("Sending payload:", JSON.stringify(payload));
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", response.status);
      
      // First try to get the response text
      const textResponse = await response.text();
      console.log("Raw response:", textResponse);
      
      // Then try to parse it as JSON if possible
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log("Parsed JSON data:", data);
      } catch (e) {
        console.log("Response is not JSON");
        data = { detail: textResponse };
      }
      
      if (response.ok) {
        // Store tokens securely
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', data.username);
        
        // Set token expiry time (typical JWT expires in 15 minutes)
        const expiresAt = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
        localStorage.setItem('expires_at', expiresAt);
        
        // Success alert
        alert('Login successful!');
        
        // Redirect to protected route or dashboard
        window.location.href = '/dashboard'; // or use React Router navigation
      } else {
        // Error handling with more details
        let errorMessage = 'Login failed';
        if (data && data.detail) {
          errorMessage += ': ' + data.detail;
        } else if (data) {
          errorMessage += ': ' + JSON.stringify(data);
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign in</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="login-text">
          Don't have an account? <span onClick={onSwitchToSignup}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;