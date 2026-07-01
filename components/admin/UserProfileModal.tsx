'use client';

import { useEffect, useState } from 'react';
import './AdminLayout.css';
import './UserProfileModal.css';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface ListingItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: string;
}

interface FullProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  phone: string;
  location: string;
  bio: string;
  warnings: number;
}

interface BasicUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  listingsCount?: number;
}

interface UserProfileModalProps {
  user: BasicUser;
  onClose: () => void;
  onPromote: (user: BasicUser) => void;
  onDemote: (user: BasicUser) => void;
  onBan: (user: BasicUser) => void;
  onUnban: (user: BasicUser) => void;
  onDelete: (user: BasicUser) => void;
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  const hasValue = value !== undefined && value !== null && value !== '';
  return (
    <div className="user-profile-field">
      <span className="user-profile-field__label">{label}</span>
      <span className={`user-profile-field__value ${hasValue ? '' : 'user-profile-field__value--empty'}`}>
        {hasValue ? value : 'Not provided'}
      </span>
    </div>
  );
}

export default function UserProfileModal({
  user,
  onClose,
  onPromote,
  onDemote,
  onBan,
  onUnban,
  onDelete,
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [reportsCount, setReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getStoredAuthToken();
        const res = await fetch(`/api/admin/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            setProfile(data.user);
            setListings(data.listings || []);
            setReportsCount(data.stats?.reportsCount || 0);
          } else {
            setError(data.error || 'Failed to load profile');
          }
        }
      } catch {
        if (!cancelled) setError('Network error while loading profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [user._id]);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  const isBanned = (profile?.status || user.status) === 'banned';
  const role = profile?.role || user.role;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal user-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-profile-modal__header">
          <h2 className="admin-modal__title" style={{ marginBottom: 0 }}>
            User Profile
          </h2>
          <button className="user-profile-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="user-profile-modal__loading">Loading profile...</div>
        ) : error ? (
          <div className="user-profile-modal__error">{error}</div>
        ) : (
          <div className="user-profile-modal__body">
            {/* IDENTITY */}
            <div className="user-profile-modal__identity">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="user-profile-modal__avatar"
                />
              ) : (
                <div className="user-profile-modal__avatar user-profile-modal__avatar--placeholder">
                  {(profile?.name || user.name)?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="user-profile-modal__identity-info">
                <h3 className="user-profile-modal__name">{profile?.name || user.name}</h3>
                <div className="user-profile-modal__username">@{profile?.username || 'user'}</div>
                <div className="user-profile-modal__badges">
                  <span className={`user-profile-badge user-profile-badge--role-${role}`}>
                    {role}
                  </span>
                  <span
                    className={`user-profile-badge ${isBanned ? 'user-profile-badge--banned' : 'user-profile-badge--active'}`}
                  >
                    {isBanned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="user-profile-modal__actions">
              {role !== 'owner' && role !== 'admin' && (
                <button className="admin-btn admin-btn--secondary" onClick={() => onPromote(user)}>
                  Promote to Owner
                </button>
              )}
              {role === 'owner' && (
                <button className="admin-btn admin-btn--secondary" onClick={() => onDemote(user)}>
                  Demote to User
                </button>
              )}
              {isBanned ? (
                <button className="admin-btn admin-btn--secondary" onClick={() => onUnban(user)}>
                  Unban User
                </button>
              ) : (
                <button className="admin-btn admin-btn--danger" onClick={() => onBan(user)}>
                  Ban User
                </button>
              )}
              <button className="admin-btn admin-btn--danger" onClick={() => onDelete(user)}>
                Delete Account
              </button>
            </div>

            {/* IDENTITY DETAILS */}
            <div className="user-profile-modal__section">
              <h4 className="user-profile-modal__section-title">Identity</h4>
              <div className="user-profile-grid">
                <Field label="Email" value={profile?.email} />
                <Field label="Role" value={role} />
              </div>
            </div>

            {/* ACCOUNT META */}
            <div className="user-profile-modal__section">
              <h4 className="user-profile-modal__section-title">Account Meta</h4>
              <div className="user-profile-grid">
                <Field label="Member Since" value={memberSince} />
                <Field label="Phone" value={profile?.phone} />
                <Field label="Location" value={profile?.location} />
                <Field label="Bio" value={profile?.bio} />
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="user-profile-modal__section">
              <h4 className="user-profile-modal__section-title">Activity</h4>
              <div className="user-profile-grid">
                <Field label="Total Products Listed" value={listings.length} />
                <Field label="Reports Filed Against User" value={reportsCount} />
                <Field label="Warnings Issued" value={profile?.warnings ?? 0} />
              </div>

              <h5 className="user-profile-modal__listings-title">Active Listings</h5>
              {listings.length === 0 ? (
                <div className="user-profile-modal__empty">No active listings</div>
              ) : (
                <div className="user-profile-modal__listings-grid">
                  {listings.map((item) => (
                    <div key={item._id} className="user-profile-listing-card">
                      <div className="user-profile-listing-card__image-wrap">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="user-profile-listing-card__image"
                          />
                        ) : (
                          <div className="user-profile-listing-card__image user-profile-listing-card__image--placeholder">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="user-profile-listing-card__body">
                        <div className="user-profile-listing-card__title">{item.title}</div>
                        <div className="user-profile-listing-card__price">${item.price}</div>
                        <div className="user-profile-listing-card__status">{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="admin-modal__actions" style={{ marginTop: '20px' }}>
          <button onClick={onClose} className="admin-modal__btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
