'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface OwnerStats {
  myPosts: number
  myBooks: number
  myPhones: number
  myComputers: number
  myElectronics: number
  myServices: number
  myAvgPrice: number
  recentPosts: any[]
}

export default function OwnerDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/stats/owner', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch stats', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading dashboard...
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Failed to load statistics
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <h1>My Dashboard</h1>

      {/* My Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>My Posts</h3>
          <p className="stat-number">{stats.myPosts}</p>
          <span className="stat-label">Active Listings</span>
        </div>

        <div className="stat-card">
          <h3>Avg Price</h3>
          <p className="stat-number">${stats.myAvgPrice}</p>
          <span className="stat-label">Per Item</span>
        </div>

        <div className="stat-card">
          <h3>Total Categories</h3>
          <p className="stat-number">5</p>
          <span className="stat-label">Types</span>
        </div>
      </div>

      {/* My Category Breakdown */}
      <div className="category-section">
        <h2>My Posts by Category</h2>
        <div className="category-grid">
          <div className="category-card">
            <span>📚 Books</span>
            <p>{stats.myBooks}</p>
          </div>
          <div className="category-card">
            <span>📱 Phones</span>
            <p>{stats.myPhones}</p>
          </div>
          <div className="category-card">
            <span>💻 Computers</span>
            <p>{stats.myComputers}</p>
          </div>
          <div className="category-card">
            <span>⚡ Electronics</span>
            <p>{stats.myElectronics}</p>
          </div>
          <div className="category-card">
            <span>🔧 Services</span>
            <p>{stats.myServices}</p>
          </div>
        </div>
      </div>

      {/* My Recent Posts */}
      <div className="recent-posts-section">
        <h2>My Recent Posts</h2>
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentPosts.map((post: any) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.type}</td>
                <td>${post.price}</td>
                <td>{post.condition}</td>
                <td>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button className="action-btn">Edit</button>
                  <button className="action-btn danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .dashboard-content {
          padding: 20px;
          background: var(--bg-color, #f5f5f5);
          min-height: 100vh;
        }

        h1 {
          margin-bottom: 30px;
          color: var(--text-color, #333);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .stat-number {
          font-size: 32px;
          font-weight: bold;
          margin: 10px 0;
          color: #2563eb;
        }

        .stat-label {
          color: #999;
          font-size: 12px;
        }

        .category-section {
          margin-bottom: 40px;
        }

        .category-section h2 {
          margin-bottom: 20px;
          color: var(--text-color, #333);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .category-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .category-card span {
          display: block;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .category-card p {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: #2563eb;
        }

        .recent-posts-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .recent-posts-section h2 {
          margin-top: 0;
          margin-bottom: 20px;
        }

        .posts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .posts-table thead {
          background: #f9f9f9;
          border-bottom: 2px solid #ddd;
        }

        .posts-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
        }

        .posts-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .posts-table tr:hover {
          background: #f9f9f9;
        }

        .action-btn {
          padding: 6px 12px;
          margin-right: 5px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .action-btn:hover {
          background: #1d4ed8;
        }

        .action-btn.danger {
          background: #dc2626;
        }

        .action-btn.danger:hover {
          background: #b91c1c;
        }
      `}</style>
    </div>
  )
}