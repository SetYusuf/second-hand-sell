'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import UserProfileModal from '@/components/admin/UserProfileModal';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  listingsCount?: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ label: string; message: string; onConfirm: () => void } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = getStoredAuthToken();
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Failed to fetch users:', res.status, res.statusText);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = getStoredAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const updateUserInList = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...updates } : u));
  };

  const removeUserFromList = (userId: string) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  // View Profile - open full-width in-page profile modal with real user data
  const handleViewProfile = (user: User) => {
    setProfileUser(user);
  };

  // Edit User - navigate to user detail (could be a modal, but for now navigate)
  const handleEditUser = (user: User) => {
    router.push(`/dashboardadmin/users?edit=${user._id}`);
  };

  // Promote to Owner
  const handlePromote = (user: User) => {
    setConfirmAction({
      label: 'Promote to Owner',
      message: `Promote ${user.name} to Owner role?`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ role: 'owner' }),
          });
          if (res.ok) {
            updateUserInList(user._id, { role: 'owner' });
            showToast('success', `${user.name} promoted to Owner`);
          } else {
            showToast('error', 'Failed to promote user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  // Demote to User
  const handleDemote = (user: User) => {
    setConfirmAction({
      label: 'Demote to User',
      message: `Demote ${user.name} to regular User role?`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ role: 'user' }),
          });
          if (res.ok) {
            updateUserInList(user._id, { role: 'user' });
            showToast('success', `${user.name} demoted to User`);
          } else {
            showToast('error', 'Failed to demote user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  // Ban User
  const handleBanUser = (user: User) => {
    setConfirmAction({
      label: 'Ban User',
      message: `Ban ${user.name}? They will not be able to log in until unbanned.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'banned' }),
          });
          if (res.ok) {
            updateUserInList(user._id, { status: 'banned' });
            showToast('success', `${user.name} has been banned`);
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
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  // Unban User
  const handleUnbanUser = (user: User) => {
    setConfirmAction({
      label: 'Unban User',
      message: `Unban ${user.name}? They will be able to log in again.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'active' }),
          });
          if (res.ok) {
            updateUserInList(user._id, { status: 'active' });
            showToast('success', `${user.name} has been unbanned`);
          } else {
            showToast('error', 'Failed to unban user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  // Delete User
  const handleDeleteUser = (user: User) => {
    setConfirmAction({
      label: 'Delete User',
      message: `Delete ${user.name}? This CANNOT be undone. All their posts will also be deleted.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            removeUserFromList(user._id);
            showToast('success', `${user.name} has been deleted`);
          } else {
            const data = await res.json().catch(() => ({}));
            showToast('error', data.error || 'Failed to delete user');
          }
        } catch {
          showToast('error', 'Network error');
        }
        setActionLoading(false);
        setShowConfirmModal(false);
      },
    });
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'createdAt', label: 'Join Date', render: (val: string) => new Date(val).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (val: string) => (
      <span style={{ fontWeight: val === 'banned' ? 700 : 400, color: val === 'banned' ? '#000' : '#666' }}>
        {val || 'active'}
      </span>
    )},
  ];

  const actions = [
    { label: 'View', onClick: handleViewProfile },
    { label: 'Edit', onClick: handleEditUser },
    { label: 'Promote', onClick: handlePromote, show: (u: User) => u.role !== 'owner' && u.role !== 'admin' },
    { label: 'Demote', onClick: handleDemote, show: (u: User) => u.role === 'owner' },
    { label: 'Ban', onClick: handleBanUser, variant: 'danger' as const, show: (u: User) => u.status !== 'banned' },
    { label: 'Unban', onClick: handleUnbanUser, show: (u: User) => u.status === 'banned' },
    { label: 'Delete', onClick: handleDeleteUser, variant: 'danger' as const },
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
          User Management
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

        {/* Filters */}
        <div className="admin-filter-bar">
          <input
            type="text"
            placeholder="Search users..."
            className="admin-input admin-filter-bar__search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-select admin-filter-bar__select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="admin-select admin-filter-bar__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {/* Users Table */}
        <DataTable columns={columns} data={filteredUsers} actions={actions} />

        {/* Pagination */}
        <div className="admin-pagination">
          <div className="admin-pagination__info">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title={`${confirmAction.label}`}
          message={confirmAction.message}
          confirmLabel={actionLoading ? 'Processing...' : confirmAction.label}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
          variant="danger"
        />
      )}

      {/* User Profile Modal - full width, real data, reuses action handlers */}
      {profileUser && (
        <UserProfileModal
          user={profileUser}
          onClose={() => setProfileUser(null)}
          onPromote={(u) => { setProfileUser(null); handlePromote(u); }}
          onDemote={(u) => { setProfileUser(null); handleDemote(u); }}
          onBan={(u) => { setProfileUser(null); handleBanUser(u); }}
          onUnban={(u) => { setProfileUser(null); handleUnbanUser(u); }}
          onDelete={(u) => { setProfileUser(null); handleDeleteUser(u); }}
        />
      )}
    </AdminLayout>
  );
}
