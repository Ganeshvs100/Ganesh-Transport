import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AddModal from './components/AddModal';
import Sidebar from './components/Sidebar';
import InstallBanner from './components/InstallBanner';
import InstallGuideModal from './components/InstallGuideModal';
import NotificationPanel from './components/NotificationPanel';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useNotifications } from './hooks/useNotifications';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import TripsPage from './pages/TripsPage';
import ExpensesPage from './pages/ExpensesPage';
import SettingsPage from './pages/SettingsPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

import { createVehicle, createTrip, createTransaction } from './api';
import { Plus } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('gt_auth_user') || sessionStorage.getItem('gt_auth_user');
      return !!saved;
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gt_auth_user') || sessionStorage.getItem('gt_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Strictly allow ONLY the 'Admin' role or root 'admin' username to access Admin privileges
  const isAdmin = user?.role?.trim()?.toLowerCase() === 'admin' || user?.username === 'admin';

  const {
    isInstalled,
    isIOS,
    installApp,
    showGuideModal,
    setShowGuideModal
  } = usePWAInstall();

  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);

  const {
    alerts,
    unreadCount,
    permissionStatus,
    lastChecked,
    requestPermission,
    checkExpiryAlerts,
    dismissAlert,
    dismissAll,
  } = useNotifications();

  const handleLoginSuccess = (userData, remember = true) => {
    setUser(userData);
    setIsLoggedIn(true);
    try {
      if (remember) {
        localStorage.setItem('gt_auth_user', JSON.stringify(userData));
        sessionStorage.removeItem('gt_auth_user');
      } else {
        sessionStorage.setItem('gt_auth_user', JSON.stringify(userData));
        localStorage.removeItem('gt_auth_user');
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    try {
      localStorage.removeItem('gt_auth_user');
      sessionStorage.removeItem('gt_auth_user');
    } catch (e) {}
  };

  const handleUpdateProfile = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      try {
        if (localStorage.getItem('gt_auth_user')) {
          localStorage.setItem('gt_auth_user', JSON.stringify(next));
        } else {
          sessionStorage.setItem('gt_auth_user', JSON.stringify(next));
        }
      } catch (e) {}
      return next;
    });
  };

  const handleAddVehicle = async (vehicleData) => {
    await createVehicle(vehicleData);
    setActiveTab('vehicles');
  };

  const handleAddTrip = async (tripData) => {
    await createTrip(tripData);
    setActiveTab('trips');
  };

  const handleAddTransaction = async (txData) => {
    await createTransaction(txData);
    setActiveTab('expenses');
  };

  if (!isLoggedIn) {
    if (isRegisterPage) {
      return (
        <RegisterPage
          onRegisterSuccess={() => setIsRegisterPage(false)}
          onBackToLogin={() => setIsRegisterPage(false)}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setIsRegisterPage(true)}
      />
    );
  }

  return (
    <div className={`app-root fullscreen-view ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="app-phone-container">
        <div className="app-layout-wrapper">
          {/* Desktop Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            user={user}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />

          <div className="app-main-layout">
            {/* Header Bar */}
            <Header
              title={
                activeTab === 'dashboard'
                  ? 'Ganesh Transport'
                  : activeTab === 'vehicles'
                  ? 'Ganesh Transport'
                  : activeTab === 'trips'
                  ? 'Trips'
                  : activeTab === 'expenses'
                  ? 'Expenses & Income'
                  : activeTab === 'admin'
                  ? 'Admin Panel'
                  : 'Settings'
              }
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onLogout={handleLogout}
              user={user}
              isAdmin={isAdmin}
              onInstallApp={installApp}
              isInstalled={isInstalled}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenNotifications={() => setIsNotifPanelOpen(true)}
              notifCount={unreadCount}
            />

            {/* Main Content Area */}
            <main className="app-main-content">
              {activeTab === 'dashboard' && (
                <DashboardPage
                  setActiveTab={setActiveTab}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'vehicles' && (
                <VehiclesPage
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'trips' && (
                <TripsPage
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'expenses' && (
                <ExpensesPage
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  onLogout={handleLogout}
                  onInstallApp={installApp}
                  isInstalled={isInstalled}
                />
              )}

              {activeTab === 'admin' && isAdmin && (
                <AdminPage currentUser={user} />
              )}
            </main>
          </div>
        </div>

        {/* Floating Mobile Install App Banner */}
        <InstallBanner
          isInstalled={isInstalled}
          onInstall={installApp}
        />

        {/* Fixed Floating Action Button (+) */}
        <button
          className="fab-btn"
          onClick={() => setIsAddModalOpen(true)}
          title="Add Item / Entry"
        >
          <Plus size={24} />
        </button>

        {/* Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* Floating Add Modal */}
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddVehicle={handleAddVehicle}
          onAddTrip={handleAddTrip}
          onAddTransaction={handleAddTransaction}
          activeTab={activeTab}
        />

        {/* Step-by-step PWA Install Guide Modal */}
        <InstallGuideModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          isIOS={isIOS}
          onInstallPrompt={installApp}
        />

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={isNotifPanelOpen}
          onClose={() => setIsNotifPanelOpen(false)}
          alerts={alerts}
          unreadCount={unreadCount}
          permissionStatus={permissionStatus}
          onRequestPermission={async () => {
            const result = await requestPermission();
            if (result === 'granted') checkExpiryAlerts(false);
          }}
          onDismiss={dismissAlert}
          onDismissAll={dismissAll}
          onRefresh={() => checkExpiryAlerts(false)}
          lastChecked={lastChecked}
        />
      </div>
    </div>
  );
}
