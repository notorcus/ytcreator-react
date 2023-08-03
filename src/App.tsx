// App.tsx
import { useRef, useState, useEffect } from 'react';
import './App.css';
import Transcript from './components/Transcript';
import { Subtitle } from './components/Subtitle';
import VideoPlayer from './components/VideoPlayer';
import { parseCSV, TimeStamp } from './utils';

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number | null>(null);
  
  const [timeStamps, setTimeStamps] = useState<TimeStamp[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      console.log('Video currentTime:', video.currentTime);
    
      setCurrentTime(video.currentTime);
      const index = subtitles.findIndex(
        (subtitle, i) =>
          subtitle.start <= video.currentTime &&
          subtitle.end >= video.currentTime &&
          (i === subtitles.length - 1 || subtitles[i + 1].start > video.currentTime)
      );
      setCurrentSubtitleIndex(index === -1 ? null : index);
      
      // Pause video when it reaches end time
      const currentStamp = timeStamps.find(({ start, end }) => video.currentTime >= start && video.currentTime <= end);
      if (currentStamp && video.currentTime >= currentStamp.end) {
        console.log('Reached end time:', currentStamp.end);
        video.pause();
      }
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
  }, [videoRef, subtitles, timeStamps]);

  useEffect(() => {
    fetch('/short_1.csv')
      .then(response => response.blob())
      .then(parseCSV)
      .then((parsedTimeStamps) => {
        console.log('Fetched and parsed timestamps:', parsedTimeStamps);
        setTimeStamps(parsedTimeStamps);
  
        // Set video currentTime to start of first timestamp
        const video = videoRef.current;
        if (video && parsedTimeStamps.length > 0) {
          console.log('Setting video currentTime to start of first timestamp:', parsedTimeStamps[0].start);
          video.currentTime = parsedTimeStamps[0].start;
        }
      })
      .catch(console.error);
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
            <VideoPlayer videoRef={videoRef} currentSubtitle={currentSubtitleIndex !== null ? subtitles[currentSubtitleIndex] : null} timeStamp={null} />
          </div>
        </div>
        <div className="transcript-wrapper">
          <Transcript currentTime={currentTime} onWordClick={handleWordClick} playing={playing} setSubtitles={setSubtitles} />
        </div>
      </div>
    </div>
  );
}

export default App;
