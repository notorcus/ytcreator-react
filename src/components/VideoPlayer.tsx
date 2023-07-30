// VideoPlayer.tsx
import React from 'react';
import './VideoPlayer.css';

const VideoPlayer: React.FC = () => {
  return (
    <div className="video-player">
      <video controls>
        <source src="/MW Hormozi.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
