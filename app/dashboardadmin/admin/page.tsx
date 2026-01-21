import React from 'react';

export default function AdminList() {
  // Mock data for the admin list
  const admins = [
    { id: 1, name: 'Super Admin', email: 'admin@example.com', role: 'Super Admin', status: 'Active', lastLogin: '2023-10-25 10:30 AM' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-24 02:15 PM' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'Inactive', lastLogin: '2023-10-20 09:45 AM' },
    { id: 4, name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'Active', lastLogin: '2023-10-25 08:00 AM' },
    { id: 5, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-23 04:20 PM' },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">Admin List</h2>
          <p className="dashboard-hint">Manage system administrators and their roles</p>
        </div>
        <button className="add-btn" style={{ 
          backgroundColor: '#4f46e5', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.375rem', 
          border: 'none', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Admin
        </button>
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
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Name</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Role</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Last Login</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {admins.map((admin) => (
              <tr key={admin.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, height: '2.5rem', width: '2.5rem' }}>
                      <img style={{ height: '2.5rem', width: '2.5rem', borderRadius: '9999px' }} src={`https://ui-avatars.com/api/?name=${admin.name}&background=random`} alt="" />
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{admin.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>{admin.role}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    borderRadius: '9999px', 
                    backgroundColor: admin.status === 'Active' ? '#d1fae5' : '#f3f4f6', 
                    color: admin.status === 'Active' ? '#065f46' : '#374151' 
                  }}>
                    {admin.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {admin.lastLogin}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500' }}>
                  <a href="#" style={{ color: '#4f46e5', marginRight: '1rem', textDecoration: 'none' }}>Edit</a>
                  <a href="#" style={{ color: '#dc2626', textDecoration: 'none' }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
