// App.js
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from 'react';
import Home from './Screen/home';
import Profile from './Screen/profile';
import Help from './Screen/help';
import Settings from './Screen/settings';
import Sidebar from './sidebar';

function App() {

  return (
    <Router>
      <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
    </Router>
  );
}

export default App;