import React from 'react';
import Navbar from './components/navbar'; // Adjust the path if needed
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <h1>Welcome to SpeakRight</h1>
        <p>Your journey to confident English speaking starts here.</p>
      </div>
    </>
  );
}

export default App;
