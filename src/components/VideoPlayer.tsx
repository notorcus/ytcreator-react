// VideoPlayer.tsx
import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';
import Captions from './Captions';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface TimeStamp {
  start: number;
  end: number;
}

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentSubtitle: Subtitle | null;
  timeStamp: TimeStamp | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, currentSubtitle, timeStamp }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleClick = () => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    };

    video.addEventListener('click', handleClick);
    return () => {
      video.removeEventListener('click', handleClick);
    };
  }, [videoRef, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !timeStamp) return;

    video.currentTime = timeStamp.start;
    if (isPlaying) {
      video.play();
    }
  }, [videoRef, timeStamp, isPlaying]);

  return (
    <div className="video-player">
      <video ref={videoRef}>
        <source src="/MW Hormozi.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Captions currentSubtitle={currentSubtitle !== null ? currentSubtitle.text : null} />
    </div>
  );
};

export default VideoPlayer;
