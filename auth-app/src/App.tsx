import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthModule from './AuthModule';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={<AuthModule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
