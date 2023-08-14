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
  selectedVideoIndex: number | null;
  setSelectedVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setStartWord: (wordIndex: number) => void; // New function
  setEndWord: (wordIndex: number) => void;   // New function
}>({
  videoData: defaultVideoData,
  setVideoData: () => {},
  wordsArray: [],
  selectedVideoIndex: null,
  setSelectedVideoIndex: () => {},
  setStartWord: () => {}, // Placeholder
  setEndWord: () => {},   // Placeholder
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

function logVideoDetails(videos: Video[], words: WordType[]) {
  videos.forEach((video, index) => {
    const startWord = words[video.start_idx];
    const endWord = words[video.end_idx];
    const activeWordsList = words.slice(video.start_idx, video.end_idx + 1).map(word => word.word).join(', ');

    console.log(`Video ${index + 1}:`);
    console.log(`Start Index: ${video.start_idx}, Word: ${startWord?.word}`);
    console.log(`End Index: ${video.end_idx}, Word: ${endWord?.word}`);
    console.log(`Active Words: ${activeWordsList}`);
  });
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
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

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
      
      // Log the video details
      logVideoDetails(videoData.data.videos, processedWords);
    }
  }, [videoData]);
  

  useEffect(() => {
    console.log("wordsArray:", wordsArray);
  }, [wordsArray]);


  return (
    <VideoContext.Provider 
      value={{
        videoData, 
        setVideoData, 
        wordsArray, 
        selectedVideoIndex,
        setSelectedVideoIndex,
        setStartWord: (wordIndex: number) => {
          console.log("Start word index set:", wordIndex);
          // Placeholder implementation (you can add real logic later)
        },
        setEndWord: (wordIndex: number) => {
          console.log("End word index set:", wordIndex);
          // Placeholder implementation (you can add real logic later)
        }
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoData = () => {
  return useContext(VideoContext);
};

export default VideoContext;
