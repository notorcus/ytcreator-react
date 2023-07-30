/* VideoPlayer.tsx */
import React, { RefObject } from 'react';
import './VideoPlayer.css';
interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  return (
    <div className="video-player">
      <video ref={videoRef} controls>
        <source src="/MW Hormozi.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
