import React from "react";
<<<<<<< HEAD
import Dashboard from "./pages/Dashboard.tsx";

function App() {
  return <Dashboard />;
}

export default App;
=======
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

>>>>>>> 375ef334c27f8da314f1155897aea6df41e0e61e
