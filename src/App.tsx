// App.tsx
import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Transcript from './components/Transcript';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <div className="large-wrapper">
          <div className="video-player-wrapper">
            <VideoPlayer videoRef={videoRef} />
          </div>
        </div>
        <div className="transcript-wrapper">
          <Transcript currentTime={currentTime} />
        </div>
      </div>
    </div>
  );
}

export default App;
