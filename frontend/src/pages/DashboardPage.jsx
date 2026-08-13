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
      totalTrips: 1284,
      tripsChange: '+12% this month',
      monthlyIncome: '₹8.4M',
      incomeChange: '+5% vs target',
      monthlyExpenses: '₹5.2M',
      expensesChange: '-3% operational savings',
      netProfit: '₹3.2M',
      profitChange: '+8% net margin'
    },
    revenueTrend: {
      '6 Months': [
        { month: 'Jan', revenue: 6.8 },
        { month: 'Feb', revenue: 7.2 },
        { month: 'Mar', revenue: 7.5 },
        { month: 'Apr', revenue: 7.9 },
        { month: 'May', revenue: 8.1 },
        { month: 'Jun', revenue: 8.4 }
      ]
    },
    complianceAlerts: [
      {
        id: '1',
        title: 'Insurance Expiring',
        description: 'MH-12-AX-4502 expires in 3 days.',
        actionText: 'Renew Now',
        type: 'critical',
        vehicleId: 'MH-12-AX-4502'
      },
      {
        id: '2',
        title: 'Permit Update',
        description: 'State permit MH-KA-TN renewal pending.',
        actionText: 'View Details',
        type: 'info',
        permitNo: 'MH-KA-TN-9921'
      }
    ],
    recentTrips: [
      { id: 't1', route: 'Pune → Bangalore', vehicle: 'MH-12-AX-4502', status: 'Running' },
      { id: 't2', route: 'Mumbai → Delhi', vehicle: 'MH-04-GA-70-2234', status: 'Delayed' },
      { id: 't3', route: 'Nagpur → Chennai', vehicle: 'TN-07-3K-3004', status: 'Running' }
    ]
  });

  const [timeframe, setTimeframe] = useState('6 Months');

  useEffect(() => {
    async function loadData() {
      const res = await fetchDashboard();
      if (res) setData(res);
    }
    loadData();
  }, []);

  const currentChartData = data.revenueTrend?.[timeframe] || [
    { month: 'Jan', revenue: 6.8 },
    { month: 'Feb', revenue: 7.2 },
    { month: 'Mar', revenue: 7.5 },
    { month: 'Apr', revenue: 7.9 },
    { month: 'May', revenue: 8.1 },
    { month: 'Jun', revenue: 8.4 }
  ];

  return (
    <div className="page-container dashboard-page">
      {/* 4 Summary Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Trips</span>
            <TrendingUp size={16} className="stat-icon blue" />
          </div>
          <div className="stat-value">{data.stats.totalTrips ? data.stats.totalTrips.toLocaleString() : '1,284'}</div>
          <div className="stat-subtext positive">{data.stats.tripsChange || '+12% this month'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Income</span>
            <IndianRupee size={16} className="stat-icon green" />
          </div>
          <div className="stat-value">{data.stats.monthlyIncome || '₹8.4M'}</div>
          <div className="stat-subtext positive">{data.stats.incomeChange || '+5% vs target'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Expenses</span>
            <Wallet size={16} className="stat-icon red" />
          </div>
          <div className="stat-value">{data.stats.monthlyExpenses || '₹5.2M'}</div>
          <div className="stat-subtext muted">{data.stats.expensesChange || '-3% operational savings'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Net Revenue</span>
            <CreditCard size={16} className="stat-icon gold" />
          </div>
          <div className="stat-value">{data.stats.netProfit || '₹3.2M'}</div>
          <div className="stat-subtext positive">{data.stats.profitChange || '+8% net margin'}</div>
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

            {/* Chart Area Fill */}
            <path
              d="M 10 90 L 60 75 L 120 65 L 180 50 L 240 40 L 300 25 L 300 110 L 10 110 Z"
              fill="url(#revenueGrad)"
            />

            {/* Chart Line */}
            <path
              d="M 10 90 L 60 75 L 120 65 L 180 50 L 240 40 L 300 25"
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {[
              { x: 10, y: 90 },
              { x: 60, y: 75 },
              { x: 120, y: 65 },
              { x: 180, y: 50 },
              { x: 240, y: 40 },
              { x: 300, y: 25 }
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            ))}
          </svg>

          <div className="chart-labels">
            {currentChartData.map((item, idx) => (
              <span key={idx} className="chart-label-item">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="section-container">
        <h2 className="section-heading">Compliance Alerts</h2>
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
      </div>

      {/* Recent Trips Section */}
      <div className="section-container">
        <div className="section-top">
          <h2 className="section-heading">Recent Trips</h2>
          <button className="view-all-btn" onClick={() => setActiveTab('trips')}>
            View All
          </button>
        </div>

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
                <div className="recent-trip-route">{trip.route}</div>
                <div className="recent-trip-vehicle">{trip.vehicle}</div>
              </div>
              <div className="recent-trip-status">
                <span
                  className={`status-badge ${
                    trip.status.toLowerCase() === 'running'
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
      </div>
    </div>
  );
}
