import React from 'react';

export default function Settings() {
  const settings = [
    { id: 1, name: 'General Settings', description: 'Configure site title, logo, and basic info.', lastUpdated: '2 days ago' },
    { id: 2, name: 'Security', description: 'Password policy, 2FA, and login logs.', lastUpdated: '1 week ago' },
    { id: 3, name: 'Email Notifications', description: 'Manage email templates and triggers.', lastUpdated: '3 days ago' },
    { id: 4, name: 'Payment Gateways', description: 'Setup Stripe, PayPal, and other providers.', lastUpdated: '1 month ago' },
    { id: 5, name: 'User Roles', description: 'Define permissions for Admins, Users, and Owners.', lastUpdated: '2 weeks ago' },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">Settings</h2>
          <p className="dashboard-hint">Configure application preferences and system settings</p>
        </div>
      </div>

      <div className="table-container" style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Setting Section</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Description</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Last Updated</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {settings.map((setting) => (
              <tr key={setting.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{setting.name}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{setting.description}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {setting.lastUpdated}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500' }}>
                  <button style={{ 
                    backgroundColor: '#4f46e5', 
                    color: 'white', 
                    padding: '0.375rem 0.75rem', 
                    borderRadius: '0.375rem', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
