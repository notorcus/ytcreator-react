// VideosPage.tsx
import { Video } from '../../types/video'; 
import { Link } from 'react-router-dom';
import './VideosPage.css';

const VideosPage = () => {
  const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
  const videos = videoData?.data?.videos || [];

  return (
    <div className="videosPage">
      {videos.map((_video: Video, index: number) => (
        <Link to={`/edit/${index + 1}`} key={index} style={{ color: 'white', textDecoration: 'none' }}>
            <div className="videoBox">
                Video {index + 1}
            </div>
        </Link>
      ))}
    </div>
  );
}

export default VideosPage;
