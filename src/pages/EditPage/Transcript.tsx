// Transcript.tsx
import React, { useState, useEffect } from 'react';
import Word from './Word';
import './Transcript.css';
import { Popover } from 'react-tiny-popover';
import PopoverBox from './PopoverBox';
import WordPopover from './WordPopover';

export interface WordType {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker: string;
  isActive: boolean;
}

interface Entry {
  start: number;
  end: number;
  text: string;
  words: WordType[];
  speaker: string;
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface TranscriptProps {
  currentTime: number;
  onWordClick: (time: number) => void;
  playing: boolean;
  setSubtitles: React.Dispatch<React.SetStateAction<Subtitle[]>>;
  onActiveWordsChange: (start: number, end: number) => void;
  startTime: number;
  endTime: number;
}


const computeSubtitles = (words: WordType[]): Subtitle[] => {
  const groups: WordType[][] = [];
  let group: WordType[] = [];
  words.forEach(word => {
    group.push(word);
    if (word.word.endsWith('.') || word.word.endsWith('?') || word.word.endsWith(',')) {
      groups.push(group);
      group = [];
    }
  });
  if (group.length > 0) {
    groups.push(group);
  }

  const subtitles: Subtitle[] = [];
  groups.forEach(group => {
    const minWords = 2;
    const maxWords = 4;
    const avgWords = Math.round((minWords + maxWords) / 2);
    let i = 0;
    while (i < group.length) {
      let subtitleWords = group.slice(i, i + avgWords);
      const subtitle = {
        start: subtitleWords[0].start,
        end: subtitleWords[subtitleWords.length - 1].end,
        text: subtitleWords.map(word => word.word).join(' ')
      };
      subtitles.push(subtitle);
      i += avgWords;
    }
  });

  return subtitles;
};

const Transcript: React.FC<TranscriptProps> = ({ 
  currentTime, 
  onWordClick, 
  playing, 
  setSubtitles, 
  onActiveWordsChange,
  startTime,
  endTime,
}) => {
  const [words, setWords] = useState<WordType[]>([]);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedWordIndices, setSelectedWordIndices] = useState<{ start: number, end: number } | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number, left: number } | null>(null);
  const [action, setAction] = useState<string>("Add");
  const [relativePosition, setRelativePosition] = useState<'before' | 'after' | 'isolated'>();
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/MW Hormozi.json')
      .then((res) => res.json())
      .then((data: Entry[]) => {
        const activeWords = data.flatMap(entry => entry.words.map(word => ({
          ...word,
          isActive: word.start >= startTime && word.end <= endTime
        })));
        setWords(activeWords);
        setSubtitles(computeSubtitles(activeWords));

        // Control video playback based on active words
        const firstActiveWord = activeWords.find(word => word.isActive);
        const lastActiveWord = [...activeWords].reverse().find(word => word.isActive);
        
        if (firstActiveWord && lastActiveWord) {
          onActiveWordsChange(firstActiveWord.start, lastActiveWord.end);
        }
      })
      .catch((err) => console.error("Error loading JSON file:", err));
  }, [startTime, endTime]); 


  useEffect(() => {
    if (playing) {
      setClickedWordIndex(null);
    }
  }, [playing]);

  useEffect(() => {
    const highlightInterval = setInterval(() => {
      const currentWordIndex = words.findIndex(
        word => word.start <= currentTime && word.end >= currentTime
      );
      setHighlightedWordIndex(currentWordIndex);
    }, 10); // Check every 100ms

    return () => {
      clearInterval(highlightInterval); // Clear the interval when the component is unmounted or when needed
    };
  }, [words, currentTime]);

  const handleMouseUp = () => {
    const selectedText = window.getSelection();
    if (selectedText && selectedText.toString().length > 0) {
        const range = selectedText.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setAnchorPosition({ top: rect.top, left: rect.left });

        // Directly extract the index from the data attribute
        const anchorElement = selectedText.anchorNode?.parentElement;
        const focusElement = selectedText.focusNode?.parentElement;

        if (anchorElement && focusElement) {
            const startIndexStr = anchorElement.getAttribute('data-index');
            const endIndexStr = focusElement.getAttribute('data-index');

            if (startIndexStr && endIndexStr) {
                const startIndex = parseInt(startIndexStr, 10);
                const endIndex = parseInt(endIndexStr, 10);

                setSelectedWordIndices({ start: startIndex, end: endIndex });  // Update the selected indices state
                const selectedWordsArray = words.slice(startIndex, endIndex + 1).map(w => w.word);
                setSelectedWords(selectedWordsArray);
                
                if (selectedWordIndices) {
                    const selectedWordsActiveStatus = words.slice(startIndex, endIndex + 1).map(w => w.isActive);
                    if (selectedWordsActiveStatus.every(status => status)) {
                        setAction("Remove");
                    } else {
                        setAction("Add");
                    }
                }
                if (selectedWordIndices && selectedWordIndices.start === selectedWordIndices.end) {
                  determineRelativePosition(selectedWordIndices.start);
              }
            }
        }
        setIsTextSelected(true);  // Then set the isTextSelected state
    } else {
        setIsTextSelected(false);
    }
    
    // Safeguard against potential null or undefined values
    if (selectedText) {
        selectedText.removeAllRanges();
    }
  };



  const handleClick = (index: number) => {
    setClickedWordIndex(index);

    onWordClick(words[index].start);

    setSelectedWordIndices({ start: index, end: index });

    // Get the bounding box of the clicked word to set the anchor position
    const wordElement = document.querySelector(`[data-index="${index}"]`);
    if (wordElement) {
        const rect = wordElement.getBoundingClientRect();
        setAnchorPosition({ top: rect.top, left: rect.left });
    }

    setIsTextSelected(true); // Show the popover when a word is clicked
    determineRelativePosition(index);  // Determine the relative position
    onWordClick(words[index].start);
  };

  const currentWordIndex = words.findIndex(
    word => word.start <= currentTime && word.end >= currentTime
  );

  const determineRelativePosition = (index: number) => {
    const selectedWord = words[index];
    if (selectedWord.isActive) {
        setRelativePosition('isolated');
    } else {
        const activeWords = words.filter(w => w.isActive);
        const lastActiveWord = activeWords[activeWords.length - 1];
        if (selectedWord.start < activeWords[0].start) {
            setRelativePosition('before');
        } else if (selectedWord.start > lastActiveWord.start) {
            setRelativePosition('after');
        }
    }
  };


  const handleWordChange = (newWord: string, index: number) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], word: newWord };
    setWords(newWords);
    setSubtitles(computeSubtitles(newWords));
  };

  const handleActionButtonClick = () => {
    if (selectedWordIndices) {
        const updatedWords = [...words];
        for (let i = selectedWordIndices.start; i <= selectedWordIndices.end; i++) {
            updatedWords[i].isActive = action === "Add";
        }
        setWords(updatedWords);
      }
    };

  return (
    <div className="transcript" onMouseUp={handleMouseUp}>
      {words.map((word, i) => (
        <Word 
          key={i} 
          word={word} 
          onClick={() => handleClick(i)} 
          onWordChange={(newWord) => handleWordChange(newWord, i)}
          index={i}
          isWordPlaying={i === highlightedWordIndex}
          selectedWordIndices={selectedWordIndices}
        />
      ))}
      <Popover
          isOpen={isTextSelected}
          positions={['top', 'right', 'bottom', 'left']}
          content={
              selectedWordIndices && selectedWordIndices.start === selectedWordIndices.end ? 
              <WordPopover wordStatus={words[selectedWordIndices.start].isActive ? 'active' : 'inactive'} relativePosition={relativePosition} /> : 
              <PopoverBox 
                  action={action} 
                  onActionButtonClick={handleActionButtonClick}
              />
          }
      >
          <span style={{ position: 'absolute', top: anchorPosition?.top, left: anchorPosition?.left }}></span>
      </Popover>
    </div>
  );  
};

export default Transcript;