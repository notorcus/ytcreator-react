import React, { useContext } from 'react';
import './PopoverBox.css';
import VideoContext from './VideoContext';

interface WordPopoverProps {
  wordStatus: 'active' | 'inactive';
  relativePosition: 'before' | 'after' | 'isolated' | undefined;
  wordIndex: number;
}

const WordPopover: React.FC<WordPopoverProps> = ({ wordStatus, relativePosition, wordIndex }) => {
  const { wordsArray, setStartWord, setEndWord } = useContext(VideoContext);

  const handleSetStart = () => {
    if (setStartWord) {
      setStartWord(wordIndex);
    }
  };

  const handleSetEnd = () => {
    if (setEndWord) {
      setEndWord(wordIndex);
    }
  };

  if (wordStatus === 'active') {
    return (
      <div className="popover-box">
        <button className="action-button" onClick={handleSetStart}>Set Start</button>
        <button className="action-button" onClick={handleSetEnd}>Set End</button>
      </div>
    );
  } else {
    if (relativePosition === 'before') {
      return (
        <div className="popover-box">
          <button className="action-button" onClick={handleSetStart}>Set Start</button>
        </div>
      );
    } else if (relativePosition === 'after') {
      return (
        <div className="popover-box">
          <button className="action-button" onClick={handleSetEnd}>Set End</button>
        </div>
      );
    } else {
      return null;
    }
  }
};

export default WordPopover;
