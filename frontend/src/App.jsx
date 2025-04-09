import React, { useState } from 'react';
import Navbar from './components/navbar/navbar';
import SignupButton from "./components/signup/signup";
import SignupForm from "./components/signup/signupform";
import SigninForm from "./components/signup/signin";
import VoiceInput from './components/voiceInput/inputbar';

import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false); 

  const handleSignUpSuccess = () => {
    setIsSignedIn(true); 
    setView('home'); 
  };

  const handleSignInSuccess = () => {
    setIsSignedIn(true); 
    setView('home');
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        {view === 'home' && !isSignedIn && (
          <>
            <h1 className="cursive-text">Welcome to SpeakRight</h1>
            <h2 className="next-big-text">English is A Journey</h2>
            <div className="signup-line-wrapper">
              <p className="signup_line">To Talk Your Way to the Top!</p>
            </div>
            <SignupButton onClick={() => setView('signup')} />

          </>
        )}

        {view === 'signup' && (
          <div>
            <SignupForm onSwitchToSignin={() => setView('signin')} onSignUpSuccess={handleSignUpSuccess} />
            
            {isSignedIn && <VoiceInput />} 
          </div>
        )}

        {view === 'signin' && (
          <div>
            <SigninForm onSwitchToSignup={() => setView('signup')} onSignInSuccess={handleSignInSuccess} />
            
            {isSignedIn && <VoiceInput />} 
          </div>
        )}

        {isSignedIn && <VoiceInput />}
      </div>
    </>
  );
}

export default App;
