import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Compare from './components/Compare';
import Timelines from './components/Timelines';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App-container">
        <NavBar /> 
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/timelines" element={<Timelines />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;