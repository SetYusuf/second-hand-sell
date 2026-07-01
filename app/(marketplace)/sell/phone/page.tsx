'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './pphone.css';

// Phone brands
const PHONE_BRANDS = [
  { value: '', label: 'Select a brand' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Samsung', label: 'Samsung' },
  { value: 'Google Pixel', label: 'Google Pixel' },
  { value: 'Xiaomi', label: 'Xiaomi' },
  { value: 'Oppo', label: 'Oppo' },
  { value: 'Vivo', label: 'Vivo' },
  { value: 'OnePlus', label: 'OnePlus' },
  { value: 'Realme', label: 'Realme' },
  { value: 'Huawei', label: 'Huawei' },
  { value: 'Other', label: 'Other' },
];

// Storage options
const STORAGE_OPTIONS = [
  { value: '', label: 'Select storage' },
  { value: '64GB', label: '64GB' },
  { value: '128GB', label: '128GB' },
  { value: '256GB', label: '256GB' },
  { value: '512GB', label: '512GB' },
  { value: '1TB', label: '1TB' },
];

// RAM options
const RAM_OPTIONS = [
  { value: '', label: 'Select RAM' },
  { value: '4GB', label: '4GB' },
  { value: '6GB', label: '6GB' },
  { value: '8GB', label: '8GB' },
  { value: '12GB', label: '12GB' },
  { value: '16GB', label: '16GB' },
];

// Condition options
const CONDITION_OPTIONS = [
  { value: '', label: 'Select condition' },
  { value: 'Like New', label: 'Like New (No scratches/damage)' },
  { value: 'Excellent', label: 'Excellent (Minimal wear)' },
  { value: 'Good', label: 'Good (Some scratches)' },
  { value: 'Fair', label: 'Fair (Visible damage)' },
  { value: 'Poor', label: 'Poor (Major damage)' },
];

// Location options
const LOCATION_OPTIONS = [
  { value: '', label: 'Select location' },
  { value: 'Phnom Penh', label: 'Phnom Penh' },
  { value: 'Siem Reap', label: 'Siem Reap' },
  { value: 'Battambang', label: 'Battambang' },
  { value: 'Kandal', label: 'Kandal' },
  { value: 'Other', label: 'Other' },
];

// Features checkboxes
const FEATURES_OPTIONS = [
  { id: 'originalBox', label: 'Original Box' },
  { id: 'originalCharger', label: 'Original Charger' },
  { id: 'originalCable', label: 'Original Cable' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'screenProtector', label: 'Screen Protector' },
  { id: 'case', label: 'Case' },
];

// Issues checkboxes
const ISSUES_OPTIONS = [
  { id: 'noIssues', label: 'No issues' },
  { id: 'crackedScreen', label: 'Cracked screen (but working)' },
  { id: 'batteryIssues', label: 'Battery issues' },
  { id: 'speakerIssues', label: 'Speaker issues' },
  { id: 'cameraIssues', label: 'Camera issues' },
  { id: 'other', label: 'Other' },
];

interface FormErrors {
  [key: string]: string;
}

export default function PostPhonePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    storage: '',
    ram: '',
    color: '',
    condition: '',
    batteryHealth: '',
    features: [] as string[],
    issues: [] as string[],
    otherIssue: '',
    price: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    email: '',
    allowNegotiation: false,
    shippingAvailable: false,
    shippingCost: '',
  });

  // Image state
  const [images, setImages] = useState<{ file: File; preview: string; isMain: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        }));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  // Update character count
  useEffect(() => {
    setCharCount(formData.description.length);
  }, [formData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof formData] }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (type: 'features' | 'issues', id: string) => {
    setFormData(prev => {
      const current = prev[type];
      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    const newImages: { file: File; preview: string; isMain: boolean }[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: 'Invalid file type. Use JPG, PNG, WebP, or GIF' }));
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'File size too large (max 5MB per image)' }));
        continue;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        isMain: images.length + newImages.length === 0,
      });
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index,
    })));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageSelect(event);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.brand) {
      newErrors.brand = 'Please select a brand';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.storage) {
      newErrors.storage = 'Please select storage capacity';
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select a condition';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (images.length === 0) {
      newErrors.images = 'Please add at least one photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const uploadForm = new FormData();
    uploadForm.append('image', file);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: uploadForm,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload image');
    }

    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      // Upload all images
      const imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadImage(img.file);
        imageUrls.push(url);
      }

      // Get user data
      const token = getStoredAuthToken();
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userId = user._id || user.id || getStoredUserId() || 'anonymous';

      if (!token) {
        setErrors({ submit: 'You must be logged in to post. Please login first.' });
        setSubmitting(false);
        setUploading(false);
        return;
      }

      // Prepare post data
      const postData = {
        title: formData.title,
        type: 'Phone',
        brand: formData.brand,
        specs: `${formData.model} | ${formData.storage} | ${formData.ram || 'N/A'} | ${formData.color || 'N/A'}`,
        condition: formData.condition,
        price: parseFloat(formData.price),
        description: formData.description + (formData.batteryHealth ? `\n\nBattery Health: ${formData.batteryHealth}%` : ''),
        location: formData.location,
        contactName: formData.name,
        contactPhone: formData.phone,
        contactEmail: formData.email,
        imageUrl: imageUrls[0] || '',
        images: imageUrls,
        userId,
        additionalDetails: {
          model: formData.model,
          storage: formData.storage,
          ram: formData.ram,
          color: formData.color,
          batteryHealth: formData.batteryHealth ? parseInt(formData.batteryHealth) : undefined,
          features: formData.features,
          issues: formData.issues,
          otherIssue: formData.otherIssue,
          allowNegotiation: formData.allowNegotiation,
          shippingAvailable: formData.shippingAvailable,
          shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : undefined,
        },
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to post item');
      }

      setSuccess(true);

      // Clear form
      setFormData({
        title: '', brand: '', model: '', storage: '', ram: '',
        color: '', condition: '', batteryHealth: '', features: [],
        issues: [], otherIssue: '', price: '', description: '',
        location: '', name: '', phone: '', email: '',
        allowNegotiation: false, shippingAvailable: false, shippingCost: '',
      });
      setImages([]);

    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="post-page">
        <header className="post-header">
          <button
            type="button"
            className="back-arrow"
            onClick={() => router.push('/user-intetface/home')}
            aria-label="Back to home"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="brand-badge">
            <span className="brand-icon">📱</span>
            <span className="brand-name">Post Phone</span>
          </div>
        </header>

        <main className="post-content">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h3>Phone listed successfully!</h3>
              <p>Your phone listing is now live and visible to buyers.</p>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/home')}>
              View Marketplace
            </button>
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/profile')}>
              My Listings
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSuccess(false);
                setFormData({
                  title: '', brand: '', model: '', storage: '', ram: '',
                  color: '', condition: '', batteryHealth: '', features: [],
                  issues: [], otherIssue: '', price: '', description: '',
                  location: '', name: '', phone: '', email: '',
                  allowNegotiation: false, shippingAvailable: false, shippingCost: '',
                });
                setImages([]);
              }}
            >
              Post Another Item
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="post-page">
      <header className="post-header">
        <button
          type="button"
          className="back-arrow"
          onClick={() => router.push('/user-intetface/home')}
          aria-label="Back to home"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/phone.png" alt="Phone" width={24} height={24} />
          </span>
          <span className="brand-name">Post Phone</span>
        </div>
      </header>

      <main className="post-content">
        {errors.submit && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errors.submit}</span>
          </div>
        )}

        <form className="post-form" onSubmit={handleSubmit}>
          {/* Section 1: Photos */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📷</div>
              <div>
                <h2 className="section-title">Photos</h2>
                <p className="section-subtitle">Add clear photos of your phone (max 5)</p>
              </div>
            </div>

            <div
              className={`photo-upload-area ${images.length > 0 ? 'has-images' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload photos"
            >
              {images.length === 0 ? (
                <>
                  <div className="upload-icon">+</div>
                  <div className="upload-text">
                    <strong>Click to upload</strong> or drag and drop
                  </div>
                  <div className="upload-hint">JPG, PNG, WebP or GIF (max 5MB each)</div>
                </>
              ) : (
                <div className="image-preview-grid">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="image-preview-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImage(index);
                      }}
                    >
                      <Image src={img.preview} alt={`Preview ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                      {img.isMain && <span className="main-badge">Main</span>}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="image-preview-item" style={{ borderStyle: 'dashed', borderColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <span style={{ fontSize: '2rem', color: '#a0aec0' }}>+</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImageSelect}
            />

            {errors.images && <div className="error-message">{errors.images}</div>}
          </section>

          {/* Section 2: Phone Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📱</div>
              <div>
                <h2 className="section-title">Phone Details</h2>
                <p className="section-subtitle">Provide accurate information about your phone</p>
              </div>
            </div>

            <div className="form-group">
              <label>
                Phone Title <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., iPhone 14 Pro Max 256GB"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Brand <span className="required-mark">*</span>
                </label>
                <select name="brand" value={formData.brand} onChange={handleChange}>
                  {PHONE_BRANDS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.brand && <div className="error-message">{errors.brand}</div>}
              </div>

              <div className="form-group">
                <label>
                  Model <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g., iPhone 14 Pro Max"
                  value={formData.model}
                  onChange={handleChange}
                />
                {errors.model && <div className="error-message">{errors.model}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Storage <span className="required-mark">*</span>
                </label>
                <select name="storage" value={formData.storage} onChange={handleChange}>
                  {STORAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.storage && <div className="error-message">{errors.storage}</div>}
              </div>

              <div className="form-group">
                <label>RAM (optional)</label>
                <select name="ram" value={formData.ram} onChange={handleChange}>
                  {RAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Color (optional)</label>
                <input
                  type="text"
                  name="color"
                  placeholder="e.g., Space Black, Gold"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Battery Health (optional)</label>
                <input
                  type="number"
                  name="batteryHealth"
                  placeholder="50-100"
                  min="0"
                  max="100"
                  value={formData.batteryHealth}
                  onChange={handleChange}
                />
                <span className="help-text">Enter percentage (e.g., 85)</span>
              </div>
            </div>

            <div className="form-group">
              <label>
                Condition <span className="required-mark">*</span>
              </label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.condition && <div className="error-message">{errors.condition}</div>}
            </div>

            <div className="form-group">
              <label>Features Included</label>
              <div className="checkbox-group">
                {FEATURES_OPTIONS.map((feature) => (
                  <label key={feature.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature.id)}
                      onChange={() => handleCheckboxChange('features', feature.id)}
                    />
                    <span className="checkmark"></span>
                    <span>{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Any Issues?</label>
              <div className="checkbox-group">
                {ISSUES_OPTIONS.map((issue) => (
                  <label key={issue.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.issues.includes(issue.id)}
                      onChange={() => handleCheckboxChange('issues', issue.id)}
                    />
                    <span className="checkmark"></span>
                    <span>{issue.label}</span>
                  </label>
                ))}
              </div>
              {formData.issues.includes('other') && (
                <input
                  type="text"
                  name="otherIssue"
                  placeholder="Please specify the issue..."
                  value={formData.otherIssue}
                  onChange={handleChange}
                  style={{ marginTop: '12px' }}
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Price (USD) <span className="required-mark">*</span>
                </label>
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>

              <div className="form-group">
                <label>
                  Location <span className="required-mark">*</span>
                </label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  {LOCATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.location && <div className="error-message">{errors.location}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>
                Description <span className="required-mark">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the phone's condition, any defects, warranty status, etc."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
              />
              <span
                className={`char-counter ${charCount > 900 ? 'warning' : ''} ${charCount > 1000 ? 'error' : ''}`}
              >
                {charCount}/1000 characters
              </span>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
          </section>

          {/* Section 3: Contact Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">👤</div>
              <div>
                <h2 className="section-title">Contact Details</h2>
                <p className="section-subtitle">How buyers can reach you</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Your Name <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label>
                  Phone Number <span className="required-mark">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="012 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>
                Email <span className="required-mark">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </section>

          {/* Section 4: Additional Settings */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <div>
                <h2 className="section-title">Additional Settings</h2>
                <p className="section-subtitle">Optional preferences for your listing</p>
              </div>
            </div>

            <div className="toggle-group">
              <div className="toggle-label">
                <span>Allow Negotiation</span>
                <span>Buyers can make offers</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.allowNegotiation}
                  onChange={() => handleToggle('allowNegotiation')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group" style={{ borderBottom: 'none' }}>
              <div className="toggle-label">
                <span>Shipping Available</span>
                <span>Willing to ship to buyers</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.shippingAvailable}
                  onChange={() => handleToggle('shippingAvailable')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {formData.shippingAvailable && (
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Shipping Cost ($)</label>
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    name="shippingCost"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Section 5: Submit Buttons */}
          <div className="button-group">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
              {submitting || uploading ? (
                <>
                  <span className="spinner"></span>
                  {uploading ? 'Uploading...' : 'Posting...'}
                </>
              ) : (
                'Post Phone'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}