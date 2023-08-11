// PopoverBox.tsx
import React from 'react';
import './PopoverBox.css';

interface PopoverBoxProps {
    action: string;
    onActionButtonClick: () => void;
  }
  
  const PopoverBox: React.FC<PopoverBoxProps> = ({ action, onActionButtonClick }) => {
    return (
        <div className="popover-box">
            <button className="action-button" onClick={onActionButtonClick}>{action}</button>
        </div>
    );
};

  export default PopoverBox;