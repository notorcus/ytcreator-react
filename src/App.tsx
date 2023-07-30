import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Transcript from './components/Transcript';
import Captions from './components/Captions';
import type { Subtitle } from './components/subtitle';
import { parseSrt } from './components/subtitle';
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number | null>(null);



  useEffect(() => {
    parseSrt('/MW Hormozi.srt')
      .then(setSubtitles)
      .catch(console.error);
  
    const video = videoRef.current;
    if (!video) return;
  
    const findSubtitleIndex = (currentTime: number, subtitles: Subtitle[]): number => {
      let left = 0;
      let right = subtitles.length - 1;
      while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        if (subtitles[mid].start <= currentTime && currentTime <= subtitles[mid].end) {
          return mid;
        }
        if (currentTime < subtitles[mid].start) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      return -1;
    };
  
    const timeUpdateListener = () => {
      setCurrentTime(video.currentTime);
      const currentSubtitleIndex = findSubtitleIndex(video.currentTime, subtitles);
      setCurrentSubtitleIndex(currentSubtitleIndex);
    };
  
    video.addEventListener('timeupdate', timeUpdateListener);
  
    return () => {
      video.removeEventListener('timeupdate', timeUpdateListener);
    };
  }, [subtitles]);


  const handleWordClick = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    video.play();
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="large-wrapper">
          <VideoPlayer videoRef={videoRef} />
          <Captions 
            currentTime={currentTime} 
            subtitles={subtitles} 
            currentSubtitle={currentSubtitleIndex !== null ? subtitles[currentSubtitleIndex] : undefined} 
          />
        </div>
        <div className="transcript-wrapper">
          <Transcript 
            currentTime={currentTime}
            onWordClick={handleWordClick}
            playing={playing}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
