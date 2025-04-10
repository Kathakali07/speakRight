import React, { useState } from 'react';
import './signin.css';

function SigninForm({ onSwitchToSignup, onSignInSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    alert('Sign in submitted!');
    onSignInSuccess();
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