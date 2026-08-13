import React from 'react';
import { Truck, Bell, Moon, Sun, Shield, User, Download, LogOut } from 'lucide-react';

export default function Header({
  title,
  isDarkMode,
  setIsDarkMode,
  onLogout,
  user,
  isAdmin,
  onInstallApp,
  isInstalled,
  onOpenNotifications,
  notifCount = 0,
}) {
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
        {/* Download App Button */}
        {!isInstalled && onInstallApp && (
          <button
            className="header-download-btn"
            onClick={onInstallApp}
            title="Download & Install Mobile App"
          >
            <Download size={14} className="download-icon" />
            <span className="download-text">App</span>
          </button>
        )}

        {/* Role Pill */}
        <div
          className={`header-role-pill ${isAdmin ? 'admin-pill' : 'normal-pill'}`}
          title={`Logged in as ${user?.role || 'User'}`}
        >
          {isAdmin
            ? <Shield size={12} className="pill-icon" />
            : <User size={12} className="pill-icon" />}
          <span className="pill-text">{isAdmin ? 'Admin' : (user?.role || 'User')}</span>
        </div>

        {/* Dark/Light Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        {/* Notification Bell */}
        <button
          className={`icon-btn notification-btn ${notifCount > 0 ? 'has-alerts' : ''}`}
          onClick={onOpenNotifications}
          title={notifCount > 0 ? `${notifCount} expiry alerts` : 'Notifications'}
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="notif-count-badge">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {/* Quick Header Logout Button */}
        {onLogout && (
          <button
            className="icon-btn header-logout-icon-btn"
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
