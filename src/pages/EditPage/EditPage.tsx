import { useRef, useState, useEffect } from 'react';
import './EditPage.css';
import Transcript from './Transcript';
import { Subtitle } from './Subtitle';
import VideoPlayer from './VideoPlayer';
import { useParams } from 'react-router-dom';
import { useVideoData } from './VideoContext'; // Import the hook

const timeStringToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const EditPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const videoIndex = parseInt(videoId || "1", 10) - 1
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number | null>(null);

  const { videoData, wordsArray, setSelectedVideoIndex, setActiveWordsForSelectedVideo, setWordsArray } = useVideoData();

  useEffect(() => {
    // Reset all active words
    const resetWords = wordsArray.map(word => ({ ...word, isActive: false }));
    const updatedWords = setActiveWordsForSelectedVideo(videoIndex, resetWords, videoData);
    setWordsArray(updatedWords);
    setSelectedVideoIndex(videoIndex);
  }, [videoIndex]);
  
  
  // Use the context to retrieve videoData
  const videos = videoData.data.videos || [];

  const videoStartTime = wordsArray[videos[videoIndex]?.start_idx]?.start || 0;
  const videoEndTime = wordsArray[videos[videoIndex]?.end_idx]?.end || 0;  

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const index = subtitles.findIndex(
        (subtitle, i) =>
          subtitle.start <= video.currentTime &&
          subtitle.end >= video.currentTime &&
          (i === subtitles.length - 1 || subtitles[i + 1].start > video.currentTime)
      );
      setCurrentSubtitleIndex(index === -1 ? null : index);
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
  }, [videoRef, subtitles]);

  const handleWordClick = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  return (
    <div className="EditPage">
      <div className="main-content">
        <div className="large-wrapper">
          <div className="video-player-wrapper">
            <VideoPlayer videoRef={videoRef} currentSubtitle={currentSubtitleIndex !== null ? subtitles[currentSubtitleIndex] : null} startTime={videoStartTime} endTime={videoEndTime} />
          </div>
        </div>
        <div className="transcript-wrapper">
        <Transcript 
          currentTime={currentTime} 
          onWordClick={handleWordClick} 
          playing={playing} 
          setSubtitles={setSubtitles} 
          onActiveWordsChange={() => {}} 
          startTime={videoStartTime} 
          endTime={videoEndTime}
        />
        </div>
      </div>
    </div>
  );
}

export default EditPage;
