import React, { useState } from 'react';
import axios from 'axios';
import './signupform.css';

function SignupForm({ onAuthSuccess, onSwitchToSignin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!agreed) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.message === 'User registered successfully') {
        // After successful signup, automatically log the user in
        const loginResponse = await axios.post('http://localhost:8000/api/accounts/login/', {
          email: formData.email,
          password: formData.password
        });
        
        if (loginResponse.data.access) {
          onAuthSuccess(loginResponse.data);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.detail || 
                         'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="User name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            I agree to the <a href="#" className="terms-link">Terms and Conditions</a>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <div className="login-text">
          Already have an account? <span onClick={onSwitchToSignin}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;