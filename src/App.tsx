// App.tsx
import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Transcript from './components/Transcript';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleWordClick = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
  
    video.currentTime = time;
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="large-wrapper">
          <div className="video-player-wrapper">
            <VideoPlayer videoRef={videoRef} />
          </div>
        </div>
        <div className="transcript-wrapper">
          <Transcript currentTime={currentTime} onWordClick={handleWordClick} playing={playing} />
        </div>
      </div>
    </div>
  );
}

export default App;
