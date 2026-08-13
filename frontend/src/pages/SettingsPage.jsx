import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Lock,
  Moon,
  Sun,
  Bell,
  Shield,
  Save,
  LogOut,
  CheckCircle2,
  Smartphone,
  Download,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage({ user, onUpdateProfile, isDarkMode, setIsDarkMode, onLogout, onInstallApp, isInstalled }) {
  const [name, setName] = useState(user?.name || 'Ganesh Shinde');
  const [email, setEmail] = useState(user?.email || 'admin@ganeshtransport.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [company, setCompany] = useState('Ganesh Transport Logistics');
  const [location, setLocation] = useState('Navi Mumbai, MH');

  // Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Preference Toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [fastagAuto, setFastagAuto] = useState(true);

  // Status message
  const [savedMsg, setSavedMsg] = useState('');

  const isAdmin = user?.role === 'Admin' || user?.role?.toLowerCase() === 'admin' || user?.username === 'admin' || user?.email === 'admin@ganeshtransport.com';

  const handleProfileSave = (e) => {
    e.preventDefault();
    onUpdateProfile({ name, email, phone, company, location });
    setSavedMsg('Profile updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="page-container settings-page">
      <h1 className="page-heading">Profile & Settings</h1>

      {savedMsg && (
        <div className="success-banner">
          <CheckCircle2 size={16} /> {savedMsg}
        </div>
      )}

      {/* User Header Profile Card */}
      <div className={`profile-header-card ${isAdmin ? 'admin-profile-card' : ''}`}>
        <div className={`profile-avatar-circle ${isAdmin ? 'admin-avatar' : ''}`}>
          {isAdmin ? <Shield size={28} /> : <User size={28} />}
        </div>
        <div className="profile-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 className="profile-name">{name}</h2>
            {isAdmin ? (
              <span className="profile-role-pill admin-badge">
                <Shield size={11} /> Administrator
              </span>
            ) : (
              <span className="profile-role-pill normal-badge">
                <User size={11} /> {user?.role || 'Standard User'}
              </span>
            )}
          </div>
          <p className="profile-role">
            Account Role: <strong style={{ color: isAdmin ? '#2563eb' : '#475569' }}>{user?.role || 'Normal User'}</strong>
          </p>
          <span className="profile-badge">{company}</span>
        </div>
      </div>

      {/* Form 1: Edit Profile Details */}
      <div className="settings-section-card">
        <div className="settings-card-title">
          <User size={18} className="icon-blue" />
          <span>Edit Profile Information</span>
        </div>

        <form onSubmit={handleProfileSave} className="settings-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="field-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="field-icon" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Base Hub Location</label>
              <div className="input-with-icon">
                <MapPin size={16} className="field-icon" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <div className="input-with-icon">
              <Building2 size={16} className="field-icon" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="save-profile-btn">
            <Save size={16} /> Save Profile Changes
          </button>
        </form>
      </div>

      {/* Form 2: Password & Security */}
      <div className="settings-section-card">
        <div className="settings-card-title">
          <Shield size={18} className="icon-blue" />
          <span>Security & Password</span>
        </div>

        <form onSubmit={handlePasswordSave} className="settings-form">
          <div className="form-group">
            <label>Current Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="secondary-btn">
            Update Password
          </button>
        </form>
      </div>

      {/* System Preferences Toggles */}
      <div className="settings-section-card">
        <div className="settings-card-title">
          <Bell size={18} className="icon-blue" />
          <span>App Preferences</span>
        </div>

        <div className="toggles-list">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Dark Theme</span>
              <span className="toggle-desc">Enable high contrast dark mode for night operations</span>
            </div>
            <button
              className={`switch-btn ${isDarkMode ? 'active' : ''}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Theme"
            />
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">SMS Dispatch Alerts</span>
              <span className="toggle-desc">Send automated route updates to drivers via SMS</span>
            </div>
            <button
              className={`switch-btn ${smsAlerts ? 'active' : ''}`}
              onClick={() => setSmsAlerts(!smsAlerts)}
              aria-label="Toggle SMS Dispatch Alerts"
            />
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">FASTag Low Balance Alerts</span>
              <span className="toggle-desc">Notify when toll FASTag balance drops below ₹500</span>
            </div>
            <button
              className={`switch-btn ${fastagAuto ? 'active' : ''}`}
              onClick={() => setFastagAuto(!fastagAuto)}
              aria-label="Toggle FASTag Low Balance Alerts"
            />
          </div>
        </div>
      </div>

      {/* Mobile App Download & Install Section */}
      <div className="settings-section-card pwa-settings-card">
        <div className="settings-card-title">
          <Smartphone size={18} className="icon-blue" />
          <span>Mobile Application</span>
        </div>

        <div className="pwa-install-promo">
          <div className="pwa-promo-info">
            <h4>Ganesh Transport for Mobile</h4>
            <p>
              Install this app directly on your Android or iPhone for ultra-fast startup, instant push alerts, and full offline trip logging.
            </p>
            <div className="pwa-badges-row">
              <span className="pwa-status-pill">
                {isInstalled ? <CheckCircle size={12} className="text-green-500" /> : <Download size={12} />}
                {isInstalled ? 'App Installed on this device' : 'Available for Android & iOS'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="pwa-install-action-btn"
            onClick={onInstallApp}
          >
            <Download size={16} />
            <span>{isInstalled ? 'App Installed' : 'Download / Install App'}</span>
          </button>
        </div>
      </div>

      {/* Logout Action Button */}
      <div className="logout-section-card">
        <button className="full-logout-btn" onClick={onLogout}>
          <LogOut size={18} /> Sign Out of Ganesh Transport
        </button>
      </div>
    </div>
  );
}
