import React, { useState } from 'react';
import { X, Truck, Navigation, IndianRupee, ArrowUpRight, ArrowDownRight, Landmark } from 'lucide-react';

export default function AddModal({
  isOpen,
  onClose,
  onAddVehicle,
  onAddTrip,
  onAddTransaction,
  activeTab
}) {
  const [modalType, setModalType] = useState(
    activeTab === 'expenses' ? 'entry' : activeTab === 'vehicles' ? 'vehicle' : 'trip'
  );

  // Transaction / Entry form state
  const [entryType, setEntryType] = useState('Expense'); // 'Income' or 'Expense'
  const [entryCategory, setEntryCategory] = useState('Fuel');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [entryVehicle, setEntryVehicle] = useState('MH-12-PQ-8842');
  const [entryNotes, setEntryNotes] = useState('');

  // Vehicle form state
  const [registration, setRegistration] = useState('');
  const [model, setModel] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('Active');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [fitnessExpiry, setFitnessExpiry] = useState('');
  const [permitExpiry, setPermitExpiry] = useState('');
  const [pucExpiry, setPucExpiry] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [location, setLocation] = useState('');

  // Loan fields
  const [isLoan, setIsLoan] = useState(false);
  const [loanBank, setLoanBank] = useState('');
  const [loanTotal, setLoanTotal] = useState('');
  const [loanEmi, setLoanEmi] = useState('');
  const [loanEmiDate, setLoanEmiDate] = useState('');
  const [loanEndDate, setLoanEndDate] = useState('');

  // Trip form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleReg, setVehicleReg] = useState('MH-12-PQ-8842');
  const [amount, setAmount] = useState('');
  const [tripStatus, setTripStatus] = useState('In Transit');
  const [eta, setEta] = useState('Tomorrow, 10:00 AM');

  if (!isOpen) return null;

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

  const handleEntrySubmit = (e) => {
    e.preventDefault();
    if (!entryAmount) return;
    onAddTransaction({
      title: entryTitle || `${entryCategory} (${entryType})`,
      type: entryType,
      category: entryCategory,
      amount: Number(entryAmount),
      vehicle: entryVehicle,
      notes: entryNotes,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (!registration || !model) return;
    onAddVehicle({
      registration,
      model,
      status: vehicleStatus,
      insuranceExpiry,
      insuranceFormatted: formatDate(insuranceExpiry) || '31 Dec 2025',
      fitnessExpiry,
      fitnessFormatted: formatDate(fitnessExpiry) || '30 Nov 2025',
      permitExpiry,
      permitFormatted: formatDate(permitExpiry) || '',
      pucExpiry,
      pucFormatted: formatDate(pucExpiry) || '',
      driverName,
      driverPhone,
      location: location || 'Depot Hub',
      isLoan,
      ...(isLoan && {
        loanBank,
        loanTotal: Number(loanTotal),
        loanEmi: Number(loanEmi),
        loanEmiDate,
        loanEndDate
      })
    });
    onClose();
  };

  const handleTripSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    onAddTrip({
      origin,
      destination,
      vehicle: vehicleReg,
      amount: amount || 35000,
      status: tripStatus,
      eta
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tabs">
            <button
              className={`modal-tab ${modalType === 'entry' ? 'active' : ''}`}
              onClick={() => setModalType('entry')}
            >
              <IndianRupee size={15} /> Add Income/Expense
            </button>
            <button
              className={`modal-tab ${modalType === 'vehicle' ? 'active' : ''}`}
              onClick={() => setModalType('vehicle')}
            >
              <Truck size={15} /> Vehicle
            </button>
            <button
              className={`modal-tab ${modalType === 'trip' ? 'active' : ''}`}
              onClick={() => setModalType('trip')}
            >
              <Navigation size={15} /> Trip
            </button>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {modalType === 'entry' ? (
            <form onSubmit={handleEntrySubmit} className="add-form">
              {/* Type Switcher (Income vs Expense) */}
              <div className="type-toggle-group">
                <button
                  type="button"
                  className={`toggle-btn income-toggle ${entryType === 'Income' ? 'active' : ''}`}
                  onClick={() => {
                    setEntryType('Income');
                    setEntryCategory('Freight Advance');
                  }}
                >
                  <ArrowUpRight size={16} /> Income (Money In)
                </button>
                <button
                  type="button"
                  className={`toggle-btn expense-toggle ${entryType === 'Expense' ? 'active' : ''}`}
                  onClick={() => {
                    setEntryType('Expense');
                    setEntryCategory('Fuel');
                  }}
                >
                  <ArrowDownRight size={16} /> Expense (Money Out)
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category Type</label>
                  <select
                    value={entryCategory}
                    onChange={(e) => setEntryCategory(e.target.value)}
                  >
                    {entryType === 'Expense' ? (
                      <>
                        <option value="Fuel">Fuel / Diesel</option>
                        <option value="Toll Tax">Toll Tax (FASTag)</option>
                        <option value="Maintenance">Maintenance & Repairs</option>
                        <option value="Driver Pay">Driver Allowance</option>
                        <option value="Permit & Fine">Permits / Challan</option>
                        <option value="Other Expense">Other Expense</option>
                      </>
                    ) : (
                      <>
                        <option value="Freight Advance">Freight Advance</option>
                        <option value="Freight Settlement">Freight Settlement</option>
                        <option value="Loading Charges">Loading Payment</option>
                        <option value="Container Rent">Container Lease</option>
                        <option value="Other Income">Other Income</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 14200"
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Title</label>
                <input
                  type="text"
                  placeholder={
                    entryType === 'Expense'
                      ? 'e.g. Diesel Refuel at HPCL Depot'
                      : 'e.g. Freight Advance Payment'
                  }
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Vehicle</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-12-PQ-8842"
                    value={entryVehicle}
                    onChange={(e) => setEntryVehicle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Notes / Receipt No.</label>
                  <input
                    type="text"
                    placeholder="e.g. Bill #8821"
                    value={entryNotes}
                    onChange={(e) => setEntryNotes(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${entryType === 'Income' ? 'btn-green-submit' : ''}`}
              >
                Save {entryType} Entry
              </button>
            </form>
          ) : modalType === 'vehicle' ? (
            <form onSubmit={handleVehicleSubmit} className="add-form">
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. MH-12-AB-1234"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Model & Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Prima - 10 Wheeler Hauler"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={vehicleStatus}
                    onChange={(e) => setVehicleStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Navi Mumbai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Document Expiries & Compliance Section */}
              <div style={{ background: 'var(--gray-bg, #f8fafc)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
                  📄 Document Expiries & Compliance
                </span>

                <div className="form-row">
                  <div className="form-group">
                    <label>Insurance Expiry Date</label>
                    <input
                      type="date"
                      value={insuranceExpiry}
                      onChange={(e) => setInsuranceExpiry(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fitness Expiry Date</label>
                    <input
                      type="date"
                      value={fitnessExpiry}
                      onChange={(e) => setFitnessExpiry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State/National Permit Expiry</label>
                    <input
                      type="date"
                      value={permitExpiry}
                      onChange={(e) => setPermitExpiry(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>PUC (Pollution) Expiry</label>
                    <input
                      type="date"
                      value={pucExpiry}
                      onChange={(e) => setPucExpiry(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Driver Assignment Section */}
              <div style={{ background: 'var(--gray-bg, #f8fafc)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
                  👤 Assigned Driver (Optional)
                </span>

                <div className="form-row">
                  <div className="form-group">
                    <label>Driver Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Driver Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Loan Toggle */}
              <div className="loan-toggle-group">
                <button
                  type="button"
                  className={`loan-toggle-btn ${!isLoan ? 'active' : ''}`}
                  onClick={() => setIsLoan(false)}
                >
                  🚛 Own Vehicle
                </button>
                <button
                  type="button"
                  className={`loan-toggle-btn loan-active-btn ${isLoan ? 'active' : ''}`}
                  onClick={() => setIsLoan(true)}
                >
                  <Landmark size={15} /> Loan / Finance
                </button>
              </div>

              {/* Loan Details Section */}
              {isLoan && (
                <div className="loan-section">
                  <div className="loan-section-title">📋 Loan / Finance Details</div>

                  <div className="form-group">
                    <label>Bank / Financier Name</label>
                    <input
                      type="text"
                      placeholder="e.g. SBI, HDFC, Mahindra Finance"
                      value={loanBank}
                      onChange={(e) => setLoanBank(e.target.value)}
                      required={isLoan}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Total Loan Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1800000"
                        value={loanTotal}
                        onChange={(e) => setLoanTotal(e.target.value)}
                        required={isLoan}
                      />
                    </div>
                    <div className="form-group">
                      <label>Monthly EMI (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 32000"
                        value={loanEmi}
                        onChange={(e) => setLoanEmi(e.target.value)}
                        required={isLoan}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>EMI Due Date (Day of Month)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="e.g. 5"
                        value={loanEmiDate}
                        onChange={(e) => setLoanEmiDate(e.target.value)}
                        required={isLoan}
                      />
                    </div>
                    <div className="form-group">
                      <label>Loan End Date</label>
                      <input
                        type="date"
                        value={loanEndDate}
                        onChange={(e) => setLoanEndDate(e.target.value)}
                        required={isLoan}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="submit-btn">
                Add Vehicle to Fleet
              </button>
            </form>
          ) : (
            <form onSubmit={handleTripSubmit} className="add-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmedabad"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Vehicle</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-01-AX-4592"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Freight Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 42500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Create & Dispatch Trip
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
