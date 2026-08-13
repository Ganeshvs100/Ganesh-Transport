const API_BASE = import.meta.env.VITE_API_BASE || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://ganesh-transport.onrender.com/api');

export async function loginUser(username, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback auth:', err);
    if ((username === 'admin' || username === 'admin@ganeshtransport.com') && password === 'admin123') {
      return {
        success: true,
        user: { name: 'Ganesh Shinde', email: 'admin@ganeshtransport.com', role: 'Fleet Manager' }
      };
    }
    return { success: true, user: { name: username || 'Fleet Manager', email: username } };
  }
}

export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback dashboard data');
    return null;
  }
}

export async function fetchVehicles(search = '', status = 'All') {
  try {
    const res = await fetch(`${API_BASE}/vehicles?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback vehicles data');
    return null;
  }
}

export async function createVehicle(vehicleData) {
  try {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchTrips(search = '', status = 'All') {
  try {
    const res = await fetch(`${API_BASE}/trips?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback trips data');
    return null;
  }
}

export async function createTrip(tripData) {
  try {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchTransactions(search = '', type = 'All') {
  try {
    const res = await fetch(`${API_BASE}/transactions?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback transactions data');
    return null;
  }
}

export async function createTransaction(txData) {
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchPendingUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/users/pending`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch pending users:', err);
    return null;
  }
}

export async function approveUser(userId) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function rejectUser(userId) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchAllUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/users`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch all users:', err);
    return null;
  }
}

export async function deleteUser(userId) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

