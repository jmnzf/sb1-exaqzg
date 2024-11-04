import React, { useState } from 'react';
import { Bell, User, LogOut, Maximize, Minimize } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsPanel from './NotificationsPanel';
import '../../styles/nav.css';

export default function Nav() {
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-actions">
            <button 
              className="nav-button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize /> : <Maximize />}
            </button>

            <div className="nav-notifications">
              <button 
                className="nav-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell />
                <span className="notifications-badge">3</span>
              </button>
              {showNotifications && <NotificationsPanel />}
            </div>

            <div className="nav-profile">
              <button 
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                  alt="Profile"
                  className="profile-image"
                />
                <div className="profile-info">
                  <span className="profile-name">{user?.displayName || 'User'}</span>
                  <span className="profile-email">{user?.email}</span>
                </div>
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.displayName || 'User'}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={handleSignOut}>
                    <LogOut className="dropdown-icon" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}