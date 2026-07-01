'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './pservice.css';

const SERVICE_CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'Repair & Maintenance', label: 'Repair & Maintenance' },
  { value: 'Cleaning Services', label: 'Cleaning Services' },
  { value: 'Tutoring & Learning', label: 'Tutoring & Learning' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Freelance Work', label: 'Freelance Work' },
  { value: 'Other', label: 'Other' },
];

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Select experience level' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Professional', label: 'Professional' },
];

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Select availability' },
  { value: 'Available Now', label: 'Available Now' },
  { value: 'Available This Week', label: 'Available This Week' },
  { value: 'Available This Month', label: 'Available This Month' },
  { value: 'By Appointment', label: 'By Appointment' },
];

const SERVICE_AREA_OPTIONS = [
  { id: 'onsite', label: 'On-site (at customer location)' },
  { id: 'atmylocation', label: 'At my location' },
  { id: 'online', label: 'Online/Remote' },
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

export default function PostServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', category: '', experience: '', availability: '',
    serviceArea: [] as string[], priceType: 'fixed', fixedPrice: '',
    hourlyRate: '', certifications: '', description: '',
    location: '', name: '', phone: '', email: '',
    allowNegotiation: false,
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

  const handleServiceAreaChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      serviceArea: prev.serviceArea.includes(id) ? prev.serviceArea.filter(s => s !== id) : [...prev.serviceArea, id],
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
    if (!formData.availability) newErrors.availability = 'Please select availability';
    if (formData.priceType === 'fixed' && (!formData.fixedPrice || parseFloat(formData.fixedPrice) <= 0)) newErrors.fixedPrice = 'Please enter a valid price';
    if (formData.priceType === 'hourly' && (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0)) newErrors.hourlyRate = 'Please enter a valid rate';
    if (!formData.description.trim() || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.name.trim()) newErrors.name = 'Your name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
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
      const price = formData.priceType === 'fixed' ? parseFloat(formData.fixedPrice) : parseFloat(formData.hourlyRate);
      const postData = {
        title: formData.title, type: 'Service', brand: formData.category,
        specs: `${formData.category} | ${formData.experience || 'N/A'} | ${formData.availability}`,
        condition: 'N/A', price: price,
        description: formData.description + (formData.certifications ? `\n\nCertifications: ${formData.certifications}` : ''),
        location: formData.location, contactName: formData.name, contactPhone: formData.phone, contactEmail: formData.email,
        imageUrl: imageUrls[0] || '', images: imageUrls, userId,
        additionalDetails: {
          category: formData.category, experience: formData.experience, availability: formData.availability,
          serviceArea: formData.serviceArea, priceType: formData.priceType,
          fixedPrice: formData.priceType === 'fixed' ? price : undefined,
          hourlyRate: formData.priceType === 'hourly' ? price : undefined,
          certifications: formData.certifications, allowNegotiation: formData.allowNegotiation,
        },
      };
      const response = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(postData) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to post');
      setSuccess(true);
      setFormData({ title: '', category: '', experience: '', availability: '', serviceArea: [], priceType: 'fixed', fixedPrice: '', hourlyRate: '', certifications: '', description: '', location: '', name: '', phone: '', email: '', allowNegotiation: false });
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
            <span className="brand-icon">🛠️</span>
            <span className="brand-name">Post Service</span>
          </div>
        </header>
        <main className="post-content">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-content"><h3>Service listed successfully!</h3><p>Your service listing is now live and visible to customers.</p></div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/home')}>View Marketplace</button>
            <button className="btn btn-secondary" onClick={() => router.push('/user-intetface/profile')}>My Listings</button>
            <button className="btn btn-primary" onClick={() => { setSuccess(false); setFormData({ title: '', category: '', experience: '', availability: '', serviceArea: [], priceType: 'fixed', fixedPrice: '', hourlyRate: '', certifications: '', description: '', location: '', name: '', phone: '', email: '', allowNegotiation: false }); setImages([]); }}>Post Another Item</button>
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
          <span className="brand-icon"><Image src="/home/ser.png" alt="Service" width={24} height={24} /></span>
          <span className="brand-name">Post Service</span>
        </div>
      </header>
      <main className="post-content">
        {errors.submit && <div className="error-alert"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.submit}</span></div>}
        <form className="post-form" onSubmit={handleSubmit}>
          {/* Photos */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">📷</div>
              <div><h2 className="section-title">Portfolio Photos</h2><p className="section-subtitle">Add photos of your work (optional but recommended)</p></div>
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

          {/* Service Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">🛠️</div>
              <div><h2 className="section-title">Service Details</h2><p className="section-subtitle">Describe your service</p></div>
            </div>
            <div className="form-group">
              <label>Service Title <span className="required-mark">*</span></label>
              <input type="text" name="title" placeholder="e.g., iPhone Screen Repair, House Cleaning" value={formData.title} onChange={handleChange} maxLength={100} />
              <span className="help-text">What service do you offer?</span>
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required-mark">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {SERVICE_CATEGORIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select name="experience" value={formData.experience} onChange={handleChange}>
                  {EXPERIENCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Availability <span className="required-mark">*</span></label>
              <select name="availability" value={formData.availability} onChange={handleChange}>
                {AVAILABILITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.availability && <div className="error-message">{errors.availability}</div>}
            </div>
            <div className="form-group">
              <label>Service Area</label>
              <div className="checkbox-group">
                {SERVICE_AREA_OPTIONS.map(area => (<label key={area.id} className="checkbox-item"><input type="checkbox" checked={formData.serviceArea.includes(area.id)} onChange={() => handleServiceAreaChange(area.id)} /><span className="checkmark"></span><span>{area.label}</span></label>))}
              </div>
            </div>
            <div className="form-group">
              <label>Price Structure <span className="required-mark">*</span></label>
              <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="priceType" value="fixed" checked={formData.priceType === 'fixed'} onChange={() => setFormData(prev => ({ ...prev, priceType: 'fixed' }))} style={{ accentColor: '#11998e' }} />
                  <span>Fixed Price</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="priceType" value="hourly" checked={formData.priceType === 'hourly'} onChange={() => setFormData(prev => ({ ...prev, priceType: 'hourly' }))} style={{ accentColor: '#11998e' }} />
                  <span>Hourly Rate</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="priceType" value="negotiable" checked={formData.priceType === 'negotiable'} onChange={() => setFormData(prev => ({ ...prev, priceType: 'negotiable' }))} style={{ accentColor: '#11998e' }} />
                  <span>Negotiable</span>
                </label>
              </div>
              {formData.priceType === 'fixed' && (
                <div className="input-prefix" style={{ marginTop: '12px', maxWidth: '200px' }}>
                  <span>$</span>
                  <input type="number" name="fixedPrice" placeholder="0.00" min="0.01" step="0.01" value={formData.fixedPrice} onChange={handleChange} />
                </div>
              )}
              {formData.priceType === 'hourly' && (
                <div className="input-prefix" style={{ marginTop: '12px', maxWidth: '200px' }}>
                  <span>$</span>
                  <input type="number" name="hourlyRate" placeholder="0.00" min="0.01" step="0.01" value={formData.hourlyRate} onChange={handleChange} />
                </div>
              )}
              {errors.fixedPrice && <div className="error-message">{errors.fixedPrice}</div>}
              {errors.hourlyRate && <div className="error-message">{errors.hourlyRate}</div>}
            </div>
            <div className="form-group">
              <label>Certifications/Qualifications (optional)</label>
              <input type="text" name="certifications" placeholder="List any relevant certifications" value={formData.certifications} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Service Description <span className="required-mark">*</span></label>
              <textarea name="description" placeholder="Describe what you do, your process, and what customers can expect..." rows={4} value={formData.description} onChange={handleChange} maxLength={1000} />
              <span className={`char-counter ${charCount > 900 ? 'warning' : ''} ${charCount > 1000 ? 'error' : ''}`}>{charCount}/1000 characters</span>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
            <div className="form-group">
              <label>Location <span className="required-mark">*</span></label>
              <select name="location" value={formData.location} onChange={handleChange}>
                {LOCATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>
          </section>

          {/* Contact Details */}
          <section className="form-section">
            <div className="section-header">
              <div className="section-icon">👤</div>
              <div><h2 className="section-title">Contact Details</h2><p className="section-subtitle">How customers can reach you</p></div>
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
              <div className="toggle-label"><span>Allow Negotiation</span><span>Customers can negotiate price</span></div>
              <label className="toggle-switch"><input type="checkbox" checked={formData.allowNegotiation} onChange={() => handleToggle('allowNegotiation')} /><span className="toggle-slider"></span></label>
            </div>
          </section>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
              {submitting || uploading ? (<><span className="spinner"></span>{uploading ? 'Uploading...' : 'Posting...'}</>) : 'Post Service'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}