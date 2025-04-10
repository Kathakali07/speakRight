import React, { useState, useRef } from 'react';
import Navbar from './components/navbar/navbar';
import SignupButton from "./components/signup/signup";
import SignupForm from "./components/signup/signupform";
import SigninForm from "./components/signup/signin";
import VoiceInput from './components/voiceInput/inputbar';

// Import icons from react-icons
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';

import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Create a ref for the Contact Us section
  const contactRef = useRef(null);

  // Scroll to the Contact Us section
  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };

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
      {/* Pass scrollToContact to Navbar */}
      <Navbar onContactClick={scrollToContact} />

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

        {/* Mission & Vision Section */}
        <div id="mission-vision" className="mission-vision-section">
          <p>
            At SpeakRight, we believe that effective communication is the key to success,
            and everyone deserves to speak with confidence. Whether you're preparing for a speech,
            presentation, or simply want to improve your everyday communication, SpeakRight helps
            you speak clearly, confidently.
            Join us and transform your voice into a powerful tool for success, one confident step at a time!
          </p>
        </div>

        <div className="centered-text">
          <p>At SpeakRight, your confidence will soar,</p>
          <p>With tools and support, you'll fear no more.</p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div ref={contactRef} className="contact-us-section">
        <h2>Contact Us</h2>
        <div className="team-icons">
          <div className="team-member">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="JANNATUN KHUSBU" className="team-pic" />
            <p>JANNATUN KHUSBU</p>
            <div className="social-links">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} style={{ color: '#0077b5' }} /> {/* LinkedIn Blue */}
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} style={{ color: '#ffffff' }} /> {/* GitHub White */}
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} style={{ color: '#7289da' }} /> {/* Discord Violet */}
              </a>
            </div>
          </div>
          <div className="team-member">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="Member 2" className="team-pic" />
            <p>SATYAM PUITANDY</p>
            <div className="social-links">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} style={{ color: '#0077b5' }} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} style={{ color: '#ffffff' }} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} style={{ color: '#7289da' }} />
              </a>
            </div>
          </div>
          <div className="team-member">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="Member 3" className="team-pic" />
            <p>KATHAKALI DAS</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/kathakali-kd-46a93623b" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} style={{ color: '#0077b5' }} />
              </a>
              <a href="https://github.com/Kathakali07" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} style={{ color: '#ffffff' }} />
              </a>
              <a href="https://discordapp.com/users/meebhaalo6700" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} style={{ color: '#7289da' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;