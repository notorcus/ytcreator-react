import React, { useState } from 'react';
import SendButton from './SendButton';
import './DropBox.css';

const DropBox = () => {
  const [text, setText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleButtonClick = () => {
    alert(`You sent: ${text}`);
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
