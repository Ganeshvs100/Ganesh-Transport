-- PostgreSQL Database Schema and Initial Seeding Script for Ganesh Transport

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" VARCHAR(255) PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "isApproved" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS "Vehicles" (
    "id" VARCHAR(255) PRIMARY KEY,
    "registration" VARCHAR(255) NOT NULL UNIQUE,
    "model" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "insuranceExpiry" VARCHAR(255) NOT NULL,
    "insuranceFormatted" VARCHAR(255) NOT NULL,
    "fitnessExpiry" VARCHAR(255) NOT NULL,
    "fitnessFormatted" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "isInsuranceAlert" BOOLEAN DEFAULT FALSE,
    "isFitnessAlert" BOOLEAN DEFAULT FALSE,
    "isLoan" BOOLEAN DEFAULT FALSE,
    "loanBank" VARCHAR(255),
    "loanTotal" DOUBLE PRECISION,
    "loanEmi" DOUBLE PRECISION,
    "loanEmiDate" VARCHAR(255),
    "loanEndDate" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Trips Table
CREATE TABLE IF NOT EXISTS "Trips" (
    "id" VARCHAR(255) PRIMARY KEY,
    "tripCode" VARCHAR(255) NOT NULL,
    "origin" VARCHAR(255) NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "vehicle" VARCHAR(255) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "deliveredTime" VARCHAR(255),
    "lastUpdated" VARCHAR(255) NOT NULL,
    "eta" VARCHAR(255),
    "alert" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Transactions Table
CREATE TABLE IF NOT EXISTS "Transactions" (
    "id" VARCHAR(255) PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" VARCHAR(255) NOT NULL,
    "vehicle" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seeding Initial Data

-- Seed Users
INSERT INTO "Users" ("id", "username", "email", "password", "name", "role", "avatar", "isApproved")
VALUES (
    'usr-1', 
    'admin', 
    'admin@ganeshtransport.com', 
    'admin123', 
    'Ganesh Shinde', 
    'Fleet Manager', 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    TRUE
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Vehicles
INSERT INTO "Vehicles" ("id", "registration", "model", "status", "insuranceExpiry", "insuranceFormatted", "fitnessExpiry", "fitnessFormatted", "location", "isInsuranceAlert", "isFitnessAlert")
VALUES 
('v1', 'MH-12-PQ-8842', 'Tata Prima - 10 Wheeler Hauler', 'Overdue', '2023-10-24', '24 Oct 2023', '2024-12-12', '12 Dec 2024', 'Navi Mumbai', TRUE, FALSE),
('v2', 'KA-01-FR-1120', 'Eicher Pro 3015 - Cargo Van', 'Active', '2025-03-15', '15 Mar 2025', '2025-02-02', '02 Feb 2025', 'Bengaluru Hub', FALSE, FALSE),
('v3', 'HR-55-XY-0092', 'Ashok Leyland - Tipper', 'Maintenance', '2025-01-18', '18 Jan 2025', '2024-11-02', '02 Nov 2024', 'Workshop B', FALSE, TRUE),
('v4', 'UP-14-DT-7763', 'Mahindra Blazo - Haulage', 'Active', '2024-11-14', '14 Nov 2024', '2025-03-05', '05 Mar 2025', 'Delhi Gateway', FALSE, FALSE),
('v5', 'MH-01-AX-4592', 'BharatBenz 2823R - Heavy Haul', 'Active', '2025-05-10', '10 May 2025', '2025-06-18', '18 Jun 2025', 'Mumbai Port', FALSE, FALSE)
ON CONFLICT ("id") DO NOTHING;

-- Seed Trips
INSERT INTO "Trips" ("id", "tripCode", "origin", "destination", "status", "vehicle", "amount", "deliveredTime", "lastUpdated", "eta", "alert")
VALUES
('t1', '#TR-89231', 'Mumbai', 'Ahmedabad', 'In Transit', 'MH-01-AX-4592', 42500, NULL, '2 hrs ago', 'Today, 08:00 PM', NULL),
('t2', '#TR-89245', 'Pune', 'Bangalore', 'Delayed', 'MH-12-BY-8821', 38200, NULL, '30 mins ago', NULL, 'Traffic Congestion at Kolhapur'),
('t3', '#TR-89190', 'Surat', 'Delhi', 'Delivered', 'GJ-05-CT-1211', 65000, '14 Oct, 04:30 PM', '1 day ago', NULL, NULL),
('t4', '#TR-89260', 'Chennai', 'Hyderabad', 'In Transit', 'TN-07-3K-3004', 29800, NULL, '1 hr ago', 'Tomorrow, 10:00 AM', NULL),
('t5', '#TR-89270', 'Pune', 'Bangalore', 'Running', 'MH-12-AX-4502', 32000, NULL, 'Just now', NULL, NULL),
('t6', '#TR-89280', 'Mumbai', 'Delhi', 'Delayed', 'MH-04-GA-70-2234', 54000, NULL, '45 mins ago', NULL, 'Fog delay near Indore'),
('t7', '#TR-89290', 'Nagpur', 'Chennai', 'Running', 'TN-07-3K-3004', 41000, NULL, '10 mins ago', NULL, NULL)
ON CONFLICT ("id") DO NOTHING;

-- Seed Transactions
INSERT INTO "Transactions" ("id", "title", "type", "category", "amount", "date", "vehicle", "notes")
VALUES
('tx-1', 'Mumbai → Ahmedabad Freight Payment', 'Income', 'Freight Advance', 42500, 'Today, 02:30 PM', 'MH-01-AX-4592', 'Received via Bank Transfer'),
('tx-2', 'Diesel Refuel at HPCL Depot', 'Expense', 'Fuel', 14200, 'Today, 11:15 AM', 'MH-12-PQ-8842', 'Full tank 150L'),
('tx-3', 'FASTag Toll Charge - NH48', 'Expense', 'Toll Tax', 1850, 'Today, 09:40 AM', 'MH-12-AX-4502', 'FASTag Auto Pay'),
('tx-4', 'Tyre Replacement & Alignment', 'Expense', 'Maintenance', 8500, 'Yesterday', 'HR-55-XY-0092', 'Workshop B repair'),
('tx-5', 'Surat Dispatch Final Payment', 'Income', 'Freight Settlement', 65000, 'Yesterday', 'GJ-05-CT-1211', 'Client invoice cleared')
ON CONFLICT ("id") DO NOTHING;
