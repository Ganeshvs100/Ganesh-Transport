import React from 'react';
import { LayoutDashboard, Navigation, Truck, Wallet, Settings, LogOut, Shield } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const isAdmin = user?.role?.trim()?.toLowerCase() === 'admin' || user?.username === 'admin';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'Trips', icon: Navigation },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Truck size={20} className="logo-icon" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-name">Ganesh Transport</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted, #94a3b8)', letterSpacing: '0.5px' }}>
            {isAdmin ? 'ADMINISTRATOR' : 'OPERATIONAL PORTAL'}
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''} ${item.id === 'admin' ? 'admin-nav-item' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
              {item.id === 'admin' && (
                <span className="nav-admin-chip">PRO</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-pill">
          <div className="sidebar-user-avatar">
            {isAdmin ? <Shield size={14} /> : (user?.name?.[0] || 'U')}
          </div>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className={`sidebar-user-role ${isAdmin ? 'role-admin' : 'role-normal'}`}>
              {isAdmin ? 'Admin' : (user?.role || 'Normal User')}
            </span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
