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
import { fetchVehicles } from '../api';

export default function VehiclesPage({ onOpenAddModal }) {
  const [vehicles, setVehicles] = useState([
    {
      id: 'v1',
      registration: 'MH-12-PQ-8842',
      model: 'Tata Prima - 10 Wheeler Hauler',
      status: 'Overdue',
      insuranceFormatted: '24 Oct 2023',
      fitnessFormatted: '12 Dec 2024',
      location: 'Navi Mumbai',
      isInsuranceAlert: true
    },
    {
      id: 'v2',
      registration: 'KA-01-FR-1120',
      model: 'Eicher Pro 3015 - Cargo Van',
      status: 'Active',
      insuranceFormatted: '15 Mar 2025',
      fitnessFormatted: '02 Feb 2025',
      location: 'Bengaluru Hub'
    },
    {
      id: 'v3',
      registration: 'HR-55-XY-0092',
      model: 'Ashok Leyland - Tipper',
      status: 'Maintenance',
      insuranceFormatted: '18 Jan 2025',
      fitnessFormatted: '02 Nov 2024',
      location: 'Workshop B',
      isFitnessAlert: true
    },
    {
      id: 'v4',
      registration: 'UP-14-DT-7763',
      model: 'Mahindra Blazo - Haulage',
      status: 'Active',
      insuranceFormatted: '14 Nov 2024',
      fitnessFormatted: '05 Mar 2025',
      location: 'Delhi Gateway'
    }
  ]);

  const [overview, setOverview] = useState({
    totalFleet: 124,
    criticalExpiry: 8
  });

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      const res = await fetchVehicles(search, activeFilter);
      if (res && res.vehicles) {
        setVehicles(res.vehicles);
        if (res.overview) setOverview(res.overview);
      }
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Active', 'Maintenance', 'Overdue'];

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      setVehicles(vehicles.filter((v) => v.id !== id));
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
        {vehicles.map((v) => {
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
        })}
      </div>
    </div>
  );
}
