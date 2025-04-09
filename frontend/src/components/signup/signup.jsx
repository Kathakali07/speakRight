import React from 'react';
import './signup.css';

function SignupButton({ onClick }) {
  return (
    <button className="signup-button" onClick={onClick}>
      Sign Up
    </button>
  );
}

export default SignupButton;
