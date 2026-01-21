import React from 'react';

export default function UserList() {
  // Mock data for the user list
  const users = [
    { id: 1, name: 'Alice Walker', email: 'alice@example.com', role: 'User', status: 'Active', joinedDate: '2023-01-15', totalOrders: 12 },
    { id: 2, name: 'Bob Martin', email: 'bob@example.com', role: 'User', status: 'Active', joinedDate: '2023-02-20', totalOrders: 5 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Inactive', joinedDate: '2023-03-10', totalOrders: 0 },
    { id: 4, name: 'Diana Ross', email: 'diana@example.com', role: 'VIP', status: 'Active', joinedDate: '2023-01-05', totalOrders: 45 },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'User', status: 'Suspended', joinedDate: '2023-04-12', totalOrders: 2 },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">User List</h2>
          <p className="dashboard-hint">Manage registered users and their account status</p>
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
          Add New User
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
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Joined Date</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {users.map((user) => (
              <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, height: '2.5rem', width: '2.5rem' }}>
                      <img style={{ height: '2.5rem', width: '2.5rem', borderRadius: '9999px' }} src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" />
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{user.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.role}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    borderRadius: '9999px', 
                    backgroundColor: user.status === 'Active' ? '#d1fae5' : user.status === 'Suspended' ? '#fef2f2' : '#f3f4f6', 
                    color: user.status === 'Active' ? '#065f46' : user.status === 'Suspended' ? '#991b1b' : '#374151' 
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {user.joinedDate}
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
