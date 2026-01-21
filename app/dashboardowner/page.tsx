import React from 'react';

export default function OwnerDashboard() {
  return (
    <>
      <div className="dashboard-section">
        <h2 className="dashboard-heading">Dashboard</h2>
        <h3 className="dashboard-subheading">Main Dashboard Overview</h3>
        <p className="dashboard-hint">Drag cards to reorder</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 10-8 0v4H5a1 1 0 00-1 1v7a2 2 0 002 2h12a2 2 0 002-2v-7a1 1 0 00-1-1h-3zM8 11h8" />
            </svg>
          </div>
          <div>
            <p className="stat-label">My Products</p>
            <p className="stat-value">342</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3L5 21h2l1-4h8l1 4h2L14.25 3h-4.5zM9 13l3-8 3 8H9z" />
            </svg>
          </div>
          <div>
            <p className="stat-label">My Services</p>
            <p className="stat-value">58</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon indigo">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14M6 7h8M6 11h8M6 15h6" />
            </svg>
          </div>
          <div>
            <p className="stat-label">My Books</p>
            <p className="stat-value">129</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm6 10h8" />
            </svg>
          </div>
          <div>
            <p className="stat-label">My Phones</p>
            <p className="stat-value">76</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16v12H4zM8 17h8v2H8z" />
            </svg>
          </div>
          <div>
            <p className="stat-label">My Computers</p>
            <p className="stat-value">45</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.5-1.5a2 2 0 01-.5-1.341V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341A6 6 0 006 11v3.159c0 .506-.201 1-.558 1.358L4 17h5v1a3 3 0 006 0v-1z" />
            </svg>
          </div>
          <div>
            <p className="stat-label">Notifications</p>
            <p className="stat-value">19</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Revenue Trend</h3>
              <p className="chart-subtitle">Monthly revenue over time</p>
            </div>
            <span className="trend-indicator positive">
              <svg className="icon-sm icon-mr" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +15.2%
            </span>
          </div>
          <div className="chart-area revenue">
            <svg className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
              <path d="M0,200 C100,180 200,190 300,150 S500,100 600,90 L600,256 L0,256 Z" fill="rgba(253, 224, 71, 0.2)" />
              <path d="M0,200 C100,180 200,190 300,150 S500,100 600,90" stroke="#FBBF24" strokeWidth="3" fill="none" />
            </svg>
            <div className="chart-y-axis">
              <span>$6000</span>
              <span>$4500</span>
              <span>$3000</span>
              <span>$1500</span>
              <span>$0</span>
            </div>
            <div className="chart-x-axis">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Category Totals</h3>
              <p className="chart-subtitle">Last 7 items by category</p>
            </div>
            <span className="chart-status-text">Overview</span>
          </div>
          <div className="chart-area occupancy">
            <svg className="absolute inset-0 w-full h-full p-6" preserveAspectRatio="none">
              <rect x="20" y="150" width="40" height="90" fill="#3B82F6" />
              <rect x="80" y="120" width="40" height="120" fill="#10B981" />
              <rect x="140" y="170" width="40" height="70" fill="#F59E0B" />
              <rect x="200" y="100" width="40" height="140" fill="#8B5CF6" />
              <rect x="260" y="160" width="40" height="80" fill="#EF4444" />
              <rect x="320" y="130" width="40" height="110" fill="#14B8A6" />
              <rect x="380" y="140" width="40" height="100" fill="#4F46E5" />
              <rect x="440" y="180" width="40" height="60" fill="#3B82F6" />
            </svg>
            <div className="chart-y-axis occupancy-y">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="chart-x-axis occupancy-x">
              <span>Users</span>
              <span>Owners</span>
              <span>Products</span>
              <span>Services</span>
              <span>Books</span>
              <span>Phones</span>
              <span>Computers</span>
              <span>Notif.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="summary-heading">Recent Posts</h3>
        <div className="table-container" style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginTop: '1rem'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Item Name</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Price</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ divideY: '1px solid #e5e7eb' }}>
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>iPhone 14 Pro</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Phone</span></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>$999</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>2023-10-25</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#065f46' }}>Active</span></td>
              </tr>
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>MacBook Pro 16"</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Computer</span></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>$2100</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>2023-10-24</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#065f46' }}>Active</span></td>
              </tr>
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>House Cleaning</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Service</span></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>$30/hr</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>2023-10-23</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#f3f4f6', color: '#374151' }}>Inactive</span></td>
              </tr>
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>The Great Gatsby</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>Book</span></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>$15</div></td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>2023-10-22</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}><span style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#065f46' }}>Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
