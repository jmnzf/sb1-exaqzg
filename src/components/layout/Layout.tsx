import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Nav from './Nav';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/layout.css';

export default function Layout() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`layout ${isDarkMode ? 'dark' : ''}`}>
      <Nav />
      <Sidebar />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}