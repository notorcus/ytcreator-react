// VideoPlayer.tsx
import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';
import Captions from './Captions';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentSubtitle: Subtitle | null;
  startTime: number;  // in seconds
  endTime: number;  // in seconds
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, currentSubtitle, startTime, endTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadataLoaded = () => {
      video.currentTime = startTime;
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = startTime;
      }
    };

    const handleSeeked = () => {
      if (video.currentTime < startTime || video.currentTime > endTime) {
        video.currentTime = startTime;
      }
    };

    const handleClick = () => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    };

    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('click', handleClick);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('click', handleClick);
    };
  }, [videoRef, isPlaying, startTime, endTime]);

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
