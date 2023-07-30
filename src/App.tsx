// App.tsx
// import React from 'react';
import './App.css';
import Transcript from './components/Transcript';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <div className="App">
      <div className="main-content">
        <VideoPlayer />
        <div className="transcript-wrapper">
          <Transcript />
        </div>
      </div>
    </div>
  );
}

export default App;
