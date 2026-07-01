'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './pelectronics.css';

const ELECTRONICS_CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'Audio', label: 'Audio (Headphones, Speakers)' },
  { value: 'Camera', label: 'Camera (Digital Cameras)' },
  { value: 'Gaming', label: 'Gaming (Consoles, Accessories)' },
  { value: 'Wearables', label: 'Wearables (Smartwatch, Fitness)' },
  { value: 'Smart Home', label: 'Smart Home' },
  { value: 'Home Appliances', label: 'Home Appliances' },
  { value: 'Power Tools', label: 'Power Tools' },
  { value: 'Other', label: 'Other' },
];

const CONDITION_OPTIONS = [
  { value: '', label: 'Select condition' },
  { value: 'Like New', label: 'Like New' },
  { value: 'Excellent', label: 'Excellent (Minimal wear)' },
  { value: 'Good', label: 'Good (Some wear)' },
  { value: 'Fair', label: 'Fair (Visible wear)' },
  { value: 'Poor', label: 'Poor (Major wear)' },
];

const LOCATION_OPTIONS = [
  { value: '', label: 'Select location' },
  { value: 'Phnom Penh', label: 'Phnom Penh' },
  { value: 'Siem Reap', label: 'Siem Reap' },
  { value: 'Battambang', label: 'Battambang' },
  { value: 'Kandal', label: 'Kandal' },
  { value: 'Other', label: 'Other' },
];

const FEATURES_OPTIONS = [
  { id: 'originalBox', label: 'Original Box' },
  { id: 'originalAccessories', label: 'Original Accessories' },
  { id: 'warrantyCard', label: 'Warranty Card' },
  { id: 'instructionManual', label: 'Instruction Manual' },
];

interface FormErrors { [key: string]: string; }

