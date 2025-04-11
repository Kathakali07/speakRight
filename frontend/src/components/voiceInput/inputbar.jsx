import React, { useState, useRef, useEffect } from 'react';
import './inputbar.css';
import RippleCircle from './ripplybubble';

const VoiceInput = ({ username }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioRecorded, setIsAudioRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');

  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const audioData = useRef([]);

  useEffect(() => {
    let objectUrl;
    if (audioBlob) {
      objectUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = objectUrl;
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioBlob]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 44100,
      });

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      audioData.current = [];

      processorRef.current.onaudioprocess = e => {
        const input = e.inputBuffer.getChannelData(0);
        audioData.current.push(new Float32Array(input));
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to access microphone.');
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    processorRef.current.disconnect();
    sourceRef.current.disconnect();
    mediaStreamRef.current.getTracks().forEach(track => track.stop());

    const wavBlob = encodeWAV(audioData.current, audioContextRef.current.sampleRate);
    setAudioBlob(wavBlob);
    setIsAudioRecorded(true);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setIsAudioRecorded(false);
    setResultData(null);
    setError('');
    audioData.current = [];
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleSendClick = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to send audio.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const verify = await fetch('http://127.0.0.1:8000/api/accounts/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!verify.ok) throw new Error('Session expired. Please log in again.');

      const response = await fetch('http://127.0.0.1:8000/api/voice/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to process audio');
      }

      setResultData({
        input: data['Input Text'] || '',
        output: data['Output Text'] || '',
        changes: data['Changes'] || [],
        accuracy: data['Accuracy'] || 0,
      });
    } catch (err) {
      console.error('Upload error:', err.message);
      setResultData({ output: `❌ ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const encodeWAV = (buffers, sampleRate) => {
    const flat = buffers.reduce((acc, cur) => {
      const tmp = new Float32Array(acc.length + cur.length);
      tmp.set(acc, 0);
      tmp.set(cur, acc.length);
      return tmp;
    }, new Float32Array());

    const buffer = new ArrayBuffer(44 + flat.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    function floatTo16BitPCM(output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + flat.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits/sample
    writeString(view, 36, 'data');
    view.setUint32(40, flat.length * 2, true);

    floatTo16BitPCM(view, 44, flat);

    return new Blob([view], { type: 'audio/wav' });
  };

  const playAudio = () => {
    audioRef.current?.play();
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
  };

  return (
    <div className="voice-input-container">
      <RippleCircle isRecording={isRecording} />
      <h2 className="greeting">Hello {username}, start speaking to get feedback!</h2>

      <div className="voice-input-bar">
        <button className="cancel-btn" onClick={cancelRecording} disabled={!isAudioRecorded && !isRecording}>
          Cancel
        </button>
        <div className={`voice-input-box ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Recording...' : 'Tap to Record'}
        </div>
        <button className={`send-btn ${!isAudioRecorded ? 'disabled' : ''}`} onClick={handleSendClick} disabled={!isAudioRecorded}>
          Send
        </button>
      </div>

      {error && <div className="error-msg"><strong>{error}</strong></div>}

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Analyzing your speech...</p>
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
              {resultData.changes.length > 0 ? resultData.changes.map((change, idx) => <li key={idx}>{change}</li>) : <li>No changes made.</li>}
            </ul>
          </div>
        </div>
      )}

      {isAudioRecorded && (
        <div className="audio-preview-container">
          <audio ref={audioRef} style={{ display: 'none' }} />
          <button className="play-btn" onClick={playAudio}>▶ Play</button>
          <button className="pause-btn" onClick={pauseAudio}>⏸ Pause</button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
