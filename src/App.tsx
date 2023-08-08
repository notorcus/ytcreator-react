import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage/HomePage';
import EditPage from './pages/EditPage/EditPage';
import VideosPage from './pages/VideosPage/VideosPage';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />

        <Routes>
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/edit/:videoId" element={<EditPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
