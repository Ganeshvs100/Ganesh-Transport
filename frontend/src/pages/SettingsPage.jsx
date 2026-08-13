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
  Check,
  X
} from 'lucide-react';
import { fetchPendingUsers, approveUser, rejectUser } from '../api';

export default function SettingsPage({ user, onUpdateProfile, isDarkMode, setIsDarkMode, onLogout }) {
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

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const isAdmin = user?.role === 'Fleet Manager' || user?.role?.includes('Manager') || user?.email === 'admin@ganeshtransport.com';

  useEffect(() => {
    if (isAdmin) {
      loadPending();
    }
  }, [isAdmin]);

  const loadPending = async () => {
    try {
      const res = await fetchPendingUsers();
      if (res && res.success) {
        setPendingApprovals(res.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await approveUser(userId);
      if (res && res.success) {
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
        alert(res.message);
      }
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this registration request?')) return;
    try {
      const res = await rejectUser(userId);
      if (res && res.success) {
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
        alert(res.message);
      }
    } catch (err) {
      alert('Rejection failed.');
    }
  };

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
      <div className="profile-header-card">
        <div className="profile-avatar-circle">
          <User size={28} />
        </div>
        <div className="profile-header-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">Fleet Manager & Owner</p>
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
            >
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">SMS Dispatch Alerts</span>
              <span className="toggle-desc">Send automated route updates to drivers via SMS</span>
            </div>
            <button
              className={`switch-btn ${smsAlerts ? 'active' : ''}`}
              onClick={() => setSmsAlerts(!smsAlerts)}
            >
              {smsAlerts ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">FASTag Low Balance Alerts</span>
              <span className="toggle-desc">Notify when toll FASTag balance drops below ₹500</span>
            </div>
            <button
              className={`switch-btn ${fastagAuto ? 'active' : ''}`}
              onClick={() => setFastagAuto(!fastagAuto)}
            >
              {fastagAuto ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Approvals List */}
      {isAdmin && (
        <div className="settings-section-card">
          <div className="settings-card-title">
            <Shield size={18} className="icon-blue" />
            <span>Pending User Registrations</span>
          </div>

          {pendingApprovals.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', padding: '10px 0' }}>
              No pending registrations found.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingApprovals.map((pendingUser) => (
                <div
                  key={pendingUser.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--gray-bg)'
                  }}
                  className="pending-user-row"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {pendingUser.name} (@{pendingUser.username})
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {pendingUser.email} • Role: <strong>{pendingUser.role}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleApprove(pendingUser.id)}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(pendingUser.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logout Action Button */}
      <div className="logout-section-card">
        <button className="full-logout-btn" onClick={onLogout}>
          <LogOut size={18} /> Sign Out of Ganesh Transport
        </button>
      </div>
    </div>
  );
}
