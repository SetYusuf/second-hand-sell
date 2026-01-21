import React from 'react';

export default function OwnerList() {
  // Mock data for the owner list
  const owners = [
    { id: 1, name: 'Robert Chen', email: 'robert@example.com', shopName: 'Tech Haven', status: 'Active', joinedDate: '2023-01-10', itemsListed: 45 },
    { id: 2, name: 'Emily Davis', email: 'emily@example.com', shopName: 'Book Worm', status: 'Active', joinedDate: '2023-02-15', itemsListed: 120 },
    { id: 3, name: 'Michael Wilson', email: 'michael@example.com', shopName: 'Gadget Pro', status: 'Pending', joinedDate: '2023-03-20', itemsListed: 0 },
    { id: 4, name: 'Sarah Brown', email: 'sarah@example.com', shopName: 'Fashionista', status: 'Active', joinedDate: '2023-01-05', itemsListed: 67 },
    { id: 5, name: 'David Lee', email: 'david@example.com', shopName: 'Retro Finds', status: 'Suspended', joinedDate: '2023-04-10', itemsListed: 12 },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">Owner List</h2>
          <p className="dashboard-hint">Manage shop owners and their verification status</p>
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
          Add New Owner
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
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Owner Name</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Shop Name</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Joined Date</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Items Listed</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {owners.map((owner) => (
              <tr key={owner.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, height: '2.5rem', width: '2.5rem' }}>
                      <img style={{ height: '2.5rem', width: '2.5rem', borderRadius: '9999px' }} src={`https://ui-avatars.com/api/?name=${owner.name}&background=random`} alt="" />
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{owner.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{owner.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>{owner.shopName}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    borderRadius: '9999px', 
                    backgroundColor: owner.status === 'Active' ? '#d1fae5' : owner.status === 'Suspended' ? '#fef2f2' : '#fef3c7', 
                    color: owner.status === 'Active' ? '#065f46' : owner.status === 'Suspended' ? '#991b1b' : '#92400e' 
                  }}>
                    {owner.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {owner.joinedDate}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {owner.itemsListed}
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
