'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './profile.css';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  customAvatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: 'default'
  });
  const [editName, setEditName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customImage, setCustomImage] = useState<string>('');

  // Mock user data - in real app, this would come from authentication
  useEffect(() => {
    // Get user email from localStorage or auth context
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const defaultName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);
    const savedCustomAvatar = localStorage.getItem('customAvatar');
    
    setProfile({
      name: defaultName,
      email: userEmail,
      avatar: 'default',
      customAvatar: savedCustomAvatar || ''
    });
    setEditName(defaultName);
    setCustomImage(savedCustomAvatar || '');
  }, []);

  // Listen for email changes and update profile automatically
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        const newEmail = e.newValue || 'user@example.com';
        const defaultName = newEmail.split('@')[0].charAt(0).toUpperCase() + newEmail.split('@')[0].slice(1);
        
        setProfile(prev => ({
          ...prev,
          name: defaultName,
          email: newEmail
          // Keep customAvatar unchanged - it persists across email changes
        }));
        setEditName(defaultName);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for email changes periodically (for same-tab updates)
  useEffect(() => {
    const checkEmailChange = () => {
      const currentEmail = localStorage.getItem('userEmail');
      if (currentEmail && currentEmail !== profile.email) {
        const defaultName = currentEmail.split('@')[0].charAt(0).toUpperCase() + currentEmail.split('@')[0].slice(1);
        
        setProfile(prev => ({
          ...prev,
          name: defaultName,
          email: currentEmail
          // Keep customAvatar unchanged - it persists across email changes
        }));
        setEditName(defaultName);
      }
    };

    const interval = setInterval(checkEmailChange, 1000);
    return () => clearInterval(interval);
  }, [profile.email]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditName(profile.name);
    setSelectedAvatar(profile.avatar);
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      name: editName,
      avatar: selectedAvatar || profile.avatar,
      customAvatar: customImage
    };
    setProfile(updatedProfile);
    
    // Save custom avatar to localStorage
    if (customImage) {
      localStorage.setItem('customAvatar', customImage);
    }
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(profile.name);
    setSelectedAvatar(profile.avatar);
    setCustomImage(profile.customAvatar || '');
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setCustomImage(''); // Clear custom image when selecting preset avatar
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomImage(result);
        setSelectedAvatar(''); // Clear preset avatar when uploading custom image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('customAvatar');
    router.push('/login');
  };

  // Simulate email change for testing
  const simulateEmailChange = () => {
    const testEmails = [
      'alice@example.com',
      'bob@test.com',
      'charlie@domain.com',
      'david@email.com'
    ];
    const currentEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const currentIndex = testEmails.indexOf(currentEmail);
    const nextIndex = (currentIndex + 1) % testEmails.length;
    const newEmail = testEmails[nextIndex];
    
    localStorage.setItem('userEmail', newEmail);
    
    // Trigger immediate update but preserve custom avatar
    const defaultName = newEmail.split('@')[0].charAt(0).toUpperCase() + newEmail.split('@')[0].slice(1);
    setProfile(prev => ({
      ...prev,
      name: defaultName,
      email: newEmail
      // customAvatar remains unchanged - persists across email changes
    }));
    setEditName(defaultName);
  };

  const avatarOptions = [
    'default',
    'avatar-1',
    'avatar-2',
    'avatar-3',
    'avatar-4',
    'avatar-5',
    'avatar-6',
    'avatar-7',
    'avatar-8'
  ];

  return (
    <div className="profile-container">
      {/* Navigation Header */}
      <header className="profile-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          <h1>Profile</h1>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="fa fa-sign-out"></i>
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="profile-main">
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-container">
              {profile.customAvatar ? (
                <Image
                  src={profile.customAvatar}
                  alt="Profile Avatar"
                  className="profile-avatar custom-image"
                  width={120}
                  height={120}
                />
              ) : (
                <div className={`profile-avatar avatar-${profile.avatar}`}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="change-avatar-btn"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    aria-label="Change avatar"
                  >
                    <i className="fa fa-camera"></i>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            {!isEditing ? (
              <>
                <div className="info-item">
                  <label>Name</label>
                  <p className="info-value">{profile.name}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p className="info-value">{profile.email}</p>
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={handleEditProfile}
                >
                  <i className="fa fa-edit"></i>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="info-item">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="edit-input"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p className="info-value email-readonly">{profile.email}</p>
                  <small className="email-note">Email cannot be changed</small>
                </div>
                
                {/* Avatar Selection */}
                <div className="avatar-selection">
                  <label>Choose Avatar</label>
                  <div className="avatar-grid">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        className={`avatar-option ${selectedAvatar === avatar && !customImage ? 'selected' : ''}`}
                        onClick={() => handleAvatarSelect(avatar)}
                      >
                        <div className={`avatar-preview avatar-${avatar}`}>
                          {profile.name.charAt(0).toUpperCase()}
                        </div>
                      </button>
                    ))}
                    <button
                      className={`avatar-option ${customImage ? 'selected' : ''}`}
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <div className="avatar-preview upload-option">
                        <i className="fa fa-upload"></i>
                      </div>
                    </button>
                  </div>
                  {customImage && (
                    <div className="custom-image-preview">
                      <span>Custom image selected</span>
                      <button 
                        className="remove-custom-btn"
                        onClick={() => {
                          setCustomImage('');
                          setSelectedAvatar('default');
                        }}
                      >
                        <i className="fa fa-times"></i>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSaveProfile}
                  >
                    <i className="fa fa-check"></i>
                    Save Changes
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                  >
                    <i className="fa fa-times"></i>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-card">
            <h3>Account Information</h3>
            <div className="info-row">
              <span>Member Since</span>
              <span>January 2024</span>
            </div>
            <div className="info-row">
              <span>Total Posts</span>
              <span>12</span>
            </div>
            <div className="info-row">
              <span>Account Status</span>
              <span className="status-active">Active</span>
            </div>
            {/* Test button for email change simulation */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                className="test-email-btn"
                onClick={simulateEmailChange}
                title="Click to test email change functionality"
              >
                <i className="fa fa-sync"></i>
                Test Email Change
              </button>
              <small style={{ display: 'block', marginTop: '8px', color: '#666', fontSize: '12px' }}>
                Custom avatar persists across email changes. New users see first letter by default.
              </small>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
