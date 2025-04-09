import React, { useState, useRef } from 'react';
import './inputbar.css'; // Make sure to create the CSS file for styling
import RippleCircle from './ripplybubble'; // Import the RippleCircle component

const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioRecorded, setIsAudioRecorded] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start Recording
  const startRecording = () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            setIsAudioRecorded(true);
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch((err) => console.error('Error accessing microphone:', err));
    } else {
      console.error('Browser does not support mediaDevices');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cancel Recording
  const cancelRecording = () => {
    setIsRecording(false);
    setIsAudioRecorded(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  // Handle Send
  const handleSend = () => {
    if (audioBlob) {
      // For now, you can log the audio blob to console. Later, you can upload it or send it via an API.
      console.log('Audio sent:', audioBlob);
    }
    cancelRecording();
  };

  // Display recorded audio if available
  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div className="voice-input-container">
      <RippleCircle isRecording={isRecording} /> {/* Add the RippleCircle component */}

      <div className="voice-input-bar">
        {/* Cancel Button */}
        <button 
          className="cancel-btn" 
          onClick={cancelRecording} 
          disabled={!isAudioRecorded && !isRecording}
        >
          Cancel
        </button>

        {/* Voice Input Box */}
        <div className={`voice-input-box ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Recording...' : 'Tap to record'}
        </div>

        {/* Send Button */}
        <button 
          className="send-btn" 
          onClick={handleSend} 
          disabled={!isAudioRecorded}
        >
          Send
        </button>
      </div>

      {/* Audio Preview and Play Button */}
      {isAudioRecorded && (
        <div className="audio-preview-container">
          <audio ref={audioRef} controls />
          <button 
            className="play-btn" 
            onClick={playAudio}
            disabled={!isAudioRecorded}
          >
            <span className="play-icon">▶</span> Play
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
