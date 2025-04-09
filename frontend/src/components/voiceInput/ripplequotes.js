import React, { useState, useEffect } from 'react';
import './ripplequotes.css';

// List of motivational messages
const motivationalMessages = [
  "You got this!",
  "Speak with Confidence!",
  "Believe in yourself!",
  "Your voice matters!",
  "Keep going, you're doing great!",
  "Stay strong, you're unstoppable!",
  "You are powerful!",
  "Speak your truth!",
  "Confidence is key!",
  "Trust yourself!"
];

const RippleCircle = ({ isRecording }) => {
  const [message, setMessage] = useState("");

  // Function to get a random message
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  useEffect(() => {
    if (isRecording) {
      // Change message every 3 seconds while recording
      const interval = setInterval(() => {
        setMessage(getRandomMessage());
      }, 3000); // Update message every 3 seconds

      return () => clearInterval(interval); // Clear interval when recording ends
    }
    return () => {}; // No effect if not recording
  }, [isRecording]);

  useEffect(() => {
    console.log('Current message:', message); // Log current message to see it updating
  }, [message]); // Log whenever the message changes

  return (
    <div className={`ripple-circle ${isRecording ? 'active' : ''}`}>
      {isRecording && <div className="message">{message}</div>}
      <div className="ripple"></div>
    </div>
  );
};

export default RippleCircle;
