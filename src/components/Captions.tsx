// Captions.tsx
import React from 'react';
import './Captions.css';

interface CaptionsProps {
  currentSubtitle: string | null;
}

const Captions: React.FC<CaptionsProps> = ({ currentSubtitle }) => {
  return (
    <div className="captions">
      <svg>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" stroke="black" strokeWidth="10px">
          {currentSubtitle}
        </text>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white">
          {currentSubtitle}
        </text>
      </svg>
    </div>
  );
};

export default Captions;
