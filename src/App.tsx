import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ReasonPage from './pages/ReasonPage';
import ResultPage from './pages/ResultPage';
import HotPage from './pages/HotPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reason" element={<ReasonPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/hot" element={<HotPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;