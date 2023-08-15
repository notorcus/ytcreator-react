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
  setWordsArray: React.Dispatch<React.SetStateAction<WordType[]>>;
  selectedVideoIndex: number | null;
  setSelectedVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setStartWord: (wordIndex: number) => void;
  setEndWord: (wordIndex: number) => void;
  setActiveWordsForSelectedVideo: (selectedIndex: number, words: WordType[], videoData: VideoData) => WordType[];
}>({
  videoData: defaultVideoData,
  setVideoData: () => {},
  wordsArray: [],
  setWordsArray: () => {}, // Add this placeholder function
  selectedVideoIndex: null,
  setSelectedVideoIndex: () => {},
  setStartWord: () => {},
  setEndWord: () => {},
  setActiveWordsForSelectedVideo: () => []  // Add this placeholder function returning an empty array
});

// Function to set active words for a given video
function setActiveWordsForVideo(video: Video, words: WordType[]): WordType[] {
  const startWordIndex = video.start_idx;
  const endWordIndex = video.end_idx;

  // Set words to active in the range
  for (let i = startWordIndex; i <= endWordIndex; i++) {
    if (words[i]) {
      words[i].isActive = true;
    }
  }
  
  return words;
}

function setActiveWordsForSelectedVideo(selectedIndex: number, words: WordType[], videoData: VideoData): WordType[] {
  if (videoData.data.videos[selectedIndex]) {
    return setActiveWordsForVideo(videoData.data.videos[selectedIndex], words);
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
      
      setWordsArray(extractedWords);
    }
  }, [videoData]);  
  

  useEffect(() => {
    // console.log("wordsArray:", wordsArray);
  }, [wordsArray]);

  const updateActiveWordsForCurrentVideo = (newStartIndex?: number, newEndIndex?: number) => {
    if (selectedVideoIndex === null) return;

    // 1. Update the current video's start and/or end index directly
    if (newStartIndex !== undefined) videoData.data.videos[selectedVideoIndex].start_idx = newStartIndex;
    if (newEndIndex !== undefined) videoData.data.videos[selectedVideoIndex].end_idx = newEndIndex;

    // 2. Reset active words
    const resetWords = wordsArray.map(word => ({ ...word, isActive: false }));

    // 3. Set new active words using the existing function
    const updatedWords = setActiveWordsForSelectedVideo(selectedVideoIndex, resetWords, videoData);
    setWordsArray(updatedWords);
};

return (
    <VideoContext.Provider 
        value={{
            videoData, 
            setVideoData, 
            wordsArray, 
            setWordsArray,
            selectedVideoIndex,
            setSelectedVideoIndex,
            setStartWord: (wordIndex: number) => {
                updateActiveWordsForCurrentVideo(wordIndex);
            },
            setEndWord: (wordIndex: number) => {
                updateActiveWordsForCurrentVideo(undefined, wordIndex);
            },
            setActiveWordsForSelectedVideo
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
