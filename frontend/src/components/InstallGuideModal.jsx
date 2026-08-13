import React from 'react';
import { X, Download, Share, PlusSquare, MoreVertical, Smartphone, CheckCircle, Truck } from 'lucide-react';

export default function InstallGuideModal({ isOpen, onClose, isIOS, onInstallPrompt }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="install-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="install-modal-header">
          <div className="install-app-icon">
            <Truck size={32} />
          </div>
          <h3>Install Ganesh Transport App</h3>
          <p className="install-modal-sub">
            Get instant access, fast offline loading, and a full-screen mobile app experience.
          </p>
        </div>

        {isIOS ? (
          <div className="install-steps-container">
            <h4 className="steps-title">Instructions for iPhone & iPad (Safari):</h4>
            <div className="install-step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                Tap the <strong>Share</strong> button <Share size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> in the bottom navigation bar of Safari.
              </div>
            </div>
            <div className="install-step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                Scroll down in the share menu and select <strong>"Add to Home Screen"</strong> <PlusSquare size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} />.
              </div>
            </div>
            <div className="install-step-item">
              <div className="step-number">3</div>
              <div className="step-text">
                Tap <strong>"Add"</strong> in the top-right corner to finish installing!
              </div>
            </div>
          </div>
        ) : (
          <div className="install-steps-container">
            <h4 className="steps-title">Instructions for Android & Chrome:</h4>
            <div className="install-step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                Tap the <strong>Menu</strong> icon <MoreVertical size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> (3 dots in top-right of your browser).
              </div>
            </div>
            <div className="install-step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </div>
            </div>
            <div className="install-step-item">
              <div className="step-number">3</div>
              <div className="step-text">
                Tap <strong>"Install"</strong> to add the app icon to your phone.
              </div>
            </div>
          </div>
        )}

        <div className="install-features-list">
          <div className="feature-item">
            <CheckCircle size={14} className="feature-check" /> 100% Free & Lightweight
          </div>
          <div className="feature-item">
            <CheckCircle size={14} className="feature-check" /> Full Offline Functionality
          </div>
          <div className="feature-item">
            <CheckCircle size={14} className="feature-check" /> Real-time Fleet Sync
          </div>
        </div>

        <div className="install-modal-actions">
          <button className="primary-install-btn" onClick={onClose}>
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
