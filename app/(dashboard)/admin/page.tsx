'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import ChartCard from '@/components/admin/ChartCard';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeListings: number;
  bannedUsers: number;
  reportedItems: number;
  newRegistrations7d: number;
}

interface ChartData {
  userGrowth: { date: string; count: number }[];
  productTrend: { date: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  topSellers: { userId: string; name: string; productCount: number }[];
}

const GRAY_COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#e5e5e5'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [chartsError, setChartsError] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const getAuthHeaders = () => {
    const token = getStoredAuthToken();
    return { 'Authorization': `Bearer ${token}` };
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const res = await fetch('/api/admin/dashboard-stats', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        setStatsError(true);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats({
          totalUsers: data.totalUsers,
          totalProducts: data.totalProducts,
          activeListings: data.activeListings,
          bannedUsers: data.bannedUsers,
          reportedItems: data.reportedItems,
          newRegistrations7d: data.newRegistrations7d,
        });
      } else {
        setStatsError(true);
      }
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCharts = async () => {
    setChartsLoading(true);
    setChartsError(false);
    try {
      const res = await fetch('/api/admin/dashboard-charts', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        setChartsError(true);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCharts({
          userGrowth: data.userGrowth || [],
          productTrend: data.productTrend || [],
          categoryDistribution: data.categoryDistribution || [],
          topSellers: data.topSellers || [],
        });
      } else {
        setChartsError(true);
      }
    } catch {
      setChartsError(true);
    } finally {
      setChartsLoading(false);
    }
  };

  const StatSkeleton = () => (
    <div className="admin-stat-card" style={{ minHeight: '80px' }}>
      <div style={{ height: '32px', width: '60px', background: '#e5e5e5', marginBottom: '8px' }} />
      <div style={{ height: '13px', width: '120px', background: '#e5e5e5' }} />
    </div>
  );

  const ChartSkeleton = () => (
    <div className="admin-chart-card">
      <div style={{ height: '16px', width: '150px', background: '#e5e5e5', marginBottom: '16px' }} />
      <div style={{ height: '200px', background: '#f5f5f5', border: '1px solid #e5e5e5' }} />
    </div>
  );

  const EmptyChart = () => (
    <div style={{
      height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #e5e5e5', background: '#fafafa',
    }}>
      <span style={{ color: '#999', fontSize: '14px' }}>No data yet</span>
    </div>
  );

  const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div style={{
      height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #e5e5e5', background: '#fafafa', gap: '12px',
    }}>
      <span style={{ color: '#666', fontSize: '14px' }}>Failed to load</span>
      <button onClick={onRetry} className="admin-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
        Retry
      </button>
    </div>
  );

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return `${parts[1]}/${parts[2]}`;
  };

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Dashboard Overview
        </h1>

        {statsError ? (
          <div className="admin-stat-grid">
            <div className="admin-stat-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Failed to load stats</p>
              <button onClick={fetchStats} className="admin-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Retry
              </button>
            </div>
          </div>
        ) : statsLoading ? (
          <div className="admin-stat-grid">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        ) : stats ? (
          <div className="admin-stat-grid">
            <StatCard value={stats.totalUsers} label="Total Users" />
            <StatCard value={stats.totalProducts} label="Total Products" />
            <StatCard value={stats.activeListings} label="Active Listings" />
            <StatCard value={stats.bannedUsers} label="Banned Users" />
            <StatCard value={stats.reportedItems} label="Reported Items" />
            <StatCard value={stats.newRegistrations7d} label="New Registrations (7 days)" />
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '24px' }}>
          <ChartCard title="User Growth">
            {chartsLoading ? (
              <ChartSkeleton />
            ) : chartsError ? (
              <ErrorState onRetry={fetchCharts} />
            ) : charts && charts.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={charts.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={11} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #000', borderRadius: 0, fontSize: '13px' }}
                    labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                  />
                  <Line type="monotone" dataKey="count" stroke="#000000" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="Product Posting Trend">
            {chartsLoading ? (
              <ChartSkeleton />
            ) : chartsError ? (
              <ErrorState onRetry={fetchCharts} />
            ) : charts && charts.productTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.productTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={11} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #000', borderRadius: 0, fontSize: '13px' }}
                    labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                  />
                  <Bar dataKey="count" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="Category Distribution">
            {chartsLoading ? (
              <ChartSkeleton />
            ) : chartsError ? (
              <ErrorState onRetry={fetchCharts} />
            ) : charts && charts.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.category || entry.name}: ${entry.count || entry.value}`}
                    labelLine={false}
                    style={{ fontSize: '11px' }}
                  >
                    {charts.categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GRAY_COLORS[index % GRAY_COLORS.length]} stroke="#fff" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: '1px solid #000', borderRadius: 0, fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="Most Active Sellers">
            {chartsLoading ? (
              <ChartSkeleton />
            ) : chartsError ? (
              <ErrorState onRetry={fetchCharts} />
            ) : charts && charts.topSellers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {charts.topSellers.map((seller, index) => {
                  const maxCount = charts.topSellers[0].productCount;
                  const barWidth = (seller.productCount / maxCount) * 100;
                  return (
                    <div key={seller.userId} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, width: '24px', flexShrink: 0 }}>
                        {index + 1}.
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                          {seller.name}
                        </div>
                        <div style={{ height: '20px', background: '#f5f5f5', border: '1px solid #e5e5e5' }}>
                          <div style={{
                            height: '100%',
                            width: `${barWidth}%`,
                            background: index === 0 ? '#000' : '#333',
                          }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 700, width: '40px', textAlign: 'right' }}>
                        {seller.productCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </div>
      </div>
    </AdminLayout>
  );
}