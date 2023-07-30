// Captions.tsx
import React from 'react';
import { Subtitle } from './subtitle';
import './Captions.css';

interface CaptionsProps {
  currentTime: number;
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | undefined;
}

const Captions: React.FC<CaptionsProps> = ({ currentTime, subtitles, currentSubtitle }) => {
  return (
    <div className="captions">
      {currentSubtitle ? currentSubtitle.text : ''}
    </div>
  );
};

export default Captions;
