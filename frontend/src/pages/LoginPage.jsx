import React, { useState } from 'react';
import { Truck, User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginUser } from '../api';

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('admin@ganeshtransport.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginUser(username, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-wrapper">
        {/* Top Header Branding */}
        <div className="login-header">
          <div className="login-logo-box">
            <Truck size={30} className="login-logo-icon" />
          </div>
          <h1 className="login-title">Ganesh Transport</h1>
          <p className="login-subtitle">Enterprise Fleet Management</p>
        </div>

        {/* White Form Container Card */}
        <div className="login-form-card">
          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label>Username or Email</label>
              <div className="input-with-icon">
                <User size={16} className="field-icon" />
                <input
                  type="text"
                  placeholder="Enter your credentials"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

            <div className="login-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please contact administrator to reset password.');
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-contact">
            <p>
              Don't have an account?{' '}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToRegister();
                }}
              >
                Register & Request Approval
              </a>
            </p>
          </div>
        </div>

        {/* Security & Copyright Footer */}
        <div className="login-footer">
          <div className="security-badge">
            <ShieldCheck size={14} className="security-icon" />
            <span>SECURE 256-BIT ENCRYPTION</span>
          </div>
          <div className="copyright-text">
            © 2024 Ganesh Transport Logistics
          </div>
        </div>
      </div>
    </div>
  );
}
