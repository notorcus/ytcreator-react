import React, { createContext, useState, useContext } from 'react';
import { WordType } from './Transcript';

interface Video {
  start_time: string;
  end_time: string;
}

interface VideoData {
  status: string;
  message: string;
  data: {
    videos: Video[];
    transcript: WordType[]; // assuming WordType is the type for transcript entries
  };
}

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
}>({
  videoData: defaultVideoData,
  setVideoData: () => {},
});

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videoData, setVideoData] = useState(defaultVideoData);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoData = () => {
  return useContext(VideoContext);
};

export default VideoContext;
