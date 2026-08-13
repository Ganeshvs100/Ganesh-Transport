import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles } from '../api';

/**
 * Hook that:
 * 1. Fetches vehicles and checks document expiry dates
 * 2. Generates in-app notification alerts
 * 3. Requests browser Push Notification permission
 * 4. Fires real OS-level push notifications when documents are about to expire
 */
export function useNotifications() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [lastChecked, setLastChecked] = useState(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const exp = new Date(dateStr);
    if (isNaN(exp.getTime())) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);
    return Math.round((exp - now) / (1000 * 60 * 60 * 24));
  }

  function urgencyLevel(days) {
    if (days === null) return null;
    if (days < 0) return 'expired';
    if (days <= 7) return 'critical';
    if (days <= 30) return 'warning';
    if (days <= 60) return 'notice';
    return null;
  }

  function urgencyLabel(days) {
    if (days === null) return '';
    if (days < 0) return `Expired ${Math.abs(days)}d ago`;
    if (days === 0) return 'Expires today!';
    if (days === 1) return 'Expires tomorrow!';
    return `Expires in ${days} days`;
  }

  function urgencyColor(level) {
    switch (level) {
      case 'expired': return '#DC2626';
      case 'critical': return '#EA580C';
      case 'warning': return '#D97706';
      case 'notice': return '#2563EB';
      default: return '#64748B';
    }
  }

  // ─── Request push notification permission ──────────────────────────────────

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') {
      setPermissionStatus('granted');
      return 'granted';
    }
    const result = await Notification.requestPermission();
    setPermissionStatus(result);
    return result;
  }, []);

  // ─── Fire OS-level push notification ──────────────────────────────────────

  function firePushNotification(title, body, tag) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Try service worker notification (works as PWA on Android)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag,
          requireInteraction: false,
          vibrate: [200, 100, 200],
          data: { url: '/' }
        }).catch(() => {
          // Fallback to basic Notification
          new Notification(title, { body, icon: '/pwa-192x192.png', tag });
        });
      }).catch(() => {
        new Notification(title, { body, icon: '/pwa-192x192.png', tag });
      });
    } else {
      new Notification(title, { body, icon: '/pwa-192x192.png', tag });
    }
  }

  // ─── Document types to check ──────────────────────────────────────────────

  const DOC_TYPES = [
    { key: 'insuranceExpiry', label: 'Insurance', formatted: 'insuranceFormatted' },
    { key: 'fitnessExpiry',   label: 'Fitness Certificate', formatted: 'fitnessFormatted' },
    { key: 'permitExpiry',    label: 'State/National Permit', formatted: 'permitFormatted' },
    { key: 'pucExpiry',       label: 'PUC (Pollution)', formatted: 'pucFormatted' },
  ];

  // ─── Read dismissed alerts from localStorage ───────────────────────────────

  function getDismissed() {
    try {
      return JSON.parse(localStorage.getItem('gt_dismissed_alerts') || '[]');
    } catch { return []; }
  }

  function saveDismissed(ids) {
    try {
      localStorage.setItem('gt_dismissed_alerts', JSON.stringify(ids));
    } catch {}
  }

  // ─── Core check function ──────────────────────────────────────────────────

  const checkExpiryAlerts = useCallback(async (silent = false) => {
    const dismissed = getDismissed();
    const newAlerts = [];

    try {
      const data = await fetchVehicles('', 'All');
      const vehicles = data?.vehicles || [];

      for (const v of vehicles) {
        for (const doc of DOC_TYPES) {
          const days = daysUntil(v[doc.key]);
          const level = urgencyLevel(days);
          if (!level) continue;

          const id = `${v.id}_${doc.key}`;
          const formattedDate = v[doc.formatted] || v[doc.key] || 'Unknown';

          newAlerts.push({
            id,
            vehicleReg: v.registration,
            docType: doc.label,
            daysLeft: days,
            level,
            color: urgencyColor(level),
            label: urgencyLabel(days),
            formattedDate,
            dismissed: dismissed.includes(id),
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('Failed to check expiry alerts:', err);
    }

    // Fire push notifications for new critical/expired alerts
    if (!silent && Notification.permission === 'granted') {
      const sentKey = 'gt_notified_alerts';
      let sentIds = [];
      try { sentIds = JSON.parse(localStorage.getItem(sentKey) || '[]'); } catch {}

      const toNotify = newAlerts.filter(a =>
        !dismissed.includes(a.id) &&
        !sentIds.includes(a.id) &&
        (a.level === 'critical' || a.level === 'expired')
      );

      for (const alert of toNotify) {
        firePushNotification(
          `⚠️ ${alert.docType} Alert — ${alert.vehicleReg}`,
          `${alert.docType} ${alert.label} (${alert.formattedDate})`,
          alert.id
        );
      }

      if (toNotify.length > 0) {
        const newSent = [...new Set([...sentIds, ...toNotify.map(a => a.id)])];
        try { localStorage.setItem(sentKey, JSON.stringify(newSent)); } catch {}
      }
    }

    setAlerts(newAlerts);
    setUnreadCount(newAlerts.filter(a => !a.dismissed).length);
    setLastChecked(new Date());
  }, []);

  // ─── Dismiss alert ────────────────────────────────────────────────────────

  const dismissAlert = useCallback((alertId) => {
    const dismissed = getDismissed();
    if (!dismissed.includes(alertId)) {
      saveDismissed([...dismissed, alertId]);
    }
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, dismissed: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const dismissAll = useCallback(() => {
    const ids = alerts.map(a => a.id);
    saveDismissed(ids);
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
    setUnreadCount(0);
  }, [alerts]);

  // ─── On mount: check permission + run check every 6 hours ─────────────────

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Run immediately on login
    checkExpiryAlerts(true);

    // Then re-run every 6 hours
    const interval = setInterval(() => checkExpiryAlerts(false), 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkExpiryAlerts]);

  return {
    alerts,
    unreadCount,
    permissionStatus,
    lastChecked,
    requestPermission,
    checkExpiryAlerts,
    dismissAlert,
    dismissAll,
  };
}
