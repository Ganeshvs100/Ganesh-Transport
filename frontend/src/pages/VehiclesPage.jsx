import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  AlertTriangle,
  Clock,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { fetchVehicles, deleteVehicle } from '../api';

export default function VehiclesPage({ onOpenAddModal }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    totalFleet: 0,
    criticalExpiry: 0
  });

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchVehicles(search, activeFilter);
      if (res && res.vehicles) {
        setVehicles(res.vehicles);
        if (res.overview) setOverview(res.overview);
      }
      setLoading(false);
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Active', 'Maintenance', 'Overdue'];

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      const prev = vehicles;
      setVehicles(vehicles.filter((v) => v.id !== id));
      const res = await deleteVehicle(id);
      if (!res || !res.success) {
        setVehicles(prev);
        alert(res?.message || 'Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="page-container vehicles-page">
      <h1 className="page-heading">Fleet Overview</h1>

      {/* Fleet Overview Header Banner Cards */}
      <div className="fleet-overview-grid">
        <div className="overview-card fleet-total-card">
          <span className="overview-title">TOTAL FLEET</span>
          <div className="overview-number-row">
            <span className="overview-number">{overview.totalFleet}</span>
            <span className="overview-tag blue-tag">+2% vs last mo.</span>
          </div>
        </div>

        <div className="overview-card fleet-critical-card">
          <span className="overview-title critical-text">CRITICAL EXPIRY</span>
          <div className="overview-number-row">
            <span className="overview-number critical-text">
              {overview.criticalExpiry < 10 ? `0${overview.criticalExpiry}` : overview.criticalExpiry}
            </span>
            <span className="overview-tag red-tag">Immediate Action</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search Vehicle Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="filter-icon-btn" title="Filter Options">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className={`chip ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vehicles Card List */}
      <div className="vehicles-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>Loading fleet vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '16px', background: 'var(--card-bg)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gray-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--text-muted)' }}>
              <Truck size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
              {search || activeFilter !== 'All' ? 'No Matching Vehicles' : 'No Vehicles in Fleet'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', maxWidth: '320px', marginInline: 'auto' }}>
              {search || activeFilter !== 'All' ? 'Try adjusting your search keywords or filter tab.' : 'Start managing your transport by adding your first truck or hauler.'}
            </p>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Add Vehicle
              </button>
            )}
          </div>
        ) : (
          vehicles.map((v) => {
            const isOverdue = v.status.toLowerCase() === 'overdue';
            const isMaintenance = v.status.toLowerCase() === 'maintenance';
            const isActive = v.status.toLowerCase() === 'active';

            return (
              <div key={v.id} className="vehicle-card">
                <div className="vehicle-card-header">
                  <h3 className="vehicle-reg">{v.registration}</h3>
                  <div className="vehicle-card-badges">
                    {v.isLoan && (
                      <span className="loan-badge">🏦 On Loan</span>
                    )}
                    <span
                      className={`status-pill ${
                        isOverdue
                          ? 'pill-red'
                          : isMaintenance
                          ? 'pill-gray'
                          : 'pill-blue'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>

                <div className="vehicle-model">{v.model}</div>

                <div className="vehicle-info-grid">
                  <div className="info-block">
                    <span className="info-label">Insurance Expiry</span>
                    <div className={`info-value ${v.isInsuranceAlert ? 'alert-text-red' : ''}`}>
                      {v.isInsuranceAlert && <AlertTriangle size={14} className="inline-icon red" />}
                      <span>{v.insuranceFormatted || '15 Mar 2025'}</span>
                    </div>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Fitness Expiry</span>
                    <div className={`info-value ${v.isFitnessAlert ? 'alert-text-blue' : ''}`}>
                      {v.isFitnessAlert && <Clock size={14} className="inline-icon blue" />}
                      <span>{v.fitnessFormatted || '02 Feb 2025'}</span>
                    </div>
                  </div>
                </div>

                {/* Loan Info Block */}
                {v.isLoan && (
                  <div className="loan-info-block">
                    <div className="loan-info-row">
                      <span className="loan-info-label">🏦 Financier</span>
                      <span className="loan-info-val">{v.loanBank || '—'}</span>
                    </div>
                    <div className="loan-info-row">
                      <span className="loan-info-label">📅 Monthly EMI</span>
                      <span className="loan-info-val loan-emi">₹{v.loanEmi ? v.loanEmi.toLocaleString('en-IN') : '—'}</span>
                    </div>
                    {v.loanEndDate && (
                      <div className="loan-info-row">
                        <span className="loan-info-label">⏳ Loan Ends</span>
                        <span className="loan-info-val">{new Date(v.loanEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="vehicle-card-footer">
                  <div className="vehicle-location">
                    <MapPin size={14} className="location-icon" />
                    <span>{v.location}</span>
                  </div>

                  <div className="vehicle-actions">
                    <button className="details-link" onClick={() => alert(`Showing full telemetry & details for ${v.registration}`)}>
                      Details <ChevronRight size={14} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(v.id)} title="Delete Vehicle">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
