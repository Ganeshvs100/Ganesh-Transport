import React, { useEffect, useRef } from 'react';
import {
  X, AlertTriangle, Clock, ShieldAlert, Bell, BellOff,
  CheckCheck, RefreshCw, ChevronRight
} from 'lucide-react';

const LEVEL_CONFIG = {
  expired:  { icon: ShieldAlert, bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', badge: 'EXPIRED' },
  critical: { icon: AlertTriangle, bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C', badge: 'CRITICAL' },
  warning:  { icon: Clock, bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', badge: 'DUE SOON' },
  notice:   { icon: Bell, bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', badge: 'UPCOMING' },
};

export default function NotificationPanel({
  isOpen,
  onClose,
  alerts,
  unreadCount,
  permissionStatus,
  onRequestPermission,
  onDismiss,
  onDismissAll,
  onRefresh,
  lastChecked,
}) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const dismissedAlerts = alerts.filter(a => a.dismissed);

  const formatLastChecked = () => {
    if (!lastChecked) return 'Never';
    const diff = Math.round((new Date() - lastChecked) / 60000);
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 min ago';
    if (diff < 60) return `${diff} mins ago`;
    return lastChecked.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="notif-backdrop" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="notif-panel" ref={panelRef}>
        {/* Header */}
        <div className="notif-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="notif-header-icon">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="notif-title">Notifications</h2>
              <p className="notif-subtitle">
                {unreadCount > 0 ? `${unreadCount} active alert${unreadCount > 1 ? 's' : ''}` : 'All clear'}
                {' · Updated '}
                {formatLastChecked()}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {unreadCount > 0 && (
              <button className="notif-action-btn" onClick={onDismissAll} title="Dismiss all">
                <CheckCheck size={15} />
              </button>
            )}
            <button className="notif-action-btn" onClick={onRefresh} title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button className="notif-action-btn" onClick={onClose} title="Close">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Push Notification Permission Banner */}
        {permissionStatus !== 'granted' && (
          <div className="notif-permission-banner">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <BellOff size={18} style={{ flexShrink: 0, color: '#92400E', marginTop: '1px' }} />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#92400E' }}>
                  Enable Push Notifications
                </div>
                <div style={{ fontSize: '0.72rem', color: '#78350F', marginTop: '2px', lineHeight: '1.4' }}>
                  {permissionStatus === 'denied'
                    ? 'Notifications are blocked. Please enable them in your browser/device settings.'
                    : 'Get real-time alerts when vehicle documents are about to expire.'}
                </div>
              </div>
            </div>
            {permissionStatus !== 'denied' && (
              <button className="notif-enable-btn" onClick={onRequestPermission}>
                Enable <ChevronRight size={13} />
              </button>
            )}
          </div>
        )}

        {/* Alert List */}
        <div className="notif-list">
          {activeAlerts.length === 0 && dismissedAlerts.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">✅</div>
              <p className="notif-empty-title">All Documents Up to Date</p>
              <p className="notif-empty-sub">No expiry alerts at this time. We'll notify you when action is needed.</p>
            </div>
          ) : (
            <>
              {/* Active alerts */}
              {activeAlerts.length > 0 && (
                <div className="notif-section">
                  <div className="notif-section-label">Active Alerts ({activeAlerts.length})</div>
                  {activeAlerts.map(alert => {
                    const config = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.notice;
                    const Icon = config.icon;
                    return (
                      <div
                        key={alert.id}
                        className="notif-alert-card"
                        style={{
                          background: config.bg,
                          borderLeft: `4px solid ${config.text}`,
                          border: `1px solid ${config.border}`,
                          borderLeft: `4px solid ${config.text}`,
                        }}
                      >
                        <div className="notif-alert-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <Icon size={16} style={{ color: config.text, flexShrink: 0 }} />
                            <div>
                              <div className="notif-alert-vehicle">{alert.vehicleReg}</div>
                              <div className="notif-alert-doc">{alert.docType}</div>
                            </div>
                          </div>
                          <button
                            className="notif-dismiss-btn"
                            onClick={() => onDismiss(alert.id)}
                            title="Dismiss"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <div className="notif-alert-bottom">
                          <span className="notif-alert-badge" style={{ background: config.text }}>
                            {config.badge}
                          </span>
                          <span className="notif-alert-label" style={{ color: config.text }}>
                            {alert.label} · Exp: {alert.formattedDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dismissed alerts (collapsed) */}
              {dismissedAlerts.length > 0 && (
                <div className="notif-section">
                  <div className="notif-section-label" style={{ color: '#94A3B8' }}>
                    Dismissed ({dismissedAlerts.length})
                  </div>
                  {dismissedAlerts.map(alert => (
                    <div key={alert.id} className="notif-alert-dismissed">
                      <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                        {alert.vehicleReg} · {alert.docType}
                      </span>
                      <span style={{ color: '#CBD5E1', fontSize: '0.68rem' }}>{alert.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="notif-footer">
          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
            🔔 Checks every 6 hours · Documents: Insurance, Fitness, Permit, PUC
          </span>
        </div>
      </div>
    </>
  );
}
