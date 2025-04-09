import React, { useState } from 'react';
import './speechToText.css';

const SpeechToTextDisplay = ({ originalText, correctedText }) => {
  return (
    <div className="speech-to-text-container">
      <div className="original-text">
        <h3>Original Speech-to-Text</h3>
        <p>{originalText}</p>
      </div>
      <div className="corrected-text">
        <h3>Corrected Speech-to-Text</h3>
        <p>{correctedText}</p>
      </div>
    </div>
  );
};

export default SpeechToTextDisplay;
