import { useLocation } from 'react-router-dom';

const VideosPage = () => {
  const location = useLocation();
  const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
  const videoCount = videoData?.data?.videos?.length || 0; 
  

  return (
    <div className="videosPage">
      <h2>Total Videos: {videoCount}</h2>
    </div>
  );
}

export default VideosPage;
