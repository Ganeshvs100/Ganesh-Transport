import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, Truck, AlertTriangle, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { fetchTrips } from '../api';

export default function TripsPage({ onOpenAddModal }) {
  const [trips, setTrips] = useState([
    {
      id: 't1',
      tripCode: '#TR-89231',
      origin: 'Mumbai',
      destination: 'Ahmedabad',
      status: 'In Transit',
      vehicle: 'MH-01-AX-4592',
      amount: 42500,
      lastUpdated: '2 hrs ago'
    },
    {
      id: 't2',
      tripCode: '#TR-89245',
      origin: 'Pune',
      destination: 'Bangalore',
      status: 'Delayed',
      vehicle: 'MH-12-BY-8821',
      amount: 38200,
      alert: 'Traffic Congestion at Kolhapur',
      lastUpdated: '30 mins ago'
    },
    {
      id: 't3',
      tripCode: '#TR-89190',
      origin: 'Surat',
      destination: 'Delhi',
      status: 'Delivered',
      vehicle: 'GJ-05-CT-1211',
      amount: 65000,
      deliveredTime: '14 Oct, 04:30 PM'
    },
    {
      id: 't4',
      tripCode: '#TR-89260',
      origin: 'Chennai',
      destination: 'Hyderabad',
      status: 'In Transit',
      vehicle: 'TN-07-3K-3004',
      amount: 29800,
      eta: 'Tomorrow, 10:00 AM'
    }
  ]);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      const res = await fetchTrips(search, activeFilter);
      if (res && res.trips) {
        setTrips(res.trips);
      }
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Running', 'Completed', 'Delayed', 'In Transit'];

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="page-container trips-page">
      <h1 className="page-heading">Trips</h1>

      {/* Search Input */}
      <div className="search-section">
        <div className="search-box full">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search Trip ID, Route or Vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Status Filter Chips */}
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

      {/* Trips Card List */}
      <div className="trips-list">
        {trips.map((trip) => {
          const isInTransit = trip.status.toLowerCase() === 'in transit' || trip.status.toLowerCase() === 'running';
          const isDelayed = trip.status.toLowerCase() === 'delayed';
          const isDelivered = trip.status.toLowerCase() === 'delivered' || trip.status.toLowerCase() === 'completed';

          return (
            <div key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <span className="trip-code">{trip.tripCode}</span>
                <span
                  className={`status-pill ${
                    isDelayed
                      ? 'pill-red'
                      : isDelivered
                      ? 'pill-gray'
                      : 'pill-blue'
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="trip-route">
                {trip.origin} <span className="arrow">→</span> {trip.destination}
              </div>

              <div className="trip-details-row">
                <div className="detail-item">
                  <span className="detail-label">Vehicle</span>
                  <span className="detail-val">{trip.vehicle}</span>
                </div>

                <div className="detail-item text-right">
                  <span className="detail-label">Amount</span>
                  <span className="detail-val amount-val">
                    ₹{Number(trip.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {trip.alert && (
                <div className="trip-alert-box">
                  <AlertTriangle size={14} className="alert-icon" />
                  <span>{trip.alert}</span>
                </div>
              )}

              <div className="trip-card-footer">
                <div className="footer-info">
                  {trip.deliveredTime ? (
                    <span>Delivered on {trip.deliveredTime}</span>
                  ) : trip.eta ? (
                    <span>ETA: {trip.eta}</span>
                  ) : (
                    <span>Last updated: {trip.lastUpdated || 'Recently'}</span>
                  )}
                </div>

                <div className="footer-actions">
                  <button className="delete-btn" onClick={() => handleDelete(trip.id)} title="Delete Trip">
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={18} className="arrow-icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
