'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface Seller {
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  type: string;
  brand: string;
  condition: string;
  description?: string;
  location?: string;
  specs?: string;
  createdAt: string;
  status: string;
  featured?: boolean;
  userId: string;
  seller: Seller | null;
  images?: string[];
  imageUrls?: string[];
}

type ConfirmVariant = 'default' | 'danger';

interface PendingAction {
  key: string; // unique key identifying product+action, used for per-button loading state
  label: string;
  message: string;
  variant: ConfirmVariant;
  showReasonInput?: boolean;
  onConfirm: (reason?: string) => Promise<void>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [viewingProductLoading, setViewingProductLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '', price: '', description: '', condition: '', brand: '', location: '', imageUrl: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!viewingProduct) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewingProduct(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingProduct]);

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

  const fetchProducts = async () => {
    try {
      const token = getStoredAuthToken();
      const res = await fetch('/api/products?includeRemoved=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Failed to fetch products:', res.status);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProducts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductInList = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, ...updates } : p));
  };

  const removeProductFromList = (productId: string) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const setKeyLoading = (key: string, value: boolean) => {
    setLoadingKeys(prev => ({ ...prev, [key]: value }));
  };

  const isLoading = (productId: string, actionKey: string) => !!loadingKeys[`${productId}_${actionKey}`];

  // ── VIEW — opens an in-page read-only modal preview ──
  const handleView = async (product: Product) => {
    const needsFullDetails = !product.description || !product.location || !product.brand || !product.condition || !product.imageUrl;

    if (!needsFullDetails) {
      setViewingProduct(product);
      return;
    }

    setViewingProductLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setViewingProduct(data.post || product);
      } else {
        setViewingProduct(product);
      }
    } catch {
      setViewingProduct(product);
    } finally {
      setViewingProductLoading(false);
    }
  };

  // ── EDIT — opens edit modal, saves via PUT ──
  const handleEditOpen = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title || '',
      price: String(product.price ?? ''),
      description: product.description || '',
      condition: product.condition || '',
      brand: product.brand || '',
      location: product.location || '',
      imageUrl: product.imageUrl || '',
    });
  };

  const handleEditSave = async () => {
    if (!editingProduct) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editForm.title,
          price: Number(editForm.price),
          description: editForm.description,
          condition: editForm.condition,
          brand: editForm.brand,
          location: editForm.location,
          imageUrl: editForm.imageUrl,
        }),
      });
      if (res.ok) {
        updateProductInList(editingProduct._id, {
          title: editForm.title,
          price: Number(editForm.price),
          description: editForm.description,
          condition: editForm.condition,
          brand: editForm.brand,
          location: editForm.location,
          imageUrl: editForm.imageUrl,
        });
        showToast('success', 'Product updated');
        setEditingProduct(null);
      } else {
        showToast('error', 'Failed to update product');
      }
    } catch {
      showToast('error', 'Network error');
    }
    setSavingEdit(false);
  };

  // ── Generic confirm-driven status action ──
  const runConfirmedAction = async () => {
    if (!pendingAction) return;
    setKeyLoading(pendingAction.key, true);
    setShowConfirmModal(false);
    try {
      await pendingAction.onConfirm(reasonInput);
    } finally {
      setKeyLoading(pendingAction.key, false);
      setPendingAction(null);
      setReasonInput('');
    }
  };

  const askConfirm = (action: PendingAction) => {
    setPendingAction(action);
    setReasonInput('');
    setShowConfirmModal(true);
  };

  // Approve — pending -> active
  const handleApprove = (product: Product) => {
    askConfirm({
      key: `${product._id}_approve`,
      label: 'Approve Product',
      message: `Approve "${product.title}"? It will become visible on the marketplace.`,
      variant: 'default',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'active' }),
          });
          if (res.ok) {
            updateProductInList(product._id, { status: 'active' });
            showToast('success', 'Product approved');
          } else {
            showToast('error', 'Failed to approve product');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  // Reject — pending -> rejected, with optional reason
  const handleReject = (product: Product) => {
    askConfirm({
      key: `${product._id}_reject`,
      label: 'Reject Product',
      message: `Reject "${product.title}"? It will not be published.`,
      variant: 'danger',
      showReasonInput: true,
      onConfirm: async (reason) => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'rejected', rejectReason: reason || '' }),
          });
          if (res.ok) {
            updateProductInList(product._id, { status: 'rejected' });
            showToast('success', 'Product rejected');
          } else {
            showToast('error', 'Failed to reject product');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  // Remove — active -> removed
  const handleRemove = (product: Product) => {
    askConfirm({
      key: `${product._id}_remove`,
      label: 'Remove Product',
      message: `Remove "${product.title}" from the marketplace? It will be hidden from public listings.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'removed' }),
          });
          if (res.ok) {
            updateProductInList(product._id, { status: 'removed' });
            showToast('success', 'Product removed from marketplace');
          } else {
            showToast('error', 'Failed to remove product');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  // Restore — removed -> active
  const handleRestore = (product: Product) => {
    askConfirm({
      key: `${product._id}_restore`,
      label: 'Restore Product',
      message: `Restore "${product.title}" back to the marketplace?`,
      variant: 'default',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'active' }),
          });
          if (res.ok) {
            updateProductInList(product._id, { status: 'active' });
            showToast('success', 'Product restored');
          } else {
            showToast('error', 'Failed to restore product');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  // Delete — permanent
  const handleDelete = (product: Product) => {
    askConfirm({
      key: `${product._id}_delete`,
      label: 'Delete Product',
      message: `Permanently delete "${product.title}"? This cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            removeProductFromList(product._id);
            showToast('success', 'Product deleted');
          } else {
            showToast('error', 'Failed to delete product');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  // Feature / Unfeature toggle
  const handleToggleFeature = (product: Product) => {
    const nextFeatured = !product.featured;
    askConfirm({
      key: `${product._id}_feature`,
      label: nextFeatured ? 'Mark Featured' : 'Unfeature',
      message: nextFeatured
        ? `Mark "${product.title}" as featured?`
        : `Remove "${product.title}" from featured listings?`,
      variant: 'default',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${product._id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ featured: nextFeatured }),
          });
          if (res.ok) {
            updateProductInList(product._id, { featured: nextFeatured });
            showToast('success', nextFeatured ? 'Product marked as featured' : 'Product unfeatured');
          } else {
            showToast('error', 'Failed to update feature status');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.type === categoryFilter;
    const status = product.status || 'active';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    {
      key: 'imageUrl',
      label: 'Image',
      render: (val: string) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={val || '/home/computer.png'} alt="Product" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #000' }} />
      ),
    },
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price', render: (val: number) => `$${val}` },
    {
      key: 'seller',
      label: 'Seller',
      render: (val: Seller | null) => {
        if (!val) return <span style={{ color: '#999', fontStyle: 'italic' }}>Deleted Account</span>;
        return (
          <span style={{ fontWeight: 600 }}>
            {val.name}
            <span style={{ display: 'block', fontSize: '12px', color: '#666', fontWeight: 400 }}>{val.email}</span>
          </span>
        );
      },
    },
    { key: 'type', label: 'Category' },
    { key: 'createdAt', label: 'Created', render: (val: string) => new Date(val).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (val: string, row: Product) => {
        const status = val || 'active';
        return (
          <span style={{ fontWeight: 600, color: status === 'active' ? '#666' : '#000' }}>
            {status}
            {row.featured && <span style={{ marginLeft: 6, fontSize: 11, border: '1px solid #000', padding: '1px 6px' }}>★ Featured</span>}
          </span>
        );
      },
    },
  ];

  // Status-aware, decluttered action set with a "⋯" dropdown for secondary actions
  const actions = [
    { key: 'view', label: 'View', onClick: handleView },
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEditOpen,
      show: (p: Product) => (p.status || 'active') !== 'rejected',
    },
    // Pending-only primary action
    {
      key: 'approve',
      label: 'Approve',
      onClick: handleApprove,
      show: (p: Product) => (p.status || 'active') === 'pending',
      loading: (p: Product) => isLoading(p._id, 'approve'),
    },
    {
      key: 'reject',
      label: 'Reject',
      onClick: handleReject,
      variant: 'danger' as const,
      show: (p: Product) => (p.status || 'active') === 'pending',
      loading: (p: Product) => isLoading(p._id, 'reject'),
    },
    // Active-only primary action
    {
      key: 'remove',
      label: 'Remove',
      onClick: handleRemove,
      variant: 'danger' as const,
      show: (p: Product) => (p.status || 'active') === 'active',
      loading: (p: Product) => isLoading(p._id, 'remove'),
    },
    // Removed-only primary action
    {
      key: 'restore',
      label: 'Restore',
      onClick: handleRestore,
      show: (p: Product) => (p.status || 'active') === 'removed',
      loading: (p: Product) => isLoading(p._id, 'restore'),
    },
    // Secondary actions tucked into "⋯" dropdown
    {
      key: 'feature',
      label: (p: Product) => (p.featured ? 'Unfeature' : 'Feature'),
      onClick: handleToggleFeature,
      dropdown: true,
      show: (p: Product) => (p.status || 'active') !== 'rejected',
      loading: (p: Product) => isLoading(p._id, 'feature'),
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger' as const,
      dropdown: true,
      loading: (p: Product) => isLoading(p._id, 'delete'),
    },
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
          Product Management
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
            placeholder="Search products..."
            className="admin-input admin-filter-bar__search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-select admin-filter-bar__select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Book">Book</option>
            <option value="Computer">Computer</option>
            <option value="Phone">Phone</option>
            <option value="Electronics">Electronics</option>
            <option value="Service">Service</option>
          </select>
          <select
            className="admin-select admin-filter-bar__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="removed">Removed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Products Table */}
        <DataTable columns={columns} data={filteredProducts} actions={actions} />

        {/* Pagination */}
        <div className="admin-pagination">
          <div className="admin-pagination__info">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Approve / Reject / Remove / Restore / Delete / Feature) */}
      {pendingAction && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title={pendingAction.label}
          message={pendingAction.message}
          confirmLabel={pendingAction.label}
          onConfirm={runConfirmedAction}
          onCancel={() => { setShowConfirmModal(false); setPendingAction(null); }}
          variant={pendingAction.variant}
          showReasonInput={pendingAction.showReasonInput}
          reasonValue={reasonInput}
          onReasonChange={setReasonInput}
          reasonPlaceholder="Why is this product being rejected?"
        />
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="admin-modal-overlay" onClick={() => setViewingProduct(null)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '760px', width: '92vw', maxHeight: '90vh', overflowY: 'auto', padding: '24px', border: '1px solid #000' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="admin-modal__title" style={{ marginBottom: 0 }}>Product Preview</h2>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                style={{ background: 'transparent', border: '1px solid #000', color: '#000', cursor: 'pointer', width: '36px', height: '36px', fontSize: '18px' }}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>

            {viewingProductLoading ? (
              <div style={{ padding: '24px 0', color: '#333', fontSize: '14px' }}>Loading product details...</div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 320px) 1fr', gap: '20px' }}>
                  <div>
                    <img
                      src={viewingProduct.imageUrl || '/home/computer.png'}
                      alt={viewingProduct.title}
                      style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', border: '1px solid #000', background: '#f5f5f5' }}
                    />
                    {(() => {
                      const images = [
                        viewingProduct.imageUrl,
                        ...(Array.isArray(viewingProduct.images) ? viewingProduct.images : []),
                        ...(Array.isArray(viewingProduct.imageUrls) ? viewingProduct.imageUrls : []),
                      ].filter(Boolean) as string[];
                      const uniqueImages = images.filter((img, index) => images.indexOf(img) === index);
                      return uniqueImages.length > 1 ? (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {uniqueImages.map((img, index) => (
                            <img
                              key={`${img}-${index}`}
                              src={img}
                              alt={`${viewingProduct.title} thumbnail ${index + 1}`}
                              style={{ width: '56px', height: '56px', objectFit: 'cover', border: '1px solid #000' }}
                            />
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Title</div>
                      <div style={{ fontSize: '18px', fontWeight: 700 }}>{viewingProduct.title}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 700 }}>${viewingProduct.price}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Category</div>
                        <div>{viewingProduct.type}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Location</div>
                        <div style={{ wordBreak: 'break-word' }}>{viewingProduct.location || '—'}</div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>AD ID</div>
                        <div style={{ fontSize: '13px', wordBreak: 'break-all' }}>{viewingProduct._id}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Status</div>
                        <div>{viewingProduct.status || 'active'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Description</div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{viewingProduct.description || 'No description provided.'}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Condition</div>
                    <div>{viewingProduct.condition}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Brand</div>
                    <div>{viewingProduct.brand}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Specs</div>
                    <div>{viewingProduct.specs || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '4px' }}>Created</div>
                    <div>{new Date(viewingProduct.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #000', paddingTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '8px' }}>Seller</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={viewingProduct.seller?.avatar || '/notification-image/lina.png'}
                      alt={viewingProduct.seller?.name || 'Seller'}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid #000' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{viewingProduct.seller?.name || 'Unknown seller'}</div>
                      <div style={{ color: '#333', fontSize: '14px' }}>{viewingProduct.seller?.email || 'No email available'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => !savingEdit && setEditingProduct(null)}>
          <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">Edit Product</h2>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input
                  className="admin-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Price ($)</label>
                <input
                  type="number"
                  className="admin-input"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Brand</label>
                <input
                  className="admin-input"
                  value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Condition</label>
                <input
                  className="admin-input"
                  value={editForm.condition}
                  onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Location</label>
              <input
                className="admin-input"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Image URL</label>
              <input
                className="admin-input"
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-textarea"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>

            <div className="admin-modal__actions">
              <button className="admin-modal__btn" onClick={() => setEditingProduct(null)} disabled={savingEdit}>
                Cancel
              </button>
              <button className="admin-modal__btn admin-modal__btn--primary" onClick={handleEditSave} disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
