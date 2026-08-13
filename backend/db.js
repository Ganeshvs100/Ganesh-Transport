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
      role: 'Fleet Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isApproved: true
    }
  ],
  stats: {
    totalTrips: 1284,
    tripsChange: '+12% this month',
    monthlyIncome: '₹8.4M',
    incomeChange: '+5% vs target',
    monthlyExpenses: '₹5.2M',
    expensesChange: '-3% operational savings',
    netProfit: '₹3.2M',
    profitChange: '+8% net margin',
    totalFleet: 124,
    criticalExpiryCount: 8
  },
  revenueTrend: {
    '6 Months': [
      { month: 'Jan', revenue: 6.8 },
      { month: 'Feb', revenue: 7.2 },
      { month: 'Mar', revenue: 7.5 },
      { month: 'Apr', revenue: 7.9 },
      { month: 'May', revenue: 8.1 },
      { month: 'Jun', revenue: 8.4 }
    ],
    '1 Month': [
      { month: 'W1', revenue: 1.9 },
      { month: 'W2', revenue: 2.1 },
      { month: 'W3', revenue: 2.1 },
      { month: 'W4', revenue: 2.3 }
    ],
    '1 Year': [
      { month: '2023 Q1', revenue: 18.5 },
      { month: '2023 Q2', revenue: 20.2 },
      { month: '2023 Q3', revenue: 22.8 },
      { month: '2023 Q4', revenue: 24.1 }
    ]
  },
  complianceAlerts: [
    {
      id: 'alert-1',
      title: 'Insurance Expiring',
      description: 'MH-12-AX-4502 expires in 3 days',
      actionText: 'Renew Now',
      type: 'critical',
      vehicleId: 'MH-12-AX-4502'
    },
    {
      id: 'alert-2',
      title: 'Permit Update',
      description: 'State permit MH-KA-TN renewal pending',
      actionText: 'View Details',
      type: 'info',
      permitNo: 'MH-KA-TN-9921'
    }
  ],
  vehicles: [
    {
      id: 'v1',
      registration: 'MH-12-PQ-8842',
      model: 'Tata Prima - 10 Wheeler Hauler',
      status: 'Overdue',
      insuranceExpiry: '2023-10-24',
      insuranceFormatted: '24 Oct 2023',
      fitnessExpiry: '2024-12-12',
      fitnessFormatted: '12 Dec 2024',
      location: 'Navi Mumbai',
      isInsuranceAlert: true,
      isFitnessAlert: false
    },
    {
      id: 'v2',
      registration: 'KA-01-FR-1120',
      model: 'Eicher Pro 3015 - Cargo Van',
      status: 'Active',
      insuranceExpiry: '2025-03-15',
      insuranceFormatted: '15 Mar 2025',
      fitnessExpiry: '2025-02-02',
      fitnessFormatted: '02 Feb 2025',
      location: 'Bengaluru Hub',
      isInsuranceAlert: false,
      isFitnessAlert: false
    },
    {
      id: 'v3',
      registration: 'HR-55-XY-0092',
      model: 'Ashok Leyland - Tipper',
      status: 'Maintenance',
      insuranceExpiry: '2025-01-18',
      insuranceFormatted: '18 Jan 2025',
      fitnessExpiry: '2024-11-02',
      fitnessFormatted: '02 Nov 2024',
      location: 'Workshop B',
      isInsuranceAlert: false,
      isFitnessAlert: true
    },
    {
      id: 'v4',
      registration: 'UP-14-DT-7763',
      model: 'Mahindra Blazo - Haulage',
      status: 'Active',
      insuranceExpiry: '2024-11-14',
      insuranceFormatted: '14 Nov 2024',
      fitnessExpiry: '2025-03-05',
      fitnessFormatted: '05 Mar 2025',
      location: 'Delhi Gateway',
      isInsuranceAlert: false,
      isFitnessAlert: false
    },
    {
      id: 'v5',
      registration: 'MH-01-AX-4592',
      model: 'BharatBenz 2823R - Heavy Haul',
      status: 'Active',
      insuranceExpiry: '2025-05-10',
      insuranceFormatted: '10 May 2025',
      fitnessExpiry: '2025-06-18',
      fitnessFormatted: '18 Jun 2025',
      location: 'Mumbai Port',
      isInsuranceAlert: false,
      isFitnessAlert: false
    }
  ],
  trips: [
    {
      id: 't1',
      tripCode: '#TR-89231',
      origin: 'Mumbai',
      destination: 'Ahmedabad',
      status: 'In Transit',
      vehicle: 'MH-01-AX-4592',
      amount: 42500,
      lastUpdated: '2 hrs ago',
      eta: 'Today, 08:00 PM',
      alert: null
    },
    {
      id: 't2',
      tripCode: '#TR-89245',
      origin: 'Pune',
      destination: 'Bangalore',
      status: 'Delayed',
      vehicle: 'MH-12-BY-8821',
      amount: 38200,
      lastUpdated: '30 mins ago',
      alert: 'Traffic Congestion at Kolhapur'
    },
    {
      id: 't3',
      tripCode: '#TR-89190',
      origin: 'Surat',
      destination: 'Delhi',
      status: 'Delivered',
      vehicle: 'GJ-05-CT-1211',
      amount: 65000,
      deliveredTime: '14 Oct, 04:30 PM',
      lastUpdated: '1 day ago',
      alert: null
    },
    {
      id: 't4',
      tripCode: '#TR-89260',
      origin: 'Chennai',
      destination: 'Hyderabad',
      status: 'In Transit',
      vehicle: 'TN-07-3K-3004',
      amount: 29800,
      eta: 'Tomorrow, 10:00 AM',
      lastUpdated: '1 hr ago',
      alert: null
    },
    {
      id: 't5',
      tripCode: '#TR-89270',
      origin: 'Pune',
      destination: 'Bangalore',
      status: 'Running',
      vehicle: 'MH-12-AX-4502',
      amount: 32000,
      lastUpdated: 'Just now',
      alert: null
    },
    {
      id: 't6',
      tripCode: '#TR-89280',
      origin: 'Mumbai',
      destination: 'Delhi',
      status: 'Delayed',
      vehicle: 'MH-04-GA-70-2234',
      amount: 54000,
      lastUpdated: '45 mins ago',
      alert: 'Fog delay near Indore'
    },
    {
      id: 't7',
      tripCode: '#TR-89290',
      origin: 'Nagpur',
      destination: 'Chennai',
      status: 'Running',
      vehicle: 'TN-07-3K-3004',
      amount: 41000,
      lastUpdated: '10 mins ago',
      alert: null
    }
  ],
  transactions: [
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
  ]
};

// Expose revenue trend static data for dashboard views
const revenueTrend = initialData.revenueTrend;
const complianceAlerts = initialData.complianceAlerts;

export async function initDb() {
  await sequelize.sync({ alter: true });

  const userCount = await User.count();
  if (userCount === 0) {
    const dbType = isPostgres ? 'PostgreSQL' : 'SQLite';
    console.log(`Database empty. Migrating mock data to ${dbType}...`);
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

    // Seed tables
    await User.bulkCreate(dataToMigrate.users);
    await Vehicle.bulkCreate(dataToMigrate.vehicles);
    await Trip.bulkCreate(dataToMigrate.trips);
    await Transaction.bulkCreate(dataToMigrate.transactions || []);
    console.log(`Seeding and migration to ${dbType} complete.`);
  }
}

export { sequelize, User, Vehicle, Trip, Transaction, revenueTrend, complianceAlerts };
