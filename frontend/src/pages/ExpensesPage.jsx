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
import { fetchTransactions } from '../api';

export default function ExpensesPage({ onOpenAddModal }) {
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      title: 'Mumbai → Ahmedabad Freight Payment',
      type: 'Income',
      category: 'Freight Advance',
      amount: 42500,
      date: 'Today, 02:30 PM',
      vehicle: 'MH-01-AX-4592',
      notes: 'Received via Bank Transfer'
    },
    {
      id: 'tx-2',
      title: 'Diesel Refuel at HPCL Depot',
      type: 'Expense',
      category: 'Fuel',
      amount: 14200,
      date: 'Today, 11:15 AM',
      vehicle: 'MH-12-PQ-8842',
      notes: 'Full tank 150L'
    },
    {
      id: 'tx-3',
      title: 'FASTag Toll Charge - NH48',
      type: 'Expense',
      category: 'Toll Tax',
      amount: 1850,
      date: 'Today, 09:40 AM',
      vehicle: 'MH-12-AX-4502',
      notes: 'FASTag Auto Pay'
    },
    {
      id: 'tx-4',
      title: 'Tyre Replacement & Alignment',
      type: 'Expense',
      category: 'Maintenance',
      amount: 8500,
      date: 'Yesterday',
      vehicle: 'HR-55-XY-0092',
      notes: 'Workshop B repair'
    },
    {
      id: 'tx-5',
      title: 'Surat Dispatch Final Payment',
      type: 'Income',
      category: 'Freight Settlement',
      amount: 65000,
      date: 'Yesterday',
      vehicle: 'GJ-05-CT-1211',
      notes: 'Client invoice cleared'
    }
  ]);

  const [summary, setSummary] = useState({
    todayIncome: 107500,
    todayExpenses: 24550,
    netBalance: 82950
  });

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      const res = await fetchTransactions(search, activeFilter);
      if (res && res.transactions) {
        setTransactions(res.transactions);
        if (res.summary) setSummary(res.summary);
      }
    }
    loadData();
  }, [search, activeFilter]);

  const filterTabs = ['All', 'Income', 'Expense', 'Fuel', 'Toll Tax', 'Maintenance'];

  const handleDelete = (id) => {
    if (confirm('Delete this ledger entry?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="page-container expenses-page">
      <div className="page-header-row">
        <h1 className="page-heading">Expenses & Income Ledger</h1>
        <button className="add-entry-btn" onClick={onOpenAddModal}>
          <Plus size={16} /> Add Today's Entry
        </button>
      </div>

      {/* Today's Financial Summary Header Cards */}
      <div className="ledger-summary-grid">
        <div className="ledger-card income-summary-card">
          <div className="ledger-card-header">
            <span className="ledger-card-title">Today's Income</span>
            <div className="ledger-icon-box green">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="ledger-card-value text-green">
            ₹{summary.todayIncome ? summary.todayIncome.toLocaleString('en-IN') : '107,500'}
          </div>
          <div className="ledger-card-sub text-green">+ Received today</div>
        </div>

        <div className="ledger-card expense-summary-card">
          <div className="ledger-card-header">
            <span className="ledger-card-title">Today's Expenses</span>
            <div className="ledger-icon-box red">
              <ArrowDownRight size={16} />
            </div>
          </div>
          <div className="ledger-card-value text-red">
            ₹{summary.todayExpenses ? summary.todayExpenses.toLocaleString('en-IN') : '24,550'}
          </div>
          <div className="ledger-card-sub text-muted">- Fuel & Operations</div>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="net-balance-card">
        <div className="net-balance-left">
          <Wallet size={20} className="net-balance-icon" />
          <div>
            <div className="net-balance-label">Today's Net Balance</div>
            <div className="net-balance-val">
              ₹{(summary.todayIncome - summary.todayExpenses || 82950).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <span className="net-balance-pill">Positive Cashflow</span>
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
        {transactions.map((tx) => {
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
        })}
      </div>
    </div>
  );
}
