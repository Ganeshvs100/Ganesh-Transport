import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Trash2,
  Search,
  Check,
  X,
  Shield,
  KeyRound,
  RefreshCw,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Edit3
} from 'lucide-react';
import {
  fetchPendingUsers,
  fetchAllUsers,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserRole,
  adminCreateUser,
  adminResetPassword,
  adminToggleUserStatus,
  adminUpdateUser
} from '../api';

const AVAILABLE_ROLES = [
  { value: 'Admin', label: 'Admin (Full Control)', badgeColor: '#1e40af', bg: '#dbeafe' },
  { value: 'Owner', label: 'Owner (Business Head)', badgeColor: '#b45309', bg: '#fef3c7' },
  { value: 'Co-Owner', label: 'Co-Owner (Partner)', badgeColor: '#7c2d12', bg: '#ffedd5' },
  { value: 'Fleet Manager', label: 'Fleet Manager', badgeColor: '#047857', bg: '#d1fae5' },
  { value: 'Dispatcher', label: 'Dispatcher', badgeColor: '#4338ca', bg: '#e0e7ff' },
  { value: 'Driver', label: 'Driver', badgeColor: '#374151', bg: '#f3f4f6' }
];

export default function AdminPage({ currentUser }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', or 'approved'
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  // Form States for Add User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Dispatcher');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Form States for Edit User
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editRole, setEditRole] = useState('Dispatcher');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Form States for Password Reset
  const [newResetPassword, setNewResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [allRes, pendingRes] = await Promise.all([
        fetchAllUsers(),
        fetchPendingUsers()
      ]);

      if (allRes && allRes.success) {
        setAllUsers(allRes.users || []);
      }
      if (pendingRes && pendingRes.success) {
        setPendingUsers(pendingRes.users || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error loading users list.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // User Actions
  const handleApprove = async (userId) => {
    try {
      const res = await approveUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
        showSuccess(res.message || 'User approved successfully!');
      } else {
        showError(res?.message || 'Approval failed.');
      }
    } catch (err) {
      showError('Approval failed.');
    }
  };

  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this registration request?')) return;
    try {
      const res = await rejectUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setAllUsers(prev => prev.filter(u => u.id !== userId));
        showSuccess(res.message || 'Registration request rejected.');
      } else {
        showError(res?.message || 'Rejection failed.');
      }
    } catch (err) {
      showError('Rejection failed.');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to permanently delete "${userName}"?`)) return;
    try {
      const res = await deleteUser(userId);
      if (res && res.success) {
        setAllUsers(prev => prev.filter(u => u.id !== userId));
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        showSuccess(res.message || 'User deleted successfully.');
      } else {
        showError(res?.message || 'Failed to delete user.');
      }
    } catch (err) {
      showError('Deletion failed.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res && res.success) {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setPendingUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showSuccess(res.message || `Role updated to ${newRole}`);
      } else {
        showError(res?.message || 'Failed to update role');
      }
    } catch (err) {
      showError('Failed to update role.');
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.username === 'admin') {
      showError('Cannot deactivate default system administrator.');
      return;
    }
    const nextStatus = !user.isApproved;
    try {
      const res = await adminToggleUserStatus(user.id, nextStatus);
      if (res && res.success) {
        setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, isApproved: nextStatus } : u));
        if (nextStatus) {
          setPendingUsers(prev => prev.filter(u => u.id !== user.id));
        }
        showSuccess(res.message || `Status updated successfully.`);
      } else {
        showError(res?.message || 'Failed to toggle status.');
      }
    } catch (err) {
      showError('Failed to update user status.');
    }
  };

  // Add User Submit Handler
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      showError('Name, email, and password are required.');
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const payload = {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        username: newUserUsername.trim() || newUserEmail.trim(),
        password: newUserPassword,
        phone: newUserPhone.trim(),
        location: newUserLocation.trim(),
        role: newUserRole,
        isApproved: true
      };

      const res = await adminCreateUser(payload);
      if (res && res.success) {
        showSuccess(res.message || 'User created successfully!');
        setIsAddModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserUsername('');
        setNewUserPhone('');
        setNewUserLocation('');
        setNewUserPassword('');
        setNewUserRole('Dispatcher');
        loadData();
      } else {
        showError(res?.message || 'Failed to create user.');
      }
    } catch (err) {
      showError('Error creating user.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Edit User Details
  const handleOpenEditModal = (u) => {
    setSelectedUserForEdit(u);
    setEditName(u.name || '');
    setEditPhone(u.phone || '');
    setEditLocation(u.location || '');
    setEditRole(u.role || 'Dispatcher');
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    setIsSubmittingEdit(true);
    try {
      const res = await adminUpdateUser(selectedUserForEdit.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
        role: editRole
      });

      if (res && res.success) {
        setAllUsers(prev => prev.map(u => u.id === selectedUserForEdit.id ? { ...u, ...res.user } : u));
        showSuccess(res.message || 'User details updated!');
        setIsEditUserModalOpen(false);
        setSelectedUserForEdit(null);
      } else {
        showError(res?.message || 'Failed to update user details.');
      }
    } catch (err) {
      showError('Error updating user.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Reset Password Submit Handler
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForPassword) return;
    if (!newResetPassword || newResetPassword.length < 4) {
      showError('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await adminResetPassword(selectedUserForPassword.id, newResetPassword);
      if (res && res.success) {
        showSuccess(res.message || `Password reset for ${selectedUserForPassword.name}`);
        setIsResetPasswordModalOpen(false);
        setSelectedUserForPassword(null);
        setNewResetPassword('');
      } else {
        showError(res?.message || 'Failed to reset password.');
      }
    } catch (err) {
      showError('Error updating password.');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // Filter users based on search, tab, and role
  const filteredUsers = allUsers.filter(u => {
    // Tab filter
    if (activeTab === 'pending' && u.isApproved) return false;
    if (activeTab === 'approved' && !u.isApproved) return false;

    // Role filter
    if (roleFilter !== 'All' && u.role?.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }

    // Search query across name, username, email, role, phone, location
    const s = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(s)) ||
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.role && u.role.toLowerCase().includes(s)) ||
      (u.phone && u.phone.toLowerCase().includes(s)) ||
      (u.location && u.location.toLowerCase().includes(s))
    );
  });

  const totalUsersCount = allUsers.length;
  const pendingApprovalsCount = allUsers.filter(u => !u.isApproved).length;
  const approvedUsersCount = allUsers.filter(u => u.isApproved).length;
  const adminCount = allUsers.filter(u => u.role === 'Admin' || u.username === 'admin').length;

  return (
    <div className="page-container admin-page">
      {/* Header with Title & Add User button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
        <div>
          <h1 className="page-heading" style={{ margin: 0 }}>Manage Users</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Create accounts, manage roles, phone numbers, branch locations & permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={loadData}
            className="header-download-btn"
            title="Refresh Users"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
            <span className="download-text">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="header-quick-add-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {successMsg && <div className="success-banner">{successMsg}</div>}
      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      {/* Admin stats overview grid */}
      <div className="fleet-overview-grid" style={{ marginBottom: '20px' }}>
        <div
          className={`overview-card fleet-total-card ${activeTab === 'all' && roleFilter === 'All' ? 'active-overview-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveTab('all'); setRoleFilter('All'); }}
        >
          <span className="overview-title">TOTAL USERS</span>
          <div className="overview-number-row">
            <span className="overview-number">{totalUsersCount}</span>
            <span className="overview-tag blue-tag">All Registered</span>
          </div>
        </div>

        <div
          className={`overview-card fleet-critical-card ${activeTab === 'pending' ? 'active-overview-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveTab('pending'); setRoleFilter('All'); }}
        >
          <span className="overview-title critical-text">PENDING APPROVALS</span>
          <div className="overview-number-row">
            <span className="overview-number critical-text">{pendingApprovalsCount}</span>
            <span className="overview-tag red-tag">{pendingApprovalsCount > 0 ? 'Action Required' : 'Clean'}</span>
          </div>
        </div>

        <div
          className={`overview-card ${activeTab === 'approved' ? 'active-overview-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveTab('approved'); setRoleFilter('All'); }}
        >
          <span className="overview-title">ACTIVE & APPROVED</span>
          <div className="overview-number-row">
            <span className="overview-number" style={{ color: '#16a34a' }}>{approvedUsersCount}</span>
            <span className="overview-tag green-tag">Authorized</span>
          </div>
        </div>

        <div
          className="overview-card"
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveTab('all'); setRoleFilter('Admin'); }}
        >
          <span className="overview-title">ADMINISTRATORS</span>
          <div className="overview-number-row">
            <span className="overview-number" style={{ color: '#2563eb' }}>{adminCount}</span>
            <span className="overview-tag blue-tag">Full Access</span>
          </div>
        </div>
      </div>

      {/* Modern Filter & Search Toolbar */}
      <div className="admin-toolbar-container">
        <div className="admin-toolbar-row">
          {/* Segmented Status Tabs */}
          <div className="admin-status-tabs">
            <button
              className={`admin-status-tab ${activeTab === 'all' && roleFilter === 'All' ? 'active' : ''}`}
              onClick={() => { setActiveTab('all'); setRoleFilter('All'); setSearch(''); }}
            >
              All ({totalUsersCount})
            </button>
            <button
              className={`admin-status-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => { setActiveTab('pending'); setRoleFilter('All'); setSearch(''); }}
            >
              Pending ({pendingApprovalsCount})
            </button>
            <button
              className={`admin-status-tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => { setActiveTab('approved'); setRoleFilter('All'); setSearch(''); }}
            >
              Approved ({approvedUsersCount})
            </button>
          </div>

          {/* Right Controls: Role Dropdown + Search Box */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-role-select"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
              <option value="Co-Owner">Co-Owner</option>
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Driver">Driver</option>
            </select>

            <div className="admin-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search name, phone, location..."
                className="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main User List */}
      <div className="list-layout-wrapper" style={{ marginTop: '15px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin-animation" style={{ marginBottom: '8px' }} />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            <Users size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: '600' }}>
              No users found matching current filters.
            </p>
            {(search || roleFilter !== 'All' || activeTab !== 'all') && (
              <button
                onClick={() => { setSearch(''); setRoleFilter('All'); setActiveTab('all'); }}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((u) => {
              const isUserAdmin = u.role === 'Admin' || u.role?.toLowerCase() === 'admin' || u.username === 'admin';
              const isRootAdmin = u.username === 'admin';

              return (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    border: isUserAdmin ? '1px solid #bfdbfe' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    background: isUserAdmin ? 'linear-gradient(to right, rgba(239, 246, 255, 0.7), var(--card-bg))' : 'var(--card-bg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                  className="user-control-row"
                >
                  {/* Left Column: Avatar & Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: isUserAdmin ? '#dbeafe' : 'var(--primary-light, #f1f5f9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isUserAdmin ? '#1d4ed8' : 'var(--text-muted, #64748b)',
                        flexShrink: 0
                      }}
                    >
                      {isUserAdmin ? <ShieldCheck size={22} /> : <User size={22} />}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {u.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          (@{u.username})
                        </span>
                        {isRootAdmin && (
                          <span style={{ fontSize: '0.62rem', background: '#3b82f6', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            ROOT
                          </span>
                        )}
                      </div>

                      {/* Contact & Location details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Mail size={12} /> {u.email}
                        </span>

                        {u.phone && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--text-main)' }}>
                            <Phone size={12} style={{ color: '#2563eb' }} /> {u.phone}
                          </span>
                        )}

                        {u.location && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#047857' }}>
                            <MapPin size={12} /> {u.location}
                          </span>
                        )}

                        {u.isApproved ? (
                          <span style={{ fontSize: '0.68rem', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Check size={11} /> Approved
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <X size={11} /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Role Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Role:</span>
                    <select
                      value={u.role || 'Dispatcher'}
                      disabled={isRootAdmin}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color, #cbd5e1)',
                        background: 'var(--card-bg, #ffffff)',
                        color: 'var(--text-main, #0f172a)',
                        cursor: isRootAdmin ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {AVAILABLE_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Right Column: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Edit Details Button */}
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      style={{
                        background: 'var(--gray-bg, #f1f5f9)',
                        color: 'var(--text-main, #334155)',
                        border: '1px solid var(--border-color, #cbd5e1)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Edit User Details (Phone, Location, Name)"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>

                    {/* Toggle Status / Approve */}
                    {!u.isApproved ? (
                      <>
                        <button
                          onClick={() => handleApprove(u.id)}
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
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
                            padding: '6px 12px',
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
                        onClick={() => handleToggleStatus(u)}
                        disabled={isRootAdmin}
                        title={u.isApproved ? 'Suspend User Access' : 'Re-activate Account'}
                        style={{
                          background: u.isApproved ? 'var(--card-bg)' : '#d1fae5',
                          color: u.isApproved ? '#b45309' : '#047857',
                          border: u.isApproved ? '1px solid #fcd34d' : '1px solid #6ee7b7',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: isRootAdmin ? 'not-allowed' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {u.isApproved ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        <span>{u.isApproved ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    )}

                    {/* Reset Password Button */}
                    <button
                      onClick={() => {
                        setSelectedUserForPassword(u);
                        setNewResetPassword('');
                        setIsResetPasswordModalOpen(true);
                      }}
                      style={{
                        background: 'var(--gray-bg, #f1f5f9)',
                        color: 'var(--text-main, #334155)',
                        border: '1px solid var(--border-color, #cbd5e1)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Reset User Password"
                    >
                      <KeyRound size={14} />
                      <span>Reset Pass</span>
                    </button>

                    {/* Delete User */}
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={isRootAdmin}
                      style={{
                        background: isRootAdmin ? '#cbd5e1' : '#fee2e2',
                        color: isRootAdmin ? '#94a3b8' : '#b91c1c',
                        border: isRootAdmin ? '1px solid transparent' : '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: isRootAdmin ? 'not-allowed' : 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Delete User Account"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD USER MODAL (ADMIN DIRECT USER CREATION) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', background: '#dbeafe', borderRadius: '8px', color: '#1d4ed8' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Add New User</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Directly create an active, authorized user account
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="modal-form" style={{ marginTop: '15px' }}>
              <div className="input-group">
                <label>Full Name *</label>
                <div className="input-field-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Patil"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address *</label>
                <div className="input-field-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="rajesh@ganeshtransport.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <div className="input-field-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Location / Branch</label>
                  <div className="input-field-wrapper">
                    <MapPin size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Navi Mumbai Hub"
                      value={newUserLocation}
                      onChange={(e) => setNewUserLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Username (Optional)</label>
                <div className="input-field-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Auto-generated from email if left blank"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password *</label>
                <div className="input-field-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    placeholder="Temporary or permanent password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                  >
                    {showAddPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Assign Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="modal-select-input"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={isSubmittingAdd}
                >
                  {isSubmittingAdd ? 'Creating User...' : 'Create & Authorize User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT USER DETAILS MODAL */}
      {/* ========================================================================= */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', background: '#dbeafe', borderRadius: '8px', color: '#1d4ed8' }}>
                  <Edit3 size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Edit User Details</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    For {selectedUserForEdit.email}
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditUserModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="modal-form" style={{ marginTop: '15px' }}>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-field-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <div className="input-field-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Operating Location / Branch</label>
                <div className="input-field-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Navi Mumbai / Pune Hub"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Assigned Role</label>
                <select
                  value={editRole}
                  disabled={selectedUserForEdit.username === 'admin'}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="modal-select-input"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsEditUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={isSubmittingEdit}
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RESET PASSWORD MODAL */}
      {/* ========================================================================= */}
      {isResetPasswordModalOpen && selectedUserForPassword && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '8px', color: '#b91c1c' }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: '700' }}>Reset Password</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    For {selectedUserForPassword.name} (@{selectedUserForPassword.username})
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsResetPasswordModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="modal-form" style={{ marginTop: '15px' }}>
              <div className="input-group">
                <label>New Password *</label>
                <div className="input-field-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min 4 chars)"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                  >
                    {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={isSubmittingReset}
                  style={{ background: '#b91c1c' }}
                >
                  {isSubmittingReset ? 'Updating...' : 'Set New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


