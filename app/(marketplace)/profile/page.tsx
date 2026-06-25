'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from '../../contexts/ThemeContext'
import './profile.css'

interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  createdAt?: string
}

interface Post {
  _id: string
  title: string
  type: string
  price: number
  imageUrl: string
  condition: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: '',
    role: ''
  })
  const [editName, setEditName] = useState('')
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customImage, setCustomImage] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchMyPosts()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
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
        setEditName(data.user.name)
        if (data.user.avatar) {
          setCustomImage(data.user.avatar)
          localStorage.setItem('customAvatar', data.user.avatar)
        }
      } else {
        // Token invalid - go to login
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch profile', error)
    }
  }

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch('/api/posts/user', {
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

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          avatar: customImage
        })
      })

      const data = await res.json()
      if (data.success) {
        setProfile(prev => ({ ...prev, name: editName, avatar: customImage }))
        localStorage.setItem('userName', editName)
        localStorage.setItem('customAvatar', customImage)
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
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setCustomImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this post?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `/api/posts/user?postId=${postId}`,
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
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="profile-container" data-theme={theme}>
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

      {/* Avatar Section */}
      <div className="avatar-section">
        <div className="avatar-wrapper">
          {customImage || profile.avatar ? (
            <Image
              src={customImage || profile.avatar}
              alt="Profile"
              width={100}
              height={100}
              className="avatar-img"
            />
          ) : (
            <div className="avatar-placeholder">
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="avatar-upload">
            <label htmlFor="avatar-input" className="upload-label">
              Change Photo
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="edit-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="edit-input disabled"
              />
            </div>
            <div className="edit-buttons">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="save-btn"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="info-display">
            <h2>{profile.name || 'No name set'}</h2>
            <p>{profile.email}</p>
            <span className="role-badge">{profile.role}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="theme-section">
        <h3>Appearance</h3>
        <div className="theme-buttons">
          <button
            onClick={() => setTheme('light')}
            className={theme === 'light' ? 'active' : ''}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={theme === 'dark' ? 'active' : ''}
          >
            Dark
          </button>
        </div>
      </div>

      {/* My Posts */}
      <div className="my-posts-section">
        <h3>My Posts ({myPosts.length})</h3>
        {loadingPosts ? (
          <p>Loading...</p>
        ) : myPosts.length === 0 ? (
          <p>No posts yet. Start selling!</p>
        ) : (
          <div className="posts-grid">
            {myPosts.map(post => (
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
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="delete-post-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}