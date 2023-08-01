// Captions.tsx
import React from 'react';
import './Captions.css';

interface CaptionsProps {
  currentSubtitle: string | null;
}

const Captions: React.FC<CaptionsProps> = ({ currentSubtitle }) => {
  return (
    <div className="captions">
      {currentSubtitle}
    </div>
  );
};

export default Captions;
