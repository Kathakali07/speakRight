import React, { useState } from 'react';
import Navbar from './components/navbar/navbar';
import SignupButton from "./components/signup/signup";
import SignupForm from "./components/signup/signupform";
import SigninForm from "./components/signup/signin";

import './App.css';

function App() {
  const [view, setView] = useState('home'); // 'home', 'signup', 'signin'

  return (
    <>
      <Navbar />
      <div className="main-content">
        {view === 'home' && (
          <>
            <h1 className="cursive-text">Welcome to SpeakRight</h1>
            <h2 className="next-big-text">English is A Journey</h2>
            <div className="signup-line-wrapper">
              <SignupButton onClick={() => setView('signup')} />
              <p className="signup_line">To Talk Your Way to the Top!</p>
            </div>
          </>
        )}

        {view === 'signup' && <SignupForm onSwitchToSignin={() => setView('signin')} />}
        {view === 'signin' && <SigninForm onSwitchToSignup={() => setView('signup')} />}
      </div>
    </>
  );
}

export default App;
