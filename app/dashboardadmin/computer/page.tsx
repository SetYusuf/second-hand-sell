import React from 'react';

export default function ComputerList() {
  const computers = [
    { id: 1, name: 'MacBook Pro 16"', brand: 'Apple', price: '$2100', seller: 'Tech Haven', type: 'Laptop', postedDate: '2023-10-21' },
    { id: 2, name: 'Dell XPS 13', brand: 'Dell', price: '$1200', seller: 'Gadget Pro', type: 'Laptop', postedDate: '2023-10-19' },
    { id: 3, name: 'Custom Gaming PC', brand: 'Custom', price: '$1800', seller: 'Mike Johnson', type: 'Desktop', postedDate: '2023-10-23' },
    { id: 4, name: 'ThinkPad X1 Carbon', brand: 'Lenovo', price: '$950', seller: 'Office Supplies Co.', type: 'Laptop', postedDate: '2023-10-16' },
    { id: 5, name: 'iMac 24"', brand: 'Apple', price: '$1299', seller: 'Sarah Brown', type: 'All-in-One', postedDate: '2023-10-24' },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">Computer Listings</h2>
          <p className="dashboard-hint">Manage computer and laptop listings</p>
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
          Add Computer
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
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Model Name</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Brand</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Price</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Seller</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Type</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Posted Date</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {computers.map((computer) => (
              <tr key={computer.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{computer.name}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>{computer.brand}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>{computer.price}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {computer.seller}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                   <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    borderRadius: '9999px', 
                    backgroundColor: '#f3f4f6', 
                    color: '#374151' 
                  }}>
                    {computer.type}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {computer.postedDate}
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
