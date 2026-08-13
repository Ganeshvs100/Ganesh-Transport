import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AddModal from './components/AddModal';
import Sidebar from './components/Sidebar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import TripsPage from './pages/TripsPage';
import ExpensesPage from './pages/ExpensesPage';
import SettingsPage from './pages/SettingsPage';
import RegisterPage from './pages/RegisterPage';

import { createVehicle, createTrip, createTransaction } from './api';
import { Plus } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'Ganesh Shinde',
    email: 'admin@ganeshtransport.com',
    role: 'Fleet Manager & Owner'
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
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
    return (
      <div className={`app-root fullscreen-view ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="app-phone-container">
          {isRegisterPage ? (
            <RegisterPage
              onRegisterSuccess={() => setIsRegisterPage(false)}
              onBackToLogin={() => setIsRegisterPage(false)}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setIsRegisterPage(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`app-root fullscreen-view ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="app-phone-container">
        <div className="app-layout-wrapper">
          {/* Desktop Sidebar Navigation */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
                  : 'Settings'
              }
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onLogout={handleLogout}
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
                />
              )}
            </main>
          </div>
        </div>

        {/* Fixed Floating Action Button (+) */}
        <button
          className="fab-btn"
          onClick={() => setIsAddModalOpen(true)}
          title="Add Item / Entry"
        >
          <Plus size={24} />
        </button>

        {/* Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating Add Modal */}
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddVehicle={handleAddVehicle}
          onAddTrip={handleAddTrip}
          onAddTransaction={handleAddTransaction}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
