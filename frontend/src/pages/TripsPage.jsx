import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, Truck, AlertTriangle, ChevronRight, Plus, Trash2, Navigation } from 'lucide-react';
import { fetchTrips, deleteTrip } from '../api';

export default function TripsPage({ onOpenAddModal }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchTrips(search, activeFilter);
      if (res && res.trips) {
        setTrips(res.trips);
      }
      setLoading(false);
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Running', 'Completed', 'Delayed', 'In Transit'];

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      const prev = trips;
      setTrips(trips.filter((t) => t.id !== id));
      const res = await deleteTrip(id);
      if (!res || !res.success) {
        setTrips(prev);
        alert(res?.message || 'Failed to delete trip');
      }
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '16px', background: 'var(--card-bg)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gray-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--text-muted)' }}>
              <Navigation size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
              {search || activeFilter !== 'All' ? 'No Matching Trips' : 'No Trips Logged'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', maxWidth: '320px', marginInline: 'auto' }}>
              {search || activeFilter !== 'All' ? 'Try adjusting your search keywords or filter tab.' : 'Create a new dispatch route and trip record to start tracking.'}
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
                <Plus size={16} /> Add Trip
              </button>
            )}
          </div>
        ) : (
          trips.map((trip) => {
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
          })
        )}
      </div>
    </div>
  );
}
