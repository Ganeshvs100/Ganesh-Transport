import React, { useState } from 'react';
import { Truck, User, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Briefcase, Building2, Shield, Navigation } from 'lucide-react';
import { registerUser } from '../api';

export default function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Owner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUser({ username, email, password, name, role });
      if (res.success) {
        setSuccessMsg(res.message || 'Registration request submitted! Please wait for admin approval.');
        setTimeout(() => {
          onRegisterSuccess();
        }, 2500);
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (selectedRole) => {
    switch (selectedRole) {
      case 'Admin':
        return {
          icon: Shield,
          color: '#1d4ed8',
          bg: '#eff6ff',
          border: '#bfdbfe',
          text: 'Admin: Full administrative control (User Approvals, Role Assignment & Admin Panel).'
        };
      case 'Owner':
        return {
          icon: Building2,
          color: '#0f172a',
          bg: '#f8fafc',
          border: '#cbd5e1',
          text: 'Owner: Executive business access (Fleet, Trips, Income/Expenses & Analytics).'
        };
      case 'Co-Owner':
        return {
          icon: Briefcase,
          color: '#334155',
          bg: '#f8fafc',
          border: '#cbd5e1',
          text: 'Co-Owner: Partner management access (Live Fleet, Trips & Financial Ledger).'
        };
      case 'Fleet Manager':
        return {
          icon: Truck,
          color: '#2563eb',
          bg: '#f0fdf4',
          border: '#bbf7d0',
          text: 'Fleet Manager: Operational access for vehicle maintenance, compliance & insurance.'
        };
      case 'Dispatcher':
        return {
          icon: Navigation,
          color: '#0891b2',
          bg: '#ecfeff',
          border: '#a5f3fc',
          text: 'Dispatcher: Route dispatching, driver assignments, and active trip updates.'
        };
      case 'Driver':
        return {
          icon: Truck,
          color: '#475569',
          bg: '#f8fafc',
          border: '#e2e8f0',
          text: 'Driver: Commercial vehicle driving, route navigation, and delivery status.'
        };
      default:
        return {
          icon: User,
          color: '#475569',
          bg: '#f8fafc',
          border: '#e2e8f0',
          text: 'Standard operational member.'
        };
    }
  };

  const roleInfo = getRoleDescription(role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="login-screen">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo-box">
            <Truck size={30} className="login-logo-icon" />
          </div>
          <h1 className="login-title">Register Account</h1>
          <p className="login-subtitle">Ganesh Transport Management Portal</p>
        </div>

        <div className="login-form-card">
          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          {successMsg && <div className="success-banner">{successMsg}</div>}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Username</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    placeholder="yourname@ganeshtransport.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label>Select Role</label>
                <div className="input-with-icon">
                  <Briefcase size={16} className="field-icon" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '38px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}
                  >
                    <option value="Owner">Owner (Business Owner)</option>
                    <option value="Co-Owner">Co-Owner (Transport Partner)</option>
                    <option value="Fleet Manager">Fleet Manager (Fleet Operations)</option>
                    <option value="Dispatcher">Dispatcher (Trips & Logistics)</option>
                    <option value="Driver">Driver (Fleet Driver)</option>
                    <option value="Admin">Admin (System Administrator)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Role Info Preview Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: roleInfo.bg,
                  border: `1px solid ${roleInfo.border}`,
                  fontSize: '0.74rem',
                  color: roleInfo.color,
                  lineHeight: '1.4'
                }}
              >
                <RoleIcon size={16} style={{ flexShrink: 0 }} />
                <span>{roleInfo.text}</span>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '6px' }}>
                {loading ? 'Submitting...' : 'Register & Request Approval'}
              </button>
            </form>
          )}

          <div className="login-contact" style={{ marginTop: '15px' }}>
            <button
              onClick={onBackToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </div>
        </div>

        <div className="login-footer">
          <div className="security-badge">
            <ShieldCheck size={14} className="security-icon" />
            <span>SECURE SUBMISSION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
