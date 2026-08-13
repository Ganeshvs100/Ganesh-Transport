import 'dotenv/config';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import defineUser from './models/User.js';
import defineVehicle from './models/Vehicle.js';
import defineTrip from './models/Trip.js';
import defineTransaction from './models/Transaction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

const isPostgres = process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'));

// Initialize Sequelize with PostgreSQL or fallback to SQLite
const sequelize = isPostgres
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, 'database.sqlite'),
      logging: false,
    });

// Initialize models
const User = defineUser(sequelize);
const Vehicle = defineVehicle(sequelize);
const Trip = defineTrip(sequelize);
const Transaction = defineTransaction(sequelize);

const initialData = {
  users: [
    {
      id: 'usr-1',
      username: 'admin',
      email: 'admin@ganeshtransport.com',
      password: 'admin123',
      name: 'Ganesh Shinde',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isApproved: true
    }
  ],
  stats: {
    totalTrips: 0,
    tripsChange: '0% this month',
    monthlyIncome: '₹0',
    incomeChange: '0% vs target',
    monthlyExpenses: '₹0',
    expensesChange: '0% operational savings',
    netProfit: '₹0',
    profitChange: '0% net margin',
    totalFleet: 0,
    criticalExpiryCount: 0
  },
  revenueTrend: {
    '6 Months': [],
    '1 Month': [],
    '1 Year': []
  },
  complianceAlerts: [],
  vehicles: [],
  trips: [],
  transactions: []
};

// Expose revenue trend static data for dashboard views
const revenueTrend = initialData.revenueTrend;
const complianceAlerts = initialData.complianceAlerts;

export async function initDb() {
  await sequelize.sync({ alter: true });

  const dbType = isPostgres ? 'PostgreSQL' : 'SQLite';
  let dataToMigrate = initialData;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dataToMigrate = { ...initialData, ...parsed };
    } catch (e) {
      console.error('Error reading data.json, using defaults:', e);
    }
  }

  // 1. Seed Users if empty
  const userCount = await User.count();
  if (userCount === 0 && dataToMigrate.users?.length) {
    await User.bulkCreate(dataToMigrate.users);
    console.log(`Seeded ${dataToMigrate.users.length} users into ${dbType}.`);
  } else {
    // Ensure default admin user has Admin role
    const adminUser = await User.findOne({
      where: {
        username: 'admin'
      }
    });
    if (adminUser && adminUser.role !== 'Admin') {
      adminUser.role = 'Admin';
      await adminUser.save();
      console.log('Updated default admin account to role: Admin');
    }
  }

  // 2. Seed Vehicles if empty
  const vehicleCount = await Vehicle.count();
  if (vehicleCount === 0 && dataToMigrate.vehicles?.length) {
    await Vehicle.bulkCreate(dataToMigrate.vehicles);
    console.log(`Seeded ${dataToMigrate.vehicles.length} vehicles into ${dbType}.`);
  }

  // 3. Seed Trips if empty
  const tripCount = await Trip.count();
  if (tripCount === 0 && dataToMigrate.trips?.length) {
    await Trip.bulkCreate(dataToMigrate.trips);
    console.log(`Seeded ${dataToMigrate.trips.length} trips into ${dbType}.`);
  }

  // 4. Seed Transactions if empty
  const txCount = await Transaction.count();
  if (txCount === 0 && dataToMigrate.transactions?.length) {
    await Transaction.bulkCreate(dataToMigrate.transactions);
    console.log(`Seeded ${dataToMigrate.transactions.length} transactions into ${dbType}.`);
  }
}

export { sequelize, User, Vehicle, Trip, Transaction, revenueTrend, complianceAlerts };
