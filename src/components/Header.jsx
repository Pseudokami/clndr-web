// src/components/Header.jsx
import React, { useState } from 'react';
import '../index.css';
import Sidebar from './Sidebar';

const Header = ({ username, isLoggedIn, onLogout }) => { 
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header>
      <img className="clndr" src="/Clndr..png" alt="Logo" />

      <div className="accountDisplay">
        <div className="userPlaceholder">
          <div className="userBox"></div>
          <div className="userText">{username}</div>
        </div>
        <img
          className="account_icon"
          src="/account_circle.png"
          alt="Account Icon"
          onClick={toggleSidebar}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        username={username}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
    </header>
  );
};

export default Header;