export default function PostElectronicsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', category: '', brand: '', model: '', condition: '',
    features: [] as string[], defects: '', yearPurchased: '',
    price: '', description: '', location: '', name: '', phone: '', email: '',
    allowNegotiation: false, shippingAvailable: false, shippingCost: '',
  });

  const [images, setImages] = useState<{ file: File; preview: string; isMain: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '' }));
      } catch (e) { console.error('Failed to parse user data:', e); }
    }
  }, []);

  useEffect(() => { setCharCount(formData.description.length); }, [formData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => { const n = { ...prev }; delete n[name]; return n; }); }
  };

  const handleToggle = (name: string) => { setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof formData] })); };

  const handleCheckboxChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(id) ? prev.features.filter(f => f !== id) : [...prev.features, id],
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) { setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' })); return; }
    const newImages: { file: File; preview: string; isMain: boolean }[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) { setErrors(prev => ({ ...prev, images: 'Invalid file type' })); continue; }
      if (file.size > 5 * 1024 * 1024) { setErrors(prev => ({ ...prev, images: 'File too large (max 5MB)' })); continue; }
      newImages.push({ file, preview: URL.createObjectURL(file), isMain: images.length + newImages.length === 0 });
    }
    if (newImages.length > 0) { setImages(prev => [...prev, ...newImages]); setErrors(prev => { const n = { ...prev }; delete n.images; return n; }); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => { const n = prev.filter((_, i) => i !== index); if (n.length > 0 && !n.some(img => img.isMain)) n[0].isMain = true; return n; });
  };

  const setMainImage = (index: number) => { setImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index }))); };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageSelect({ target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim() || formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.condition) newErrors.condition = 'Please select a condition';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim() || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.name.trim()) newErrors.name = 'Your name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (images.length === 0) newErrors.images = 'Please add at least one photo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData(); form.append('image', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: form });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Failed to upload');
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSubmitting(true); setUploading(true);
    try {
      const imageUrls: string[] = [];
      for (const img of images) { imageUrls.push(await uploadImage(img.file)); }
      const token = getStoredAuthToken();
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userId = user._id || user.id || getStoredUserId() || 'anonymous';
      if (!token) { setErrors({ submit: 'You must be logged in to post.' }); setSubmitting(false); setUploading(false); return; }
      const postData = {
        title: formData.title, type: 'Electronics', brand: formData.brand,
        specs: `${formData.category} | ${formData.model}`,
        condition: formData.condition, price: parseFloat(formData.price),
        description: formData.description + (formData.defects ? `\n\nDefects: ${formData.defects}` : ''),
        location: formData.location, contactName: formData.name, contactPhone: formData.phone, contactEmail: formData.email,
        imageUrl: imageUrls[0] || '', images: imageUrls, userId,
        additionalDetails: {
          category: formData.category, model: formData.model, features: formData.features,
          defects: formData.defects, yearPurchased: formData.yearPurchased,
          allowNegotiation: formData.allowNegotiation, shippingAvailable: formData.shippingAvailable,
          shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : undefined,
        },
      };
      const response = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(postData) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to post');
      setSuccess(true);
      setFormData({ title: '', category: '', brand: '', model: '', condition: '', features: [], defects: '', yearPurchased: '', price: '', description: '', location: '', name: '', phone: '', email: '', allowNegotiation: false, shippingAvailable: false, shippingCost: '' });
      setImages([]);
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred.' });
    } finally { setSubmitting(false); setUploading(false); }
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
            <span className="brand-icon">🔌</span>
            <span className="brand-name">Post Electronics</span>
          </div>
        </header>
        <main className="post-content">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-content"><h3>Electronics listed successfully!</h3><p>Your listing is now live and visible to buyers.</p></div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/home')}>View Marketplace</button>
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/profile')}>My Listings</button>
            <button className="btn btn-primary" onClick={() => { setSuccess(false); setFormData({ title: '', category: '', brand: '', model: '', condition: '', features: [], defects: '', yearPurchased: '', price: '', description: '', location: '', name: '', phone: '', email: '', allowNegotiation: false, shippingAvailable: false, shippingCost: '' }); setImages([]); }}>Post Another Item</button>
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
          <span className="brand-icon"><Image src="/home/electronics.png" alt="Electronics" width={24} height={24} /></span>
          <span className="brand-name">Post Electronics</span>
        </div>
      </header>
      <main className="post-content">
        {errors.submit && <div className="error-alert"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.submit}</span></div>}
        <form className="post-form" onSubmit={handleSubmit}>
          {/* Photos */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📷</div>
              <div><h2 className="section-title">Photos</h2><p className="section-subtitle">Add clear photos (max 5)</p></div>
            </div>
            <div className={`photo-upload-area ${images.length > 0 ? 'has-images' : ''}`} onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDrop={handleDrop} role="button" tabIndex={0} aria-label="Upload photos">
              {images.length === 0 ? (<><div className="upload-icon">+</div><div className="upload-text"><strong>Click to upload</strong> or drag and drop</div><div className="upload-hint">JPG, PNG, WebP or GIF (max 5MB each)</div></>) : (
                <div className="image-preview-grid">
                  {images.map((img, index) => (<div key={index} className="image-preview-item" onClick={(e) => { e.stopPropagation(); setMainImage(index); }}><Image src={img.preview} alt={`Preview ${index + 1}`} fill style={{ objectFit: 'cover' }} />{img.isMain && <span className="main-badge">Main</span>}<button type="button" className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(index); }} aria-label="Remove image">✕</button></div>))}
                  {images.length < 5 && <div className="image-preview-item" style={{ borderStyle: 'dashed', borderColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><span style={{ fontSize: '2rem', color: '#a0aec0' }}>+</span></div>}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleImageSelect} />
            {errors.images && <div className="error-message">{errors.images}</div>}
          </section>

          {/* Electronics Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">🔌</div>
              <div><h2 className="section-title">Electronics Details</h2><p className="section-subtitle">Provide accurate information</p></div>
            </div>
            <div className="form-group">
              <label>Item Title <span className="required-mark">*</span></label>
              <input type="text" name="title" placeholder="e.g., Sony WH-1000XM5 Headphones" value={formData.title} onChange={handleChange} maxLength={100} />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required-mark">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {ELECTRONICS_CATEGORIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>
              <div className="form-group">
                <label>Brand <span className="required-mark">*</span></label>
                <input type="text" name="brand" placeholder="e.g., Sony, Canon, Nintendo" value={formData.brand} onChange={handleChange} />
                {errors.brand && <div className="error-message">{errors.brand}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Model <span className="required-mark">*</span></label>
              <input type="text" name="model" placeholder="e.g., WH-1000XM5" value={formData.model} onChange={handleChange} />
              {errors.model && <div className="error-message">{errors.model}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Condition <span className="required-mark">*</span></label>
                <select name="condition" value={formData.condition} onChange={handleChange}>
                  {CONDITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.condition && <div className="error-message">{errors.condition}</div>}
              </div>
              <div className="form-group">
                <label>Year Purchased (optional)</label>
                <select name="yearPurchased" value={formData.yearPurchased} onChange={handleChange}>
                  <option value="">Select year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="older">Older</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Features Included</label>
              <div className="checkbox-group">
                {FEATURES_OPTIONS.map(feature => (<label key={feature.id} className="checkbox-item"><input type="checkbox" checked={formData.features.includes(feature.id)} onChange={() => handleCheckboxChange(feature.id)} /><span className="checkmark"></span><span>{feature.label}</span></label>))}
              </div>
            </div>
            <div className="form-group">
              <label>Any Defects? (optional)</label>
              <textarea name="defects" placeholder="Describe any issues or defects..." rows={3} value={formData.defects} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (USD) <span className="required-mark">*</span></label>
                <div className="input-prefix"><span>$</span><input type="number" name="price" placeholder="0.00" min="0.01" step="0.01" value={formData.price} onChange={handleChange} /></div>
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>
              <div className="form-group">
                <label>Location <span className="required-mark">*</span></label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  {LOCATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.location && <div className="error-message">{errors.location}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Description <span className="required-mark">*</span></label>
              <textarea name="description" placeholder="Describe features, condition, warranty, etc." rows={4} value={formData.description} onChange={handleChange} maxLength={1000} />
              <span className={`char-counter ${charCount > 900 ? 'warning' : ''} ${charCount > 1000 ? 'error' : ''}`}>{charCount}/1000 characters</span>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
          </section>

          {/* Contact Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">👤</div>
              <div><h2 className="section-title">Contact Details</h2><p className="section-subtitle">How buyers can reach you</p></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name <span className="required-mark">*</span></label>
                <input type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>Phone Number <span className="required-mark">*</span></label>
                <input type="tel" name="phone" placeholder="012 345 678" value={formData.phone} onChange={handleChange} />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Email <span className="required-mark">*</span></label>
              <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </section>

          {/* Additional Settings */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <div><h2 className="section-title">Additional Settings</h2><p className="section-subtitle">Optional preferences</p></div>
            </div>
            <div className="toggle-group">
              <div className="toggle-label"><span>Allow Negotiation</span><span>Buyers can make offers</span></div>
              <label className="toggle-switch"><input type="checkbox" checked={formData.allowNegotiation} onChange={() => handleToggle('allowNegotiation')} /><span className="toggle-slider"></span></label>
            </div>
            <div className="toggle-group" style={{ borderBottom: 'none' }}>
              <div className="toggle-label"><span>Shipping Available</span><span>Willing to ship</span></div>
              <label className="toggle-switch"><input type="checkbox" checked={formData.shippingAvailable} onChange={() => handleToggle('shippingAvailable')} /><span className="toggle-slider"></span></label>
            </div>
            {formData.shippingAvailable && (
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Shipping Cost ($)</label>
                <div className="input-prefix"><span>$</span><input type="number" name="shippingCost" placeholder="0.00" min="0" step="0.01" value={formData.shippingCost} onChange={handleChange} /></div>
              </div>
            )}
          </section>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
              {submitting || uploading ? (<><span className="spinner"></span>{uploading ? 'Uploading...' : 'Posting...'}</>) : 'Post Electronics'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}