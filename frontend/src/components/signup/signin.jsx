import React, { useState } from 'react';
import axios from 'axios';
import './signin.css';

function SigninForm({ onAuthSuccess, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setError('');
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.data.access) {
        onAuthSuccess(response.data);
      }
    } catch (err) {
      // Unified error message for security (don't reveal if email exists)
      setError('Email or Password is wrong');
      
      // For debugging (remove in production)
      console.error('Login error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign in</h2>
        
        {/* General error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSignin}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={error ? 'error' : ''}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={error ? 'error' : ''}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="login-text">
          Don't have an account?{' '}
          <span className="switch-link" onClick={onSwitchToSignup}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;