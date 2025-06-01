import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, username, isLoggedIn, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("sidebar-overlay")) {
      onClose();
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
      <div className="sidebar-overlay" onClick={handleOverlayClick}>
        <div className="sidebar open">
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="sidebar-content">
            <img src="/account_circle.png" alt="Profile" className="sidebar-profile-icon" />
            <div className="sidebar-username">
              <strong>{username}</strong>
            </div>

            {isLoggedIn ? (
                <button className="sidebar-logout-link" onClick={handleLogoutClick}>Logout</button>
            ) : (
                <a href="/authPage.html" className="sidebar-login-link">Login</a>
            )}
            {/* Logout Confirmation Popup */}
            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                  <div className="logout-confirm-popup">
                    <p>Are you sure you want to logout?</p>
                    <div className="logout-buttons">
                      <button onClick={confirmLogout}>Log Out</button>
                      <button onClick={cancelLogout}>Cancel</button>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Sidebar;