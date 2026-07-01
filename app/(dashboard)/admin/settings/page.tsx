'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    platformName: 'RUPP SecondHand Marketplace',
    maintenanceMode: false,
    jwtExpiration: '7',
    emailVerification: true,
    maxImagesPerListing: 5,
    maxTitleLength: 100,
    guestBrowsing: true,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Settings
        </h1>

        <div className="admin-table-container" style={{ padding: '24px', maxWidth: '800px' }}>
          {/* Platform Settings */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Platform
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Platform Name</label>
              <input
                type="text"
                className="admin-input"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Maintenance Mode</span>
              </label>
            </div>
          </div>

          {/* Security Settings */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Security
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>JWT Expiration (days)</label>
              <input
                type="number"
                className="admin-input"
                value={settings.jwtExpiration}
                onChange={(e) => setSettings({ ...settings, jwtExpiration: e.target.value })}
                style={{ maxWidth: '200px' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailVerification}
                  onChange={(e) => setSettings({ ...settings, emailVerification: e.target.checked })}
                />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Email Verification Required</span>
              </label>
            </div>
          </div>

          {/* Marketplace Settings */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Marketplace
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Max Images Per Listing</label>
              <input
                type="number"
                className="admin-input"
                value={settings.maxImagesPerListing}
                onChange={(e) => setSettings({ ...settings, maxImagesPerListing: parseInt(e.target.value) })}
                style={{ maxWidth: '200px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Max Title Length</label>
              <input
                type="number"
                className="admin-input"
                value={settings.maxTitleLength}
                onChange={(e) => setSettings({ ...settings, maxTitleLength: parseInt(e.target.value) })}
                style={{ maxWidth: '200px' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.guestBrowsing}
                  onChange={(e) => setSettings({ ...settings, guestBrowsing: e.target.checked })}
                />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Guest Browsing Allowed</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="admin-btn" style={{ width: '100%', padding: '14px' }}>
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}