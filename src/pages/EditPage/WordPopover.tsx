import React from 'react';
import './PopoverBox.css';

interface WordPopoverProps {
  wordStatus: 'active' | 'inactive';
  relativePosition: 'before' | 'after' | 'isolated' | undefined;
}

const WordPopover: React.FC<WordPopoverProps> = ({ wordStatus, relativePosition }) => {
  if (wordStatus === 'active') {
    return (
      <div className="popover-box">
        <button className="action-button">Set Start</button>
        <button className="action-button">Set End</button>
      </div>
    );
  } else {
    if (relativePosition === 'before') {
      return (
        <div className="popover-box">
          <button className="action-button">Set Start</button>
        </div>
      );
    } else if (relativePosition === 'after') {
      return (
        <div className="popover-box">
          <button className="action-button">Set End</button>
        </div>
      );
    } else {
      // For 'isolated', we don't return anything as per your specification.
      return null;
    }
  }
};

export default WordPopover;
