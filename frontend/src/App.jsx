import React from 'react';
import Navbar from './components/navbar'; // Adjust the path if needed
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <h1 className="cursive-text">Welcome to SpeakRight</h1>
        <h2 className="next-big-text">English is A Journey</h2>
        <p classname="signup_line">To Talk Your Way to the Top!</p>
      </div>
    </>
  );
}

export default App;
