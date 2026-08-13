import React from 'react';
import { LayoutDashboard, Navigation, Truck, Wallet, Settings, Shield } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, user }) {
  const isAdmin = user?.role?.trim()?.toLowerCase() === 'admin' || user?.username === 'admin';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'Trips', icon: Navigation },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="nav-icon-container">
              <Icon size={20} />
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
