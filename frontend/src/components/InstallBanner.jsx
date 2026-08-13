import React, { useState, useEffect } from 'react';
import { Download, X, Truck, Smartphone } from 'lucide-react';

export default function InstallBanner({ isInstalled, onInstall }) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="install-floating-banner">
      <div className="banner-left">
        <div className="banner-app-icon">
          <Truck size={18} />
        </div>
        <div className="banner-text">
          <span className="banner-title">Get Mobile App</span>
          <span className="banner-desc">Install for fast offline fleet access</span>
        </div>
      </div>

      <div className="banner-right">
        <button className="banner-install-btn" onClick={onInstall}>
          <Download size={14} />
          <span>Install</span>
        </button>
        <button className="banner-close-btn" onClick={handleDismiss} title="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
