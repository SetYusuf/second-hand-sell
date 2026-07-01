'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './pcomputer.css';

const COMPUTER_TYPES = [
  { value: '', label: 'Select type' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Keyboard', label: 'Keyboard' },
  { value: 'Mouse', label: 'Mouse' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Parts', label: 'Parts' },
];

const RAM_OPTIONS = [
  { value: '', label: 'Select RAM' },
  { value: '4GB', label: '4GB' },
  { value: '8GB', label: '8GB' },
  { value: '16GB', label: '16GB' },
  { value: '32GB', label: '32GB' },
  { value: '64GB+', label: '64GB+' },
];

const OS_OPTIONS = [
  { value: '', label: 'Select OS' },
  { value: 'Windows 11', label: 'Windows 11' },
  { value: 'Windows 10', label: 'Windows 10' },
  { value: 'macOS Ventura', label: 'macOS Ventura' },
  { value: 'macOS Monterey', label: 'macOS Monterey' },
  { value: 'Linux', label: 'Linux' },
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

const BATTERY_OPTIONS = [
  { value: '', label: 'Select battery health' },
  { value: 'Excellent (80-100%)', label: 'Excellent (80-100%)' },
  { value: 'Good (60-79%)', label: 'Good (60-79%)' },
  { value: 'Fair (40-59%)', label: 'Fair (40-59%)' },
  { value: 'Poor (<40%)', label: 'Poor (<40%)' },
  { value: 'N/A (Desktop)', label: 'N/A (Desktop)' },
];

const LOCATION_OPTIONS = [
  { value: '', label: 'Select location' },
  { value: 'Phnom Penh', label: 'Phnom Penh' },
  { value: 'Siem Reap', label: 'Siem Reap' },
  { value: 'Battambang', label: 'Battambang' },
  { value: 'Kandal', label: 'Kandal' },
  { value: 'Other', label: 'Other' },
];

interface FormErrors { [key: string]: string; }

export default function PostComputerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', type: '', brand: '', model: '', processor: '',
    ram: '', storage: '', graphics: '', display: '', condition: '',
    batteryHealth: '', os: '', warranty: '', price: '',
    description: '', location: '', name: '', phone: '', email: '',
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
        setFormData(prev => ({
          ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '',
        }));
      } catch (e) { console.error('Failed to parse user data:', e); }
    }
  }, []);

  useEffect(() => { setCharCount(formData.description.length); }, [formData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof formData] }));
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
    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setErrors(prev => { const n = { ...prev }; delete n.images; return n; });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const n = prev.filter((_, i) => i !== index);
      if (n.length > 0 && !n.some(img => img.isMain)) n[0].isMain = true;
      return n;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index })));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageSelect({ target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim() || formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.type) newErrors.type = 'Please select a type';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.processor.trim()) newErrors.processor = 'Processor is required';
    if (!formData.ram) newErrors.ram = 'Please select RAM';
    if (!formData.storage.trim()) newErrors.storage = 'Storage is required';
    if (!formData.condition) newErrors.condition = 'Please select condition';
    if (!formData.os) newErrors.os = 'Please select OS';
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
        title: formData.title, type: 'Computer', brand: formData.brand,
        specs: `${formData.type} | ${formData.processor} | ${formData.ram} | ${formData.storage} | ${formData.graphics || 'Integrated'}`,
        condition: formData.condition, price: parseFloat(formData.price),
        description: formData.description, location: formData.location,
        contactName: formData.name, contactPhone: formData.phone, contactEmail: formData.email,
        imageUrl: imageUrls[0] || '', images: imageUrls, userId,
        additionalDetails: {
          model: formData.model, processor: formData.processor, ram: formData.ram,
          storage: formData.storage, graphics: formData.graphics, display: formData.display,
          batteryHealth: formData.batteryHealth, os: formData.os, warranty: formData.warranty,
          allowNegotiation: formData.allowNegotiation, shippingAvailable: formData.shippingAvailable,
          shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : undefined,
        },
      };
      const response = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to post');
      setSuccess(true);
      setFormData({
        title: '', type: '', brand: '', model: '', processor: '', ram: '', storage: '',
        graphics: '', display: '', condition: '', batteryHealth: '', os: '', warranty: '',
        price: '', description: '', location: '', name: '', phone: '', email: '',
        allowNegotiation: false, shippingAvailable: false, shippingCost: '',
      });
      setImages([]);
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred.' });
    } finally {
      setSubmitting(false); setUploading(false);
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
            <span className="brand-icon">💻</span>
            <span className="brand-name">Post Computer</span>
          </div>
        </header>
        <main className="post-content">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h3>Computer listed successfully!</h3>
              <p>Your listing is now live and visible to buyers.</p>
            </div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/home')}>View Marketplace</button>
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/profile')}>My Listings</button>
            <button className="btn btn-primary" onClick={() => { setSuccess(false); setFormData({ title: '', type: '', brand: '', model: '', processor: '', ram: '', storage: '', graphics: '', display: '', condition: '', batteryHealth: '', os: '', warranty: '', price: '', description: '', location: '', name: '', phone: '', email: '', allowNegotiation: false, shippingAvailable: false, shippingCost: '' }); setImages([]); }}>Post Another Item</button>
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
          <span className="brand-icon"><Image src="/home/computer.png" alt="Computer" width={24} height={24} /></span>
          <span className="brand-name">Post Computer</span>
        </div>
      </header>
      <main className="post-content">
        {errors.submit && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{errors.submit}</span>
          </div>
        )}
        <form className="post-form" onSubmit={handleSubmit}>
          {/* Photos */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📷</div>
              <div><h2 className="section-title">Photos</h2><p className="section-subtitle">Add clear photos (max 5)</p></div>
            </div>
            <div className={`photo-upload-area ${images.length > 0 ? 'has-images' : ''}`} onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDrop={handleDrop} role="button" tabIndex={0} aria-label="Upload photos">
              {images.length === 0 ? (
                <><div className="upload-icon">+</div><div className="upload-text"><strong>Click to upload</strong> or drag and drop</div><div className="upload-hint">JPG, PNG, WebP or GIF (max 5MB each)</div></>
              ) : (
                <div className="image-preview-grid">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview-item" onClick={(e) => { e.stopPropagation(); setMainImage(index); }}>
                      <Image src={img.preview} alt={`Preview ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                      {img.isMain && <span className="main-badge">Main</span>}
                      <button type="button" className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(index); }} aria-label="Remove image">✕</button>
                    </div>
                  ))}
                  {images.length < 5 && <div className="image-preview-item" style={{ borderStyle: 'dashed', borderColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><span style={{ fontSize: '2rem', color: '#a0aec0' }}>+</span></div>}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleImageSelect} />
            {errors.images && <div className="error-message">{errors.images}</div>}
          </section>

          {/* Computer Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">💻</div>
              <div><h2 className="section-title">Computer Details</h2><p className="section-subtitle">Provide accurate specifications</p></div>
            </div>
            <div className="form-group">
              <label>Item Title <span className="required-mark">*</span></label>
              <input type="text" name="title" placeholder="e.g., MacBook Pro 16 M1 Pro 2021" value={formData.title} onChange={handleChange} maxLength={100} />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type <span className="required-mark">*</span></label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  {COMPUTER_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.type && <div className="error-message">{errors.type}</div>}
              </div>
              <div className="form-group">
                <label>Brand <span className="required-mark">*</span></label>
                <input type="text" name="brand" placeholder="e.g., Apple, Dell, Asus" value={formData.brand} onChange={handleChange} />
                {errors.brand && <div className="error-message">{errors.brand}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Model <span className="required-mark">*</span></label>
              <input type="text" name="model" placeholder="e.g., MacBook Pro 16-inch" value={formData.model} onChange={handleChange} />
              {errors.model && <div className="error-message">{errors.model}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Processor <span className="required-mark">*</span></label>
                <input type="text" name="processor" placeholder="e.g., Intel Core i7-11700K, M1 Pro" value={formData.processor} onChange={handleChange} />
                {errors.processor && <div className="error-message">{errors.processor}</div>}
              </div>
              <div className="form-group">
                <label>RAM <span className="required-mark">*</span></label>
                <select name="ram" value={formData.ram} onChange={handleChange}>
                  {RAM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.ram && <div className="error-message">{errors.ram}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Storage <span className="required-mark">*</span></label>
                <input type="text" name="storage" placeholder="e.g., 512GB SSD, 1TB HDD" value={formData.storage} onChange={handleChange} />
                {errors.storage && <div className="error-message">{errors.storage}</div>}
              </div>
              <div className="form-group">
                <label>Graphics (optional)</label>
                <input type="text" name="graphics" placeholder="e.g., NVIDIA RTX 3080" value={formData.graphics} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Display (for laptop/monitor)</label>
<input type="text" name="display" placeholder="e.g., 15.6 inch 2560x1600 IPS" value={formData.display} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Operating System <span className="required-mark">*</span></label>
                <select name="os" value={formData.os} onChange={handleChange}>
                  {OS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.os && <div className="error-message">{errors.os}</div>}
              </div>
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
                <label>Battery Health (for laptops)</label>
                <select name="batteryHealth" value={formData.batteryHealth} onChange={handleChange}>
                  {BATTERY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Warranty Remaining (optional)</label>
              <input type="text" name="warranty" placeholder="e.g., 6 months remaining" value={formData.warranty} onChange={handleChange} />
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
              <textarea name="description" placeholder="Describe defects, warranty, accessories included, etc." rows={4} value={formData.description} onChange={handleChange} maxLength={1000} />
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
              {submitting || uploading ? (<><span className="spinner"></span>{uploading ? 'Uploading...' : 'Posting...'}</>) : 'Post Computer'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}