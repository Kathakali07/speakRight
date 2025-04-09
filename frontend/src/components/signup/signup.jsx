import React from 'react';
import './signup.css';

function SignupButton({ onClick }) {
  return (
    <button className="signup-button" onClick={onClick}>
      Get Started
    </button>
  );
}

export default SignupButton;
