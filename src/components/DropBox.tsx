import React, { useState } from 'react';
import SendButton from './SendButton';
import './DropBox.css';
import { useNavigate } from 'react-router-dom';

const DropBox = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const sendLink = async (url: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'video_url': url })
    };

    const response = await fetch('http://127.0.0.1:8000/ytcreator/api/process_video', requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      console.log(data);
      navigate('/videos'); // Navigate to the Videos page after successful fetch
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
