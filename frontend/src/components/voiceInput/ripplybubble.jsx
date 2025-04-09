import React, { useEffect, useState } from 'react';
import './ripplybubble.css';

const RippleCircle = ({ isRecording }) => {
  return (
    <div className={`ripple-circle ${isRecording ? 'active' : ''}`}>
      <div className="ripple"></div>
    </div>
  );
};

export default RippleCircle;
