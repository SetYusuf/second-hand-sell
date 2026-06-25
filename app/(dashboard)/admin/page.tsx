'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalOwners: number
  totalAdmins: number
  totalPosts: number
  totalBooks: number
  totalPhones: number
  totalComputers: number
  totalElectronics: number
  totalServices: number
  avgPrice: number
  recentPosts: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
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

      const res = await fetch('/api/stats', {
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
      <h1>Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <span className="stat-label">Active Users</span>
        </div>

        <div className="stat-card">
          <h3>Total Owners</h3>
          <p className="stat-number">{stats.totalOwners}</p>
          <span className="stat-label">Sellers</span>
        </div>

        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-number">{stats.totalPosts}</p>
          <span className="stat-label">Listings</span>
        </div>

        <div className="stat-card">
          <h3>Avg Price</h3>
          <p className="stat-number">${stats.avgPrice}</p>
          <span className="stat-label">Per Item</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-section">
        <h2>Posts by Category</h2>
        <div className="category-grid">
          <div className="category-card">
            <span>📚 Books</span>
            <p>{stats.totalBooks}</p>
          </div>
          <div className="category-card">
            <span>📱 Phones</span>
            <p>{stats.totalPhones}</p>
          </div>
          <div className="category-card">
            <span>💻 Computers</span>
            <p>{stats.totalComputers}</p>
          </div>
          <div className="category-card">
            <span>⚡ Electronics</span>
            <p>{stats.totalElectronics}</p>
          </div>
          <div className="category-card">
            <span>🔧 Services</span>
            <p>{stats.totalServices}</p>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="recent-posts-section">
        <h2>Recent Posts</h2>
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentPosts.map((post: any) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.type}</td>
                <td>${post.price}</td>
                <td>{post.contactName}</td>
                <td>
                  {new Date(post.createdAt).toLocaleDateString()}
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
      `}</style>
    </div>
  )
}