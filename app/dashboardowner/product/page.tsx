import React from 'react';

export default function ProductList() {
  const products = [
    { id: 1, name: 'Vintage Camera', category: 'Electronics', price: '$150', seller: 'Retro Finds', status: 'Available', date: '2023-10-25' },
    { id: 2, name: 'Leather Jacket', category: 'Clothing', price: '$85', seller: 'Fashionista', status: 'Sold', date: '2023-10-22' },
    { id: 3, name: 'Wooden Table', category: 'Furniture', price: '$200', seller: 'Home Decor', status: 'Available', date: '2023-10-20' },
    { id: 4, name: 'Gaming Mouse', category: 'Accessories', price: '$40', seller: 'Gadget Pro', status: 'Available', date: '2023-10-24' },
    { id: 5, name: 'Bicycle', category: 'Sports', price: '$300', seller: 'Mike Johnson', status: 'Pending', date: '2023-10-23' },
  ];

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dashboard-heading">All Products</h2>
          <p className="dashboard-hint">General overview of all product listings</p>
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
          Add Product
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
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Product Name</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Category</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Price</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {products.map((product) => (
              <tr key={product.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{product.name}</div>
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
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>{product.price}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    borderRadius: '9999px', 
                    backgroundColor: product.status === 'Available' ? '#d1fae5' : product.status === 'Sold' ? '#f3f4f6' : '#fef3c7', 
                    color: product.status === 'Available' ? '#065f46' : product.status === 'Sold' ? '#374151' : '#92400e' 
                  }}>
                    {product.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {product.date}
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
