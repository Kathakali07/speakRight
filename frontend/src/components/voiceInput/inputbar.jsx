import React, { useState, useRef } from 'react';
import './inputbar.css';
import RippleCircle from './ripplybubble';

const VoiceInput = ({ username }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioRecorded, setIsAudioRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(blob);
          setIsAudioRecorded(true);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Microphone error:', error);
        alert('Please allow microphone access.');
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setIsAudioRecorded(false);
    setResultData(null);
    audioChunksRef.current = [];
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const handleSendClick = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in to send audio.');
      return;
    }

    try {
      setIsLoading(true);

      const verifyResponse = await fetch('http://127.0.0.1:8000/api/accounts/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!verifyResponse.ok) {
        throw new Error('Session expired or token invalid. Please log in again.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/voice/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to send audio');
      }

      const data = await response.json();
      console.log("API Response:", data);

      setResultData({
        input: data['Input Text'] || '',
        output: data['Output Text'] || '',
        changes: data['Changes'] || [],
        accuracy: data['Accuracy'] || 0,
      });

    } catch (error) {
      console.error('Send error:', error.message);
      setResultData({ output: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="voice-input-container">
      <RippleCircle isRecording={isRecording} />
      <h2>Hello {username}, start speaking to get feedback!</h2>

      <div className="voice-input-bar">
        <button
          className="cancel-btn"
          onClick={cancelRecording}
          disabled={!isAudioRecorded && !isRecording}
        >
          Cancel
        </button>

        <div
          className={`voice-input-box ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Recording...' : 'Tap to record'}
        </div>

        <button
          className="send-btn"
          onClick={handleSendClick}
          disabled={!isAudioRecorded}
        >
          Send
        </button>
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <span className="spinner" /> Analyzing your speech...
        </div>
      )}

      {resultData && !isLoading && (
        <div className="result-box">
          <h3>Results</h3>
          <p><strong>Input Text:</strong> {resultData.input}</p>
          <p><strong>Output Text:</strong> {resultData.output}</p>
          <p><strong>Accuracy:</strong> {resultData.accuracy}%</p>
          <div>
            <strong>Changes:</strong>
            <ul>
              {resultData.changes.length > 0 ? (
                resultData.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))
              ) : (
                <li>No changes made.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {isAudioRecorded && (
        <div className="audio-preview-container">
          <audio ref={audioRef} style={{ display: 'none' }} />
          <button className="play-btn" onClick={playAudio}>
            ▶ Play
          </button>
          <button className="pause-btn" onClick={() => audioRef.current?.pause()}>
            ⏸ Pause
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
