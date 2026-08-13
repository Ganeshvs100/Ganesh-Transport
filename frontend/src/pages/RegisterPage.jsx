import React, { useState } from 'react';
import { Truck, User, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Briefcase } from 'lucide-react';
import { registerUser } from '../api';

export default function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Dispatcher');
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
        }, 3000);
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo-box">
            <Truck size={30} className="login-logo-icon" />
          </div>
          <h1 className="login-title">Register Account</h1>
          <p className="login-subtitle">Submit Approval Request</p>
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
                    placeholder="Ganesh Shinde"
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
                    placeholder="ganesh_shinde"
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
                    placeholder="ganesh@ganeshtransport.com"
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
                      height: '42px',
                      paddingLeft: '38px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Driver">Driver</option>
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Owner">Owner</option>
                    <option value="Co-Owner">Co-Owner</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
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
