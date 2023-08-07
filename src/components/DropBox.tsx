import React, { useState } from 'react';
import './DropBox.css';

const DropBox = () => {
  const [text, setText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="dropBox">
      <input type="text" value={text} onChange={handleInputChange} placeholder="Drop a YouTube Link" />
    </div>
  );
};

export default DropBox;
