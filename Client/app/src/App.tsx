import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import ProgressBar from "./pages/ProgressBar.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/progress" element={<ProgressBar />} />
      </Routes>
    </Router>
  );
}

export default App;



import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizScorePage from './pages/quiz_page.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/quiz/:studentId?" element={<QuizScorePage />} />
      <Route path="/" element={<QuizScorePage />} />
    </Routes>
  );
};

export default App;
