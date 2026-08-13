import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  Search,
  Clock,
  ShieldAlert,
  Check,
  X,
  Shield,
  Briefcase
} from 'lucide-react';
import { fetchPendingUsers, fetchAllUsers, approveUser, rejectUser, deleteUser, updateUserRole } from '../api';

export default function AdminPage({ currentUser }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (activeTab === 'pending') {
        const res = await fetchPendingUsers();
        if (res && res.success) {
          setPendingUsers(res.users || []);
        } else {
          setErrorMsg('Failed to fetch pending approvals');
        }
      } else {
        const res = await fetchAllUsers();
        if (res && res.success) {
          setAllUsers(res.users || []);
        } else {
          setErrorMsg('Failed to fetch user list');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error loading admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await approveUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setSuccessMsg(res.message || 'User approved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Approval failed.');
      }
    } catch (err) {
      setErrorMsg('Approval failed.');
    }
  };

  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this registration request?')) return;
    try {
      const res = await rejectUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setSuccessMsg(res.message || 'Registration request rejected.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Rejection failed.');
      }
    } catch (err) {
      setErrorMsg('Rejection failed.');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await deleteUser(userId);
      if (res && res.success) {
        setAllUsers(prev => prev.filter(u => u.id !== userId));
        setSuccessMsg(res.message || 'User deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Failed to delete user.');
      }
    } catch (err) {
      setErrorMsg('Deletion failed.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res && res.success) {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setPendingUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSuccessMsg(res.message || `Role updated to ${newRole}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Failed to update role');
      }
    } catch (err) {
      setErrorMsg('Failed to update role.');
    }
  };

  // Filter users based on search string
  const filteredUsers = (activeTab === 'pending' ? pendingUsers : allUsers).filter(u => {
    const s = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(s)) ||
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.role && u.role.toLowerCase().includes(s))
    );
  });

  return (
    <div className="page-container admin-page">
      <h1 className="page-heading">Admin Control Panel</h1>

      {successMsg && <div className="success-banner">{successMsg}</div>}
      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      {/* Admin stats */}
      <div className="fleet-overview-grid" style={{ marginBottom: '20px' }}>
        <div className="overview-card fleet-total-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('all')}>
          <span className="overview-title">TOTAL REGISTERED</span>
          <div className="overview-number-row">
            <span className="overview-number">{allUsers.length || '—'}</span>
            <span className="overview-tag blue-tag">Active Database</span>
          </div>
        </div>

        <div className="overview-card fleet-critical-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('pending')}>
          <span className="overview-title critical-text">PENDING APPROVALS</span>
          <div className="overview-number-row">
            <span className="overview-number critical-text">{pendingUsers.length || '—'}</span>
            <span className="overview-tag red-tag">Action Needed</span>
          </div>
        </div>
      </div>

      {/* Filters and Navigation tabs */}
      <div className="fleet-filters-container">
        <div className="filter-tabs-wrapper">
          <button
            className={`filter-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pending'); setSearch(''); }}
          >
            Pending Approvals ({pendingUsers.length})
          </button>
          <button
            className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setSearch(''); }}
          >
            All Users ({allUsers.length})
          </button>
        </div>

        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <div className="list-layout-wrapper" style={{ marginTop: '15px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            <Users size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No users found matching current filters.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((u) => {
              const isUserAdmin = u.role === 'Admin' || u.role?.toLowerCase() === 'admin' || u.username === 'admin';
              return (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: isUserAdmin ? '1px solid #bfdbfe' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    background: isUserAdmin ? 'linear-gradient(to right, #eff6ff, var(--card-bg))' : 'var(--card-bg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  className="user-control-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isUserAdmin ? '#dbeafe' : 'var(--primary-light, #f1f5f9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isUserAdmin ? '#1d4ed8' : 'var(--text-muted, #64748b)'
                      }}
                    >
                      {isUserAdmin ? <Shield size={20} /> : <Users size={20} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {u.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          (@{u.username})
                        </span>
                        {isUserAdmin ? (
                          <span style={{ fontSize: '0.65rem', background: '#1e40af', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Shield size={10} /> Admin
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                            {u.role || 'Normal User'}
                          </span>
                        )}
                        {u.isApproved ? (
                          <span style={{ fontSize: '0.62rem', background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                            Approved
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                            Pending
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {u.email}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {activeTab === 'all' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Role:</span>
                        <select
                          value={u.role || 'Dispatcher'}
                          disabled={u.username === 'admin'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--card-bg, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            cursor: u.username === 'admin' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Dispatcher">Dispatcher (Normal)</option>
                          <option value="Driver">Driver (Normal)</option>
                          <option value="Fleet Manager">Fleet Manager (Normal)</option>
                          <option value="Staff">Operations Staff (Normal)</option>
                        </select>
                      </div>
                    )}

                    {activeTab === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(u.id)}
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(u.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <X size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={u.username === 'admin'}
                        style={{
                          background: u.username === 'admin' ? '#cbd5e1' : '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: u.username === 'admin' ? 'not-allowed' : 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
