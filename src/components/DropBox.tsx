// DropBox.tsx
import React, { useState } from 'react';
import SendButton from './SendButton';
import './DropBox.css';
import { useNavigate } from 'react-router-dom';
import { useVideoData } from '../pages/EditPage/VideoContext';

const DropBox = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const { setVideoData } = useVideoData();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const sendLink = async (url: string) => {
    // Define the body data
    const bodyData = {
      'video_url': url,
      'mode': 'frontend_dev'  // Add this line to set the mode
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    };

    const response = await fetch('http://127.0.0.1:8000/ytcreator/api/process_video', requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      console.log(data);
      setVideoData(data);
      navigate('/videos');
    }
  }

  const handleButtonClick = () => {
    sendLink(text).catch(e => console.log(e));
    setText(''); // clear the text box
  };

  return (
    <div className="dropBoxContainer">
      <input type="text" value={text} onChange={handleInputChange} placeholder="Enter your text here" />
      <SendButton onClick={handleButtonClick} />
    </div>
  );
};

export default DropBox;
