// VideosPage.tsx
import { Link } from 'react-router-dom';
import './VideosPage.css';
import { useVideoData } from '../EditPage/VideoContext';

const VideosPage = () => {
  const { videoData } = useVideoData();
  const videos = videoData?.data?.videos || [];

  // For debugging purposes, logging each video's start and end time
  videos.forEach((video, index) => {
    console.log(`Video ${index + 1}: Start Time - ${video.start_time}, End Time - ${video.end_time}`);
  });

  return (
    <div className="videosPage">
      {videos.map((video, index) => (
        <Link to={`/edit/${index + 1}`} key={index} style={{ color: 'white', textDecoration: 'none' }}>
            <div className="videoBox">
                {`Video ${index + 1}: Start Time - ${video.start_time}, End Time - ${video.end_time}`}
            </div>
        </Link>
      ))}
    </div>
  );
}

export default VideosPage;
