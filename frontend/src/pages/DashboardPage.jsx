import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  IndianRupee,
  Wallet,
  CreditCard,
  Truck,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { fetchDashboard } from '../api';

export default function DashboardPage({ setActiveTab, onOpenAddModal }) {
  const [data, setData] = useState({
    stats: {
      totalTrips: 0,
      tripsChange: 'No trips logged',
      monthlyIncome: '₹0',
      incomeChange: 'Total inflows',
      monthlyExpenses: '₹0',
      expensesChange: 'Total outflows',
      netProfit: '₹0',
      profitChange: 'Net margin'
    },
    revenueTrend: {
      '6 Months': [],
      '1 Month': [],
      '1 Year': []
    },
    complianceAlerts: [],
    recentTrips: []
  });

  const [timeframe, setTimeframe] = useState('6 Months');

  useEffect(() => {
    async function loadData() {
      const res = await fetchDashboard();
      if (res) setData(res);
    }
    loadData();
  }, []);

  const currentChartData = data.revenueTrend?.[timeframe] || [];

  return (
    <div className="page-container dashboard-page">
      {/* 4 Summary Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Trips</span>
            <TrendingUp size={16} className="stat-icon blue" />
          </div>
          <div className="stat-value">{data.stats.totalTrips ? data.stats.totalTrips.toLocaleString() : '0'}</div>
          <div className="stat-subtext positive">{data.stats.tripsChange || 'No trips logged'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Income</span>
            <IndianRupee size={16} className="stat-icon green" />
          </div>
          <div className="stat-value">{data.stats.monthlyIncome || '₹0'}</div>
          <div className="stat-subtext positive">{data.stats.incomeChange || 'Total inflows'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Expenses</span>
            <Wallet size={16} className="stat-icon red" />
          </div>
          <div className="stat-value">{data.stats.monthlyExpenses || '₹0'}</div>
          <div className="stat-subtext muted">{data.stats.expensesChange || 'Total outflows'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Net Revenue</span>
            <CreditCard size={16} className="stat-icon gold" />
          </div>
          <div className="stat-value">{data.stats.netProfit || '₹0'}</div>
          <div className="stat-subtext positive">{data.stats.profitChange || 'Net margin'}</div>
        </div>
      </div>

      {/* Revenue Trend Interactive Section */}
      <div className="section-card revenue-card">
        <div className="section-header">
          <h2 className="section-title">Revenue Trend</h2>
          <select
            className="timeframe-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="6 Months">6 Months</option>
            <option value="1 Month">1 Month</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>

        {/* SVG Revenue Chart */}
        <div className="chart-container">
          {currentChartData.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '120px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              textAlign: 'center',
              padding: '0 20px'
            }}>
              <TrendingUp size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <span>No financial data available to display trend.</span>
            </div>
          ) : (
            <>
              <svg viewBox="0 0 320 120" className="revenue-svg">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="20" x2="320" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Dynamic Chart Area Fill */}
                <path
                  d={`M 10 110 L ${currentChartData.map((d, i) => {
                    const x = 10 + i * (290 / Math.max(currentChartData.length - 1, 1));
                    const maxVal = Math.max(...currentChartData.map(item => item.revenue), 1);
                    const y = 100 - ((d.revenue / maxVal) * 75);
                    return `${x} ${y}`;
                  }).join(' L ')} L ${10 + (currentChartData.length - 1) * (290 / Math.max(currentChartData.length - 1, 1))} 110 Z`}
                  fill="url(#revenueGrad)"
                />

                {/* Dynamic Chart Line */}
                <path
                  d={`M ${currentChartData.map((d, i) => {
                    const x = 10 + i * (290 / Math.max(currentChartData.length - 1, 1));
                    const maxVal = Math.max(...currentChartData.map(item => item.revenue), 1);
                    const y = 100 - ((d.revenue / maxVal) * 75);
                    return `${x} ${y}`;
                  }).join(' L ')}`}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dynamic Data Points */}
                {currentChartData.map((d, i) => {
                  const x = 10 + i * (290 / Math.max(currentChartData.length - 1, 1));
                  const maxVal = Math.max(...currentChartData.map(item => item.revenue), 1);
                  const y = 100 - ((d.revenue / maxVal) * 75);
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                  );
                })}
              </svg>

              <div className="chart-labels">
                {currentChartData.map((item, idx) => (
                  <span key={idx} className="chart-label-item">
                    {item.month}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="section-container">
        <h2 className="section-heading">Compliance Alerts</h2>
        {!data.complianceAlerts || data.complianceAlerts.length === 0 ? (
          <div style={{
            padding: '20px',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            background: 'var(--card-bg)'
          }}>
            No pending vehicle compliance alerts. All vehicles up to date!
          </div>
        ) : (
          <div className="alerts-grid">
            {data.complianceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${alert.type === 'critical' ? 'alert-red' : 'alert-blue'}`}
              >
                <div className="alert-header">
                  <div className="alert-icon-box">
                    {alert.type === 'critical' ? (
                      <AlertTriangle size={18} className="text-red-500" />
                    ) : (
                      <FileCheck size={18} className="text-blue-500" />
                    )}
                  </div>
                  <div className="alert-content">
                    <h3 className="alert-title">{alert.title}</h3>
                    <p className="alert-desc">{alert.description}</p>
                  </div>
                </div>
                <button
                  className={`alert-action-btn ${
                    alert.type === 'critical' ? 'btn-red' : 'btn-blue'
                  }`}
                  onClick={() => alert(alert.actionText + ' triggered for ' + alert.title)}
                >
                  {alert.actionText}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Trips Section */}
      <div className="section-container">
        <div className="section-top">
          <h2 className="section-heading">Recent Trips</h2>
          <button className="view-all-btn" onClick={() => setActiveTab('trips')}>
            View All
          </button>
        </div>

        {!data.recentTrips || data.recentTrips.length === 0 ? (
          <div style={{
            padding: '20px',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            background: 'var(--card-bg)'
          }}>
            No recent trips logged. Click (+) to log a new trip!
          </div>
        ) : (
          <div className="recent-trips-list">
            {data.recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="recent-trip-card"
                onClick={() => setActiveTab('trips')}
              >
                <div className="recent-trip-icon">
                  <Truck size={18} />
                </div>
                <div className="recent-trip-details">
                  <div className="recent-trip-route">{trip.route || `${trip.origin} → ${trip.destination}`}</div>
                  <div className="recent-trip-vehicle">{trip.vehicle}</div>
                </div>
                <div className="recent-trip-status">
                  <span
                    className={`status-badge ${
                      trip.status.toLowerCase() === 'running' || trip.status.toLowerCase() === 'in transit'
                        ? 'badge-blue'
                        : trip.status.toLowerCase() === 'delayed'
                        ? 'badge-red'
                        : 'badge-green'
                    }`}
                  >
                    {trip.status}
                  </span>
                  <ChevronRight size={16} className="arrow-icon" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
