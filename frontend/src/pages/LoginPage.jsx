import React, { useState } from 'react';
import { Truck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api';

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Support email login — pass email as the username field
      const res = await loginUser(email, password);
      if (res.success) {
        onLoginSuccess(res.user, rememberMe);
      } else {
        setErrorMsg(res.message || 'Invalid email or password');
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
        {/* Branding Header */}
        <div className="login-header">
          <div className="login-logo-box">
            <Truck size={30} className="login-logo-icon" />
          </div>
          <h1 className="login-title">Ganesh Transport</h1>
          <p className="login-subtitle">Enterprise Fleet Management</p>
        </div>

        {/* Form Card */}
        <div className="login-form-card">
          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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
                  autoComplete="email"
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
                  autoComplete="current-password"
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
                  alert('Please contact administrator to reset your password.');
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

        {/* Footer */}
        <div className="login-footer">
          <div className="copyright-text">© 2024 Ganesh Transport Logistics</div>
        </div>
      </div>
    </div>
  );
}
