// VideoPlayer.tsx
import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';
import Captions from './Captions';
import { useVideoData } from './VideoContext';

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
  const { videoData } = useVideoData();

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
        video.currentTime = startTime;  // Set the video to the start time once it reaches the end time.
      }
    };

    const handleClick = () => {
      if (isPlaying) {
        video.pause();
      } else {
        if (video.currentTime < startTime || video.currentTime > endTime) {
          video.currentTime = startTime;  // Ensure the video starts from the designated start time.
        }
        video.play();
      }
      setIsPlaying(!isPlaying);
    };

    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('click', handleClick);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('click', handleClick);
    };
  }, [videoRef, isPlaying, startTime, endTime]);

  const videoPath = videoData.video_path ? '/' + videoData.video_path.split('/public/')[1] : '';

  return (
    <div className="video-player">
      <video ref={videoRef}>
        <source src={videoPath} type="video/mp4" /> {/* Use videoPath here */}
        Your browser does not support the video tag.
      </video>
      <Captions currentSubtitle={currentSubtitle !== null ? currentSubtitle.text : null} />
    </div>
  );
};

export default VideoPlayer;
