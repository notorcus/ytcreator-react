// VideoPlayer.tsx
import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
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

  return (
    <div className="video-player">
      <video ref={videoRef}>
        <source src="/MW Hormozi.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;