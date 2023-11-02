// Types.ts
export type WordDetail = {
  word: string;
  start: number;
  end: number;
};

export type WordType = {
  word: string;
  start: number;
  end: number;
  isActive?: boolean;
};

export type Video = {
  start_idx: number;
  end_idx: number;
};

export type VideoData = {
  video_path: any;
  status: string;
  message: string;
  data: {
    videos: Video[];
    transcript: WordDetail[];
  };
};
