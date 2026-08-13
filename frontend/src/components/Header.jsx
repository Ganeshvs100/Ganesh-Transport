import React from 'react';
import { Truck, Bell, Moon, Sun, LogOut } from 'lucide-react';

export default function Header({ title, isDarkMode, setIsDarkMode, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-brand">
          <div className="brand-logo">
            <Truck size={18} className="logo-icon" />
          </div>
          <span className="brand-name">{title || 'Ganesh Transport'}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Dark / Light Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        {/* Notification Bell */}
        <button className="icon-btn notification-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-badge"></span>
        </button>

        {/* Logout Button (Replaces human icon) */}
        <button className="logout-btn" onClick={onLogout} title="Logout of गणेश Transport">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
