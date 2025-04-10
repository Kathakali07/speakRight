// signup.jsx
import React from 'react';

const SignupButton = ({ onClick }) => {
  return (
    <button className="signup-button" onClick={onClick}>
      Get Started
    </button>
  );
};

export default SignupButton;
