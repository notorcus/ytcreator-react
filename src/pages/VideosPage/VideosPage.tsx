// VideosPage.tsx
import { Video } from '../../types/video'; 
import './VideosPage.css';

const VideosPage = () => {
  const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
  const videos = videoData?.data?.videos || [];

  return (
    <div className="videosPage">
      {videos.map((_video: Video, index: number) => (
        <div key={index} className="videoBox">
            Video {index + 1}
        </div>
      ))}
    </div>
  );
}

export default VideosPage;
