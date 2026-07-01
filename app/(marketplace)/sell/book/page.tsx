'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './pbook.css';

// Book categories
const BOOK_CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'Fiction', label: 'Fiction' },
  { value: 'Non-Fiction', label: 'Non-Fiction' },
  { value: 'History', label: 'History' },
  { value: 'Science', label: 'Science' },
  { value: 'Business', label: 'Business' },
  { value: 'Self-Help', label: 'Self-Help' },
  { value: 'Children', label: 'Children' },
  { value: 'Textbook', label: 'Textbook' },
  { value: 'Biography', label: 'Biography' },
  { value: 'Other', label: 'Other' },
];

// Condition options
const CONDITION_OPTIONS = [
  { value: '', label: 'Select condition' },
  { value: 'Like New', label: 'Like New (Never read)' },
  { value: 'Very Good', label: 'Very Good (Minimal wear)' },
  { value: 'Good', label: 'Good (Some wear, readable)' },
  { value: 'Fair', label: 'Fair (Heavy wear, still readable)' },
  { value: 'Poor', label: 'Poor (Damaged but functional)' },
];

// Language options
const LANGUAGE_OPTIONS = [
  { value: '', label: 'Select language' },
  { value: 'English', label: 'English' },
  { value: 'Khmer', label: 'Khmer' },
  { value: 'Other', label: 'Other' },
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

interface FormErrors {
  [key: string]: string;
}

export default function PostBookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    condition: '',
    edition: '',
    pages: '',
    language: '',
    price: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    email: '',
    allowNegotiation: false,
    shippingAvailable: false,
    shippingCost: '',
    autoRenew: false,
  });

  // Image state
  const [images, setImages] = useState<{ file: File; preview: string; isMain: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [postedPostId, setPostedPostId] = useState('');
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

    // Load saved draft from localStorage
    const savedDraft = localStorage.getItem('bookDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draft }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const { name, email, phone, ...draftData } = formData;
    localStorage.setItem('bookDraft', JSON.stringify(draftData));
  }, [formData]);

  // Update character count
  useEffect(() => {
    setCharCount(formData.description.length);
  }, [formData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
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

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: 'Invalid file type. Use JPG, PNG, WebP, or GIF' }));
        continue;
      }

      // Validate file size (5MB max)
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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the main image, set the first one as main
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  // Set main image
  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index,
    })));
  };

  // Handle drag and drop
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

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select a condition';
    }

    if (!formData.language) {
      newErrors.language = 'Please select a language';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
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

  // Upload image
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

  // Submit form
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
        type: 'Book',
        brand: formData.author,
        specs: `${formData.category} | ${formData.edition || 'N/A'} | ${formData.pages || 'N/A'} pages`,
        condition: formData.condition,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        contactName: formData.name,
        contactPhone: formData.phone,
        contactEmail: formData.email,
        imageUrl: imageUrls[0] || '',
        images: imageUrls,
        userId,
        additionalDetails: {
          language: formData.language,
          edition: formData.edition,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          allowNegotiation: formData.allowNegotiation,
          shippingAvailable: formData.shippingAvailable,
          shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : undefined,
          autoRenew: formData.autoRenew,
        },
      };

      // Submit to API
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

      // Success!
      setSuccess(true);
      setPostedPostId(result.post?._id || result.post?.id || '');

      // Clear form and draft
      setFormData({
        title: '',
        author: '',
        category: '',
        condition: '',
        edition: '',
        pages: '',
        language: '',
        price: '',
        description: '',
        location: '',
        name: '',
        phone: '',
        email: '',
        allowNegotiation: false,
        shippingAvailable: false,
        shippingCost: '',
        autoRenew: false,
      });
      setImages([]);
      localStorage.removeItem('bookDraft');

    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  // If success, show success message
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
            <span className="brand-icon">📚</span>
            <span className="brand-name">Post Book</span>
          </div>
        </header>

        <main className="post-content">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h3>Item posted successfully!</h3>
              <p>Your book listing is now live and visible to buyers.</p>
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
                  title: '', author: '', category: '', condition: '', edition: '',
                  pages: '', language: '', price: '', description: '', location: '',
                  name: '', phone: '', email: '', allowNegotiation: false,
                  shippingAvailable: false, shippingCost: '', autoRenew: false,
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
            <Image src="/home/book.png" alt="Book" width={24} height={24} />
          </span>
          <span className="brand-name">Post Book</span>
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
                <p className="section-subtitle">Add clear photos to get more responses (max 5)</p>
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

          {/* Section 2: Book Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📖</div>
              <div>
                <h2 className="section-title">Book Details</h2>
                <p className="section-subtitle">Provide accurate information about your book</p>
              </div>
            </div>

            <div className="form-group">
              <label>
                Book Title <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., The Great Gatsby"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              <span className="help-text">Be specific with title and author for better visibility</span>
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label>
                Author Name <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="author"
                placeholder="e.g., F. Scott Fitzgerald"
                value={formData.author}
                onChange={handleChange}
              />
              {errors.author && <div className="error-message">{errors.author}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Category/Genre <span className="required-mark">*</span>
                </label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {BOOK_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Edition/Year (optional)</label>
                <input
                  type="text"
                  name="edition"
                  placeholder="e.g., 1st Edition, 2010"
                  value={formData.edition}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Number of Pages (optional)</label>
                <input
                  type="number"
                  name="pages"
                  placeholder="e.g., 346"
                  value={formData.pages}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Language <span className="required-mark">*</span>
                </label>
                <select name="language" value={formData.language} onChange={handleChange}>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.language && <div className="error-message">{errors.language}</div>}
              </div>

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
            </div>

            <div className="form-group">
              <label>
                Description <span className="required-mark">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the book condition, any marks, damage, or special features..."
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

            <div className="toggle-group">
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

            <div className="toggle-group" style={{ borderBottom: 'none' }}>
              <div className="toggle-label">
                <span>Auto-renew Listing</span>
                <span>Automatically renew after 30 days</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={() => handleToggle('autoRenew')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
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
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                localStorage.setItem('bookDraft', JSON.stringify(formData));
                alert('Draft saved!');
              }}
            >
              Save Draft
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
              {submitting || uploading ? (
                <>
                  <span className="spinner"></span>
                  {uploading ? 'Uploading...' : 'Posting...'}
                </>
              ) : (
                'Post Book'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}