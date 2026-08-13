import React, { useState, useEffect } from 'react';
import {
  Search,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Trash2,
  Tag,
  Calendar
} from 'lucide-react';
import { fetchTransactions, deleteTransaction } from '../api';

export default function ExpensesPage({ onOpenAddModal }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    todayIncome: 0,
    todayExpenses: 0,
    netBalance: 0
  });

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchTransactions(search, activeFilter);
      if (res && res.transactions) {
        setTransactions(res.transactions);
        if (res.summary) setSummary(res.summary);
      }
      setLoading(false);
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Income', 'Expense', 'Fuel', 'Toll Tax', 'Maintenance'];

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const prev = transactions;
      setTransactions(transactions.filter((t) => t.id !== id));
      const res = await deleteTransaction(id);
      if (!res || !res.success) {
        setTransactions(prev);
        alert(res?.message || 'Failed to delete record');
      }
    }
  };

  return (
    <div className="page-container expenses-page">
      <h1 className="page-heading">Expenses & Income Ledger</h1>

      {/* Financial Summary Header Banner Cards (matching Fleet Overview design) */}
      <div className="fleet-overview-grid">
        <div className="overview-card fleet-total-card">
          <span className="overview-title">TODAY'S INCOME</span>
          <div className="overview-number-row">
            <span className="overview-number" style={{ color: '#16a34a' }}>
              ₹{Number(summary.todayIncome || 0).toLocaleString('en-IN')}
            </span>
            <span className="overview-tag" style={{ background: '#DCFCE7', color: '#15803d' }}>
              Total Inflow
            </span>
          </div>
        </div>

        <div className="overview-card fleet-critical-card">
          <span className="overview-title critical-text">TODAY'S EXPENSES</span>
          <div className="overview-number-row">
            <span className="overview-number critical-text">
              ₹{Number(summary.todayExpenses || 0).toLocaleString('en-IN')}
            </span>
            <span className="overview-tag red-tag">
              Total Outflow
            </span>
          </div>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="net-balance-card" style={{
        background: ((summary.todayIncome || 0) - (summary.todayExpenses || 0)) >= 0
          ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)'
      }}>
        <div className="net-balance-left">
          <Wallet size={20} className="net-balance-icon" />
          <div>
            <div className="net-balance-label">Net Balance</div>
            <div className="net-balance-val">
              ₹{Number((summary.todayIncome || 0) - (summary.todayExpenses || 0)).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <span className="net-balance-pill" style={{
          background: ((summary.todayIncome || 0) - (summary.todayExpenses || 0)) >= 0
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.25)'
        }}>
          {((summary.todayIncome || 0) - (summary.todayExpenses || 0)) >= 0 ? 'Positive Cashflow' : 'Net Deficit'}
        </span>
      </div>

      {/* Search Input */}
      <div className="search-section">
        <div className="search-box full">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search category, fuel, toll, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      {/* Ledger Entry List Cards */}
      <div className="ledger-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '16px', background: 'var(--card-bg)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gray-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--text-muted)' }}>
              <Wallet size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
              {search || activeFilter !== 'All' ? 'No Matching Records' : 'No Transactions Recorded'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', maxWidth: '320px', marginInline: 'auto' }}>
              {search || activeFilter !== 'All' ? 'Try adjusting your search keywords or filter tab.' : 'Log diesel expenses, toll tax, driver advances, or freight income.'}
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
                <Plus size={16} /> Record Transaction
              </button>
            )}
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type.toLowerCase() === 'income';

            return (
              <div key={tx.id} className="ledger-item-card">
                <div className="ledger-item-top">
                  <div className="ledger-item-title-group">
                    <span className="ledger-item-title">{tx.title}</span>
                    <div className="ledger-pills-row">
                      <span
                        className={`type-pill ${
                          isIncome ? 'type-income' : 'type-expense'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <span className="category-pill">
                        <Tag size={11} /> {tx.category}
                      </span>
                    </div>
                  </div>

                  <div className={`ledger-item-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                    {isIncome ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="ledger-item-bottom">
                  <div className="ledger-item-meta">
                    <span className="meta-date">
                      <Calendar size={12} /> {tx.date}
                    </span>
                    {tx.vehicle && (
                      <span className="meta-vehicle">• Vehicle: {tx.vehicle}</span>
                    )}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(tx.id)}
                    title="Delete Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
