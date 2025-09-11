
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
