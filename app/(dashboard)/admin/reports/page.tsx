'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface Report {
  _id: string;
  type: 'product' | 'user';
  reason: string;
  reporter: string;
  targetId: string;
  targetUserId: string;
  timestamp: string;
  status: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ label: string; message: string; onConfirm: () => void } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getAuthHeaders = () => {
    const token = getStoredAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchReports = async () => {
    try {
      const token = getStoredAuthToken();
      const res = await fetch('/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Failed to fetch reports:', res.status);
        // Fall back to empty list if no reports collection exists yet
        setReports([]);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReportFromList = (reportId: string) => {
    setReports(prev => prev.filter(r => r._id !== reportId));
  };

  // Dismiss - mark report as dismissed
  const handleDismiss = (report: Report) => {
    setConfirmAction({
      label: 'Dismiss Report',
      message: `Dismiss this report? It will be removed from the active reports list.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/reports/${report._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'dismissed' }),
          });
          if (res.ok) {
            removeReportFromList(report._id);
            showToast('success', 'Report dismissed');
          } else {
            showToast('error', 'Failed to dismiss report');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedReport(report);
    setShowConfirmModal(true);
  };

  // Remove Product - remove the reported product from marketplace
  const handleRemoveProduct = (report: Report) => {
    if (!report.targetId) {
      showToast('error', 'No product ID associated with this report');
      return;
    }
    setConfirmAction({
      label: 'Remove Product',
      message: `Remove the reported product from the marketplace? This will hide it from public listings.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/products/${report.targetId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'removed' }),
          });
          if (res.ok) {
            // Also dismiss the report
            await fetch(`/api/reports/${report._id}`, {
              method: 'PATCH',
              headers: getAuthHeaders(),
              body: JSON.stringify({ status: 'resolved' }),
            });
            removeReportFromList(report._id);
            showToast('success', 'Product removed and report resolved');
          } else {
            showToast('error', 'Failed to remove product');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedReport(report);
    setShowConfirmModal(true);
  };

  // Ban User - ban the reported user
  const handleBanUser = (report: Report) => {
    const userId = report.targetUserId || report.targetId;
    if (!userId) {
      showToast('error', 'No user ID associated with this report');
      return;
    }
    setConfirmAction({
      label: 'Ban User',
      message: `Ban the reported user? They will not be able to log in until unbanned.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'banned' }),
          });
          if (res.ok) {
            // Also resolve the report
            await fetch(`/api/reports/${report._id}`, {
              method: 'PATCH',
              headers: getAuthHeaders(),
              body: JSON.stringify({ status: 'resolved' }),
            });
            removeReportFromList(report._id);
            showToast('success', 'User banned and report resolved');
          } else {
            showToast('error', 'Failed to ban user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedReport(report);
    setShowConfirmModal(true);
  };

  // Warn User - increment warnings count on user account
  const handleWarnUser = (report: Report) => {
    const userId = report.targetUserId || report.targetId;
    if (!userId) {
      showToast('error', 'No user ID associated with this report');
      return;
    }
    setConfirmAction({
      label: 'Warn User',
      message: `Send a warning to the reported user? A warning flag will be added to their account.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          // Increment warnings count using PATCH
          const res = await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ warn: true }),
          });
          if (res.ok) {
            // Also dismiss the report
            await fetch(`/api/reports/${report._id}`, {
              method: 'PATCH',
              headers: getAuthHeaders(),
              body: JSON.stringify({ status: 'resolved' }),
            });
            removeReportFromList(report._id);
            showToast('success', 'User warned and report resolved');
          } else {
            showToast('error', 'Failed to warn user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedReport(report);
    setShowConfirmModal(true);
  };

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'reason', label: 'Reason' },
    { key: 'reporter', label: 'Reporter' },
    { key: 'timestamp', label: 'Timestamp', render: (val: string) => val ? new Date(val).toLocaleString() : '-' },
    { key: 'status', label: 'Status' },
  ];

  const actions = [
    { label: 'Dismiss', onClick: handleDismiss },
    { label: 'Remove Product', onClick: handleRemoveProduct, variant: 'danger' as const, show: (r: Report) => r.type === 'product' },
    { label: 'Ban User', onClick: handleBanUser, variant: 'danger' as const, show: (r: Report) => r.type === 'user' || !!r.targetUserId },
    { label: 'Warn User', onClick: handleWarnUser, show: (r: Report) => r.type === 'user' || !!r.targetUserId },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Reports & Moderation
        </h1>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
            padding: '12px 20px', border: '1px solid #000', background: toast.type === 'success' ? '#000' : '#fff',
            color: toast.type === 'success' ? '#fff' : '#000', fontSize: '14px', fontWeight: 600,
          }}>
            {toast.message}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="admin-table-container" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>No active reports. All clear!</p>
          </div>
        ) : (
          <DataTable columns={columns} data={reports} actions={actions} />
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title={confirmAction.label}
          message={confirmAction.message}
          confirmLabel={actionLoading ? 'Processing...' : confirmAction.label}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
          variant="danger"
        />
      )}
    </AdminLayout>
  );
}