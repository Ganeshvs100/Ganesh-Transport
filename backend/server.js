import express from 'express';
import cors from 'cors';
import { Op } from 'sequelize';
import { initDb, User, Vehicle, Trip, Transaction, revenueTrend, complianceAlerts } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ],
        password: password
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Try demo login or use admin / admin123'
      });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please contact the administrator.'
      });
    }

    const userJson = user.toJSON();
    const { password: _, ...userWithoutPass } = userJson;
    res.json({
      success: true,
      token: `token_${user.id}_${Date.now()}`,
      user: userWithoutPass
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;
    if (!username || !email || !password || !name) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or Email is already registered' });
    }

    await User.create({
      id: `usr-${Date.now()}`,
      username,
      email,
      password,
      name,
      role: role || 'Dispatcher',
      isApproved: false
    });

    res.status(201).json({
      success: true,
      message: 'Registration request submitted! Please wait for admin approval.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Admin Approval Endpoints
app.get('/api/admin/users/pending', async (req, res) => {
  try {
    const pending = await User.findAll({
      where: { isApproved: false },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, users: pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/users/approve', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isApproved = true;
    await user.save();
    res.json({ success: true, message: `Account for ${user.name} approved successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/users/reject', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    res.json({ success: true, message: 'Registration request rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete default admin user' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ success: true, message: `Updated role for ${user.name} to ${role}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Dashboard API
app.get('/api/dashboard', async (req, res) => {
  try {
    const totalFleet = await Vehicle.count();
    const totalTrips = await Trip.count();
    const criticalExpiryCount = await Vehicle.count({
      where: {
        [Op.or]: [
          { isInsuranceAlert: true },
          { isFitnessAlert: true }
        ]
      }
    });

    const txs = await Transaction.findAll();
    const dbIncome = txs.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const dbExpense = txs.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const netIncome = dbIncome;
    const netExpense = dbExpense;
    const netProfitVal = netIncome - netExpense;

    const formatCurrency = (val) => {
      const isNegative = val < 0;
      const absVal = Math.abs(val);
      let formatted = '';
      if (absVal >= 1000000) {
        formatted = `₹${(absVal / 1000000).toFixed(1)}M`;
      } else if (absVal >= 1000) {
        formatted = `₹${(absVal / 1000).toFixed(0)}K`;
      } else {
        formatted = `₹${absVal}`;
      }
      return isNegative ? `-${formatted}` : formatted;
    };

    const stats = {
      totalTrips,
      tripsChange: totalTrips === 0 ? 'No trips logged' : 'Active tracking',
      monthlyIncome: formatCurrency(netIncome),
      incomeChange: 'Total inflows',
      monthlyExpenses: formatCurrency(netExpense),
      expensesChange: 'Total outflows',
      netProfit: formatCurrency(netProfitVal),
      profitChange: 'Net margin',
      totalFleet,
      criticalExpiryCount
    };

    const recentTrips = await Trip.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats,
      revenueTrend,
      complianceAlerts,
      recentTrips
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Vehicles APIs
app.get('/api/vehicles', async (req, res) => {
  try {
    const { search, status } = req.query;
    const whereClause = {};

    if (status && status !== 'All') {
      whereClause.status = {
        [Op.like]: status
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { registration: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const vehicles = await Vehicle.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const totalFleet = 119 + (await Vehicle.count());
    const criticalExpiry = 6 + (await Vehicle.count({
      where: {
        [Op.or]: [
          { isInsuranceAlert: true },
          { isFitnessAlert: true }
        ]
      }
    }));

    res.json({
      vehicles,
      overview: {
        totalFleet,
        criticalExpiry
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const isLoan = req.body.isLoan === true || req.body.isLoan === 'true';

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const newVehicle = {
      id: `v_${Date.now()}`,
      registration: req.body.registration || 'MH-14-NEW-1234',
      model: req.body.model || 'Tata Prima Hauler',
      status: req.body.status || 'Active',
      insuranceExpiry: req.body.insuranceExpiry || '2025-12-31',
      insuranceFormatted: req.body.insuranceFormatted || formatDate(req.body.insuranceExpiry) || '31 Dec 2025',
      fitnessExpiry: req.body.fitnessExpiry || '2025-11-30',
      fitnessFormatted: req.body.fitnessFormatted || formatDate(req.body.fitnessExpiry) || '30 Nov 2025',
      location: req.body.location || 'Mumbai Depot',
      isInsuranceAlert: false,
      isFitnessAlert: false,
      isLoan,
      loanBank: isLoan ? (req.body.loanBank || '') : null,
      loanTotal: isLoan ? (Number(req.body.loanTotal) || 0) : null,
      loanEmi: isLoan ? (Number(req.body.loanEmi) || 0) : null,
      loanEmiDate: isLoan ? (req.body.loanEmiDate || '') : null,
      loanEndDate: isLoan ? (req.body.loanEndDate || '') : null,
    };

    const created = await Vehicle.create(newVehicle);
    res.status(201).json({ success: true, vehicle: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const deletedCount = await Vehicle.destroy({
      where: { id: req.params.id }
    });

    if (deletedCount > 0) {
      return res.json({ success: true, message: 'Vehicle deleted' });
    }
    res.status(404).json({ success: false, message: 'Vehicle not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Trips APIs
app.get('/api/trips', async (req, res) => {
  try {
    const { search, status } = req.query;
    const whereClause = {};

    if (status && status !== 'All') {
      whereClause.status = {
        [Op.like]: status
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { tripCode: { [Op.like]: `%${search}%` } },
        { origin: { [Op.like]: `%${search}%` } },
        { destination: { [Op.like]: `%${search}%` } },
        { vehicle: { [Op.like]: `%${search}%` } }
      ];
    }

    const trips = await Trip.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({ trips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/trips', async (req, res) => {
  try {
    const newTrip = {
      id: `t_${Date.now()}`,
      tripCode: `#TR-${Math.floor(10000 + Math.random() * 90000)}`,
      origin: req.body.origin || 'Mumbai',
      destination: req.body.destination || 'Pune',
      status: req.body.status || 'In Transit',
      vehicle: req.body.vehicle || 'MH-12-PQ-8842',
      amount: Number(req.body.amount) || 25000,
      lastUpdated: 'Just now',
      eta: req.body.eta || 'Tomorrow, 06:00 PM',
      alert: req.body.alert || null
    };

    const created = await Trip.create(newTrip);
    res.status(201).json({ success: true, trip: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  try {
    const deletedCount = await Trip.destroy({
      where: { id: req.params.id }
    });

    if (deletedCount > 0) {
      return res.json({ success: true, message: 'Trip deleted' });
    }
    res.status(404).json({ success: false, message: 'Trip not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Transactions APIs
app.get('/api/transactions', async (req, res) => {
  try {
    const { type, search } = req.query;
    const whereClause = {};

    if (type && type !== 'All') {
      whereClause.type = {
        [Op.like]: type
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
        { vehicle: { [Op.like]: `%${search}%` } }
      ];
    }

    const txs = await Transaction.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const allTxs = await Transaction.findAll();
    const todayIncome = allTxs
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const todayExpenses = allTxs
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    res.json({
      transactions: txs,
      summary: {
        todayIncome,
        todayExpenses,
        netBalance: todayIncome - todayExpenses
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const newTx = {
      id: `tx_${Date.now()}`,
      title: req.body.title || 'General Transaction',
      type: req.body.type || 'Expense',
      category: req.body.category || 'General',
      amount: Number(req.body.amount) || 0,
      date: req.body.date || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicle: req.body.vehicle || 'MH-12-PQ-8842',
      notes: req.body.notes || ''
    };

    const created = await Transaction.create(newTx);
    res.status(201).json({ success: true, transaction: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const deletedCount = await Transaction.destroy({
      where: { id: req.params.id }
    });

    if (deletedCount > 0) {
      return res.json({ success: true, message: 'Transaction deleted' });
    }
    res.status(404).json({ success: false, message: 'Transaction not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Database Sync and Listen
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Ganesh Transport Backend API running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});
