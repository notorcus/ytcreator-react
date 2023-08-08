// VideosPage.tsx
import { Link } from 'react-router-dom';
import './VideosPage.css';
import { useVideoData } from '../EditPage/VideoContext';

const VideosPage = () => {
  const { videoData } = useVideoData();
  const videos = videoData?.data?.videos || [];

  return (
    <div className="videosPage">
      {videos.map((video, index) => (
        <Link to={`/edit/${index + 1}`} key={index} style={{ color: 'white', textDecoration: 'none' }}>
            <div className="videoBox">
                {`Video ${index + 1}`}
            </div>
        </Link>
      ))}
    </div>
  );
}

export default VideosPage;
