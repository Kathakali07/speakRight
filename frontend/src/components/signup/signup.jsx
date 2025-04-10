// signup.jsx
import React from 'react';

const SignupButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="get-started-button bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded"
    >
      Get Started
    </button>
  );
};

export default SignupButton;
