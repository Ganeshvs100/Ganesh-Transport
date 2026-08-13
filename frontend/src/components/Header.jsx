import React from 'react';
import { Truck, Bell, Moon, Sun, Shield, User, Download, Smartphone, Plus } from 'lucide-react';

export default function Header({ title, isDarkMode, setIsDarkMode, onLogout, user, isAdmin, onInstallApp, isInstalled, onOpenAddModal }) {
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
        {/* Quick Add Entry Button (Web & Mobile) */}
        {onOpenAddModal && (
          <button
            className="header-quick-add-btn"
            onClick={onOpenAddModal}
            title="Add Vehicle, Trip, or Transaction"
          >
            <Plus size={14} />
            <span className="add-btn-text">Add</span>
          </button>
        )}

        {/* Download App Button (Mobile / Web) */}
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

        {/* Role Pill Indicator */}
        <div className={`header-role-pill ${isAdmin ? 'admin-pill' : 'normal-pill'}`} title={`Logged in as ${user?.role || 'User'}`}>
          {isAdmin ? <Shield size={13} className="pill-icon" /> : <User size={13} className="pill-icon" />}
          <span className="pill-text">{isAdmin ? 'Admin' : (user?.role || 'Normal User')}</span>
        </div>

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
      </div>
    </header>
  );
}


