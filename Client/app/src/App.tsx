import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import ProgressBar from "./pages/ProgressBar.tsx";
import QuizScorePage from './pages/quiz_page.tsx';

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/progress" element={<ProgressBar />} />
        <Route path="/quiz/:studentId?" element={<QuizScorePage />} />
      </Routes>
      </Router>
    

  );
}

export default App;




