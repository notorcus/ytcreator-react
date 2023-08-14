import React, { createContext, useState, useContext, useEffect } from 'react';
import { Video, VideoData, WordDetail, WordType } from './Types';

interface VideoProviderProps {
  children: React.ReactNode;
}

const defaultVideoData: VideoData = {
  status: "default",
  message: "default",
  data: {
    videos: [],
    transcript: [],
  },
};

const VideoContext = createContext<{
  videoData: VideoData;
  setVideoData: React.Dispatch<React.SetStateAction<VideoData>>;
  wordsArray: WordType[];
  setStartTime?: (time: number) => void;
  setEndTime?: (time: number) => void;
}>({
  videoData: defaultVideoData,
  setVideoData: () => {},
  wordsArray: [],
});

// Function to set active words for a given video
function setActiveWordsForVideo(video: Video, words: WordType[]): WordType[] {
  const startWordIndex = video.start_idx;
  const endWordIndex = video.end_idx;

  // Set words to active in the range
  for (let i = startWordIndex; i <= endWordIndex; i++) {
    words[i].isActive = true;
  }
  
  return words;
}

// Main function to process all videos
function processVideos(videos: Video[], words: WordType[]): WordType[] {
  videos.forEach(video => {
    words = setActiveWordsForVideo(video, words);
  });

  return words;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videoData, setVideoData] = useState(defaultVideoData);
  const [wordsArray, setWordsArray] = useState<WordType[]>([]);

  useEffect(() => {
    if (videoData.status === "success") {
      let extractedWords: WordType[] = videoData.data.transcript.map((wordDetail: WordDetail) => ({
        word: wordDetail.word,
        start: wordDetail.start,
        end: wordDetail.end,
        isActive: false // Initialize with isActive set to false
      }));

      // Process the videos to set active words
      const processedWords = processVideos(videoData.data.videos, extractedWords);
      setWordsArray(processedWords);
    }
  }, [videoData]);

  useEffect(() => {
    console.log("wordsArray:", wordsArray);
  }, [wordsArray]);

  useEffect(() => {
    const activeWords = wordsArray.filter(word => word.isActive);
    console.log("Active Words:", activeWords);
  }, [wordsArray]);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData, wordsArray}}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoData = () => {
  return useContext(VideoContext);
};

export default VideoContext;
