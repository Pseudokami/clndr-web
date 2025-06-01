// src/App.jsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import './index.css';
import './App.css';

function App() {
  const [username, setUsername] = useState('Guest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userFromURL = params.get('user');

    if (userFromURL) {
      setUsername(userFromURL);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setUsername('Guest');
    setIsLoggedIn(false);

    // Optional: Remove query params from URL
    const url = new URL(window.location);
    url.searchParams.delete('user');
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="app-wrapper">
      <Header
        username={username}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="calendar-wrapper">
        <Calendar username={username}/>
      </main>
    </div>
  );
}

export default App;
