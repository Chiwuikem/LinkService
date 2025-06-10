import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'; // Added FiSettings
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">S</div>
      <ul className="sidebar-links">
        <li>
          <Link to="/" title="Home">
            <FiHome size={50} />
          </Link>
        </li>
        <li>
          <Link to="/profile" title="Profile">
            <FiUser size={50} />
          </Link>
        </li>
        <li>
          <Link to="/settings" title="Settings">
            <FiSettings size={50} />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
