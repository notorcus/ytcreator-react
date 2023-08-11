import React from 'react';
import './PopoverBox.css';

interface PopoverBoxProps {
    action: string;
  }
  
  const PopoverBox: React.FC<PopoverBoxProps> = ({ action }) => {
    return (
      <div className="popover-box">
        <button className="action-button">{action}</button>
      </div>
    );
  };
  
  export default PopoverBox;
  
  