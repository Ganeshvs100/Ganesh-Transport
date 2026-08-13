import React from 'react';
import { LayoutDashboard, Navigation, Truck, Wallet, Settings, LogOut, Shield } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const isAdmin = user?.role === 'Fleet Manager' || user?.role?.includes('Manager') || user?.role === 'Owner' || user?.role === 'Co-Owner' || user?.email === 'admin@ganeshtransport.com';
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
        <span className="brand-name">Ganesh Transport</span>
      </div>

      <nav className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
