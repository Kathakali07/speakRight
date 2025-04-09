import React, { useState } from 'react';
import './signupform.css';

function SignupForm({ onSwitchToSignin }) {
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
    
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    
    try {
      setLoading(true);
      console.log("Sending signup request with:", payload.username, payload.email);
      
      const res = await fetch('http://localhost:8000/api/accounts/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Get the response text first
      const textResponse = await res.text();
      console.log("Raw signup response:", textResponse);
      
      // Then try to parse it as JSON
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log("Parsed signup data:", data);
      } catch (e) {
        console.log("Signup response is not JSON");
        data = { error: textResponse };
      }
      
      if (res.ok) {
        alert('Signup successful! You can now log in.');
        onSwitchToSignin();
      } else {
        let errorMessage = 'Signup failed';
        if (data && data.error) {
          errorMessage += ': ' + data.error;
        } else if (data) {
          errorMessage += ': ' + JSON.stringify(data);
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
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
            I agree to the <a href="#">Terms and Conditions</a>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Sign up'}
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