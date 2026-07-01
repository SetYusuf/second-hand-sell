'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from '../../contexts/ThemeContext'
import { clearAuthSession, getStoredAuthToken } from '@/lib/auth-storage'
import './profile.css'

interface UserProfile {
  _id?: string
  name: string
  email: string
  avatar: string
  role: string
  createdAt?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
}

interface Post {
  _id: string
  title: string
  type: string
  price: number
  imageUrl: string
  condition: string
  status?: string
  createdAt: string
}

interface Purchase {
  _id: string
  productId: string
  productTitle: string
  productImage: string
  sellerName: string
  sellerAvatar: string
  price: number
  purchasedAt: string
  status: string
}

interface Sale {
  _id: string
  productId: string
  productTitle: string
  productImage: string
  buyerName: string
  buyerAvatar: string
  price: number
  soldAt: string
  status: string
}

interface Review {
  _id: string
  reviewerName: string
  reviewerAvatar: string
  rating: number
  comment: string
  createdAt: string
  forItem?: string
}

type TabType = 'overview' | 'posts' | 'bought' | 'sold' | 'reviews'

export default function ProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: '',
    role: 'student'
  })
  const [editProfile, setEditProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: '',
    role: 'student',
    bio: '',
    location: '',
    phone: '',
    website: ''
  })
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingPurchases, setLoadingPurchases] = useState(true)
  const [loadingSales, setLoadingSales] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customImage, setCustomImage] = useState('')
  const [postFilter, setPostFilter] = useState<'all' | 'active' | 'sold'>('all')
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true
  })
  const [privacySettings, setPrivacySettings] = useState({
    privateProfile: false,
    showEmail: false,
    showPhone: false
  })

  useEffect(() => {
    fetchProfile()
    fetchMyPosts()
    fetchPurchases()
    fetchSales()
    fetchReviews()
    loadSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = getStoredAuthToken()
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (data.success) {
        setProfile(data.user)
        setEditProfile({
          ...data.user,
          bio: data.user.bio || '',
          location: data.user.location || '',
          phone: data.user.phone || '',
          website: data.user.website || ''
        })
        if (data.user.avatar) {
          setCustomImage(data.user.avatar)
          sessionStorage.setItem('customAvatar', data.user.avatar)
        }
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch profile', error)
    }
  }

  const fetchMyPosts = async () => {
    try {
      const token = getStoredAuthToken()
      if (!token) return

      const res = await fetch('/api/products/user', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (data.success) {
        setMyPosts(data.posts)
      }
    } catch (error) {
      console.error('Failed to fetch posts', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchPurchases = async () => {
    // Mock data for purchases - will be connected to real API later
    try {
      const token = getStoredAuthToken()
      if (!token) {
        setLoadingPurchases(false)
        return
      }

      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get from localStorage
      const savedPurchases = localStorage.getItem('userPurchases')
      if (savedPurchases) {
        setPurchases(JSON.parse(savedPurchases))
      }
    } catch (error) {
      console.error('Failed to fetch purchases', error)
    } finally {
      setLoadingPurchases(false)
    }
  }

  const fetchSales = async () => {
    // Mock data for sales - will be connected to real API later
    try {
      const token = getStoredAuthToken()
      if (!token) {
        setLoadingSales(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const savedSales = localStorage.getItem('userSales')
      if (savedSales) {
        setSales(JSON.parse(savedSales))
      }
    } catch (error) {
      console.error('Failed to fetch sales', error)
    } finally {
      setLoadingSales(false)
    }
  }

  const fetchReviews = async () => {
    // Mock data for reviews - will be connected to real API later
    try {
      const token = getStoredAuthToken()
      if (!token) {
        setLoadingReviews(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const savedReviews = localStorage.getItem('userReviews')
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  const loadSettings = () => {
    const savedNotif = localStorage.getItem('notificationPrefs')
    if (savedNotif) {
      setNotificationPrefs(JSON.parse(savedNotif))
    }
    const savedPrivacy = localStorage.getItem('privacySettings')
    if (savedPrivacy) {
      setPrivacySettings(JSON.parse(savedPrivacy))
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = getStoredAuthToken()
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editProfile.name,
          bio: editProfile.bio,
          location: editProfile.location,
          phone: editProfile.phone,
          website: editProfile.website,
          avatar: customImage
        })
      })

      const data = await res.json()
      if (data.success) {
        setProfile(prev => ({ 
          ...prev, 
          name: editProfile.name, 
          bio: editProfile.bio,
          location: editProfile.location,
          phone: editProfile.phone,
          website: editProfile.website,
          avatar: customImage 
        }))
        sessionStorage.setItem('userName', editProfile.name)
        sessionStorage.setItem('customAvatar', customImage)
        setShowEditModal(false)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to save', error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setCustomImage(result)
      setEditProfile(prev => ({ ...prev, avatar: result }))
    }
    reader.readAsDataURL(file)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this post?')) return
    try {
      const token = getStoredAuthToken()
      const res = await fetch(
        `/api/products/user?postId=${postId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setMyPosts(prev => prev.filter(p => p._id !== postId))
      }
    } catch (error) {
      console.error('Failed to delete post', error)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    router.push('/login')
  }

  const handleSaveNotificationPrefs = () => {
    localStorage.setItem('notificationPrefs', JSON.stringify(notificationPrefs))
  }

  const handleSavePrivacySettings = () => {
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings))
  }

  // Calculate statistics
  const stats = {
    totalPosts: myPosts.length,
    activePosts: myPosts.filter(p => p.status !== 'sold').length,
    soldItems: myPosts.filter(p => p.status === 'sold').length,
    purchases: purchases.length,
    sales: sales.length,
    reviews: reviews.length,
    avgRating: reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0,
    memberSince: profile.createdAt 
      ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'N/A'
  }

  const filteredPosts = postFilter === 'all' 
    ? myPosts 
    : postFilter === 'active' 
      ? myPosts.filter(p => p.status !== 'sold')
      : myPosts.filter(p => p.status === 'sold')

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  return (
    <div className="profile-container" data-theme={theme}>
      {/* Cover Image */}
      <div className="cover-image">
        <div className="cover-overlay"></div>
      </div>

      {/* Header */}
      <div className="profile-header">
        <button onClick={() => router.back()} className="back-btn">
          ← Back
        </button>
        <h1>My Profile</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Profile Header Section */}
      <div className="profile-header-section">
        <div className="profile-header-content">
          {/* Profile Picture */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {customImage || profile.avatar ? (
                <Image
                  src={customImage || profile.avatar}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <label htmlFor="avatar-input" className="change-avatar-btn">
                📷
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="user-info">
            <h2 className="user-name">{profile.name || 'No name set'}</h2>
            <p className="user-email">
              {profile.email}
              {profile.email && <span className="verified-badge">✓ Verified</span>}
            </p>
            <div className="user-location">
              {editProfile.location && (
                <span>📍 {editProfile.location}</span>
              )}
              <span className="join-date">Joined {stats.memberSince}</span>
            </div>
            <div className="user-role">
              <span className={`role-badge ${profile.role}`}>{profile.role}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => setShowEditModal(true)}
              className="action-btn edit-btn"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="action-btn settings-btn"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{formatNumber(stats.totalPosts)}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatNumber(stats.activePosts)}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatNumber(stats.soldItems)}</span>
            <span className="stat-label">Sold</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatNumber(stats.purchases)}</span>
            <span className="stat-label">Bought</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatNumber(stats.reviews)}</span>
            <span className="stat-label">Reviews</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          My Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'bought' ? 'active' : ''}`}
          onClick={() => setActiveTab('bought')}
        >
          Bought
        </button>
        <button
          className={`tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
          onClick={() => setActiveTab('sold')}
        >
          Sold
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              {/* Bio Section */}
              <div className="overview-card bio-card">
                <h3>About Me</h3>
                <p className="bio-text">
                  {editProfile.bio || 'No bio added yet. Click Edit Profile to add one.'}
                </p>
              </div>

              {/* Contact Info */}
              <div className="overview-card contact-card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <div>
                      <span className="contact-label">Email</span>
                      <span className="contact-value">
                        {privacySettings.showEmail ? profile.email : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <div>
                      <span className="contact-label">Phone</span>
                      <span className="contact-value">
                        {privacySettings.showPhone && editProfile.phone 
                          ? editProfile.phone 
                          : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  {editProfile.website && (
                    <div className="contact-item">
                      <span className="contact-icon">🌐</span>
                      <div>
                        <span className="contact-label">Website</span>
                        <span className="contact-value">{editProfile.website}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="overview-card settings-card">
                <h3>Settings</h3>
                
                {/* Theme Toggle */}
                <div className="theme-section">
                  <h4>Appearance</h4>
                  <div className="theme-buttons">
                    <button
                      onClick={() => setTheme('light')}
                      className={theme === 'light' ? 'active' : ''}
                    >
                      ☀️ Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={theme === 'dark' ? 'active' : ''}
                    >
                      🌙 Dark
                    </button>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="settings-section">
                  <h4>Notifications</h4>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.email}
                      onChange={(e) => {
                        setNotificationPrefs(prev => ({ ...prev, email: e.target.checked }))
                        handleSaveNotificationPrefs()
                      }}
                    />
                    <span>Email notifications</span>
                  </label>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.push}
                      onChange={(e) => {
                        setNotificationPrefs(prev => ({ ...prev, push: e.target.checked }))
                        handleSaveNotificationPrefs()
                      }}
                    />
                    <span>Push notifications</span>
                  </label>
                </div>

                {/* Privacy Settings */}
                <div className="settings-section">
                  <h4>Privacy</h4>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => {
                        setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))
                        handleSavePrivacySettings()
                      }}
                    />
                    <span>Show email on profile</span>
                  </label>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) => {
                        setPrivacySettings(prev => ({ ...prev, showPhone: e.target.checked }))
                        handleSavePrivacySettings()
                      }}
                    />
                    <span>Show phone on profile</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="posts-tab">
            <div className="posts-header">
              <h3>My Posts ({filteredPosts.length})</h3>
              <div className="filter-buttons">
                <button
                  className={postFilter === 'all' ? 'active' : ''}
                  onClick={() => setPostFilter('all')}
                >
                  All
                </button>
                <button
                  className={postFilter === 'active' ? 'active' : ''}
                  onClick={() => setPostFilter('active')}
                >
                  Active
                </button>
                <button
                  className={postFilter === 'sold' ? 'active' : ''}
                  onClick={() => setPostFilter('sold')}
                >
                  Sold
                </button>
              </div>
            </div>
            {loadingPosts ? (
              <div className="loading-state">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="empty-state">
                <p>No posts found. Start selling!</p>
                <button onClick={() => router.push('/user-intetface/post-book')} className="create-post-btn">
                  + Create Post
                </button>
              </div>
            ) : (
              <div className="posts-grid">
                {filteredPosts.map(post => (
                  <div key={post._id} className="post-card">
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={200}
                        height={150}
                        className="post-img"
                      />
                    )}
                    <div className="post-info">
                      <h4>{post.title}</h4>
                      <span className="post-type">{post.type}</span>
                      <p className="post-price">${post.price}</p>
                      <p className="post-condition">{post.condition}</p>
                      {post.status === 'sold' && (
                        <span className="sold-badge">Sold</span>
                      )}
                    </div>
                    <div className="post-actions">
                      <button
                        onClick={() => router.push(`/${post._id}`)}
                        className="view-btn"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-post-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bought Tab */}
        {activeTab === 'bought' && (
          <div className="bought-tab">
            <h3>My Purchases</h3>
            {loadingPurchases ? (
              <div className="loading-state">Loading purchases...</div>
            ) : purchases.length === 0 ? (
              <div className="empty-state">
                <p>No purchases yet. Start shopping!</p>
                <button onClick={() => router.push('/user-intetface/home')} className="browse-btn">
                  Browse Items
                </button>
              </div>
            ) : (
              <div className="purchases-list">
                {purchases.map(purchase => (
                  <div key={purchase._id} className="purchase-card">
                    <Image
                      src={purchase.productImage}
                      alt={purchase.productTitle}
                      width={80}
                      height={80}
                      className="purchase-image"
                    />
                    <div className="purchase-info">
                      <h4>{purchase.productTitle}</h4>
                      <p className="purchase-seller">
                        From: {purchase.sellerName}
                      </p>
                      <p className="purchase-date">
                        Purchased: {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="purchase-price">
                      ${purchase.price}
                    </div>
                    <div className="purchase-status">
                      <span className={`status-badge ${purchase.status}`}>
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sold Tab */}
        {activeTab === 'sold' && (
          <div className="sold-tab">
            <h3>My Sales</h3>
            {loadingSales ? (
              <div className="loading-state">Loading sales...</div>
            ) : sales.length === 0 ? (
              <div className="empty-state">
                <p>No sales yet. Keep posting items!</p>
                <button onClick={() => router.push('/user-intetface/post-book')} className="post-btn">
                  Create Post
                </button>
              </div>
            ) : (
              <div className="sales-list">
                {sales.map(sale => (
                  <div key={sale._id} className="sale-card">
                    <Image
                      src={sale.productImage}
                      alt={sale.productTitle}
                      width={80}
                      height={80}
                      className="sale-image"
                    />
                    <div className="sale-info">
                      <h4>{sale.productTitle}</h4>
                      <p className="sale-buyer">
                        To: {sale.buyerName}
                      </p>
                      <p className="sale-date">
                        Sold: {new Date(sale.soldAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="sale-price">
                      ${sale.price}
                    </div>
                    <div className="sale-status">
                      <span className={`status-badge ${sale.status}`}>
                        {sale.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <h3>Reviews ({reviews.length})</h3>
            {loadingReviews ? (
              <div className="loading-state">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <p>No reviews yet. Complete more transactions to get reviewed!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        {review.reviewerAvatar ? (
                          <Image
                            src={review.reviewerAvatar}
                            alt={review.reviewerName}
                            width={48}
                            height={48}
                            className="reviewer-avatar"
                          />
                        ) : (
                          <div className="reviewer-avatar-placeholder">
                            {review.reviewerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4>{review.reviewerName}</h4>
                          <p className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="review-rating">
                        <span className="stars">{renderStars(review.rating)}</span>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    {review.forItem && (
                      <p className="review-item">For: {review.forItem}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="modal-close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="avatar-upload-area">
                  {customImage || editProfile.avatar ? (
                    <Image
                      src={customImage || editProfile.avatar}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="avatar-preview-img"
                    />
                  ) : (
                    <div className="avatar-preview-placeholder">
                      {editProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <label htmlFor="modal-avatar-input" className="upload-btn">
                    Change Photo
                  </label>
                  <input
                    id="modal-avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={e => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  value={profile.email}
                  disabled
                  className="form-input disabled"
                />
                <span className="form-hint">Email cannot be changed</span>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editProfile.bio || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                  rows={4}
                />
                <span className="form-hint">{(editProfile.bio || '').length}/500 characters</span>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editProfile.location || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="form-input"
                  placeholder="City, Country"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editProfile.phone || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                  placeholder="+855 XX XXX XXX"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={editProfile.website || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, website: e.target.value }))}
                  className="form-input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="save-btn"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}