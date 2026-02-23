'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './pcomputer.css';

interface ComputerData {
  title: string;
  type: string;
  brand: string;
  specs: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
  photo?: File | null;
  photoPreview?: string;
  photoError?: string;
}

export default function PostComputerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ComputerData>({
    title: '',
    type: '',
    brand: '',
    specs: '',
    condition: '',
    price: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    email: '',
    photo: null,
    photoPreview: '',
    photoError: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setFormData(prev => ({
          ...prev,
          photoError: 'Photo size must be less than 10MB',
          photo: null,
          photoPreview: ''
        }));
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setFormData(prev => ({
          ...prev,
          photoError: 'Only JPEG, PNG, WebP, and GIF images are allowed',
          photo: null,
          photoPreview: ''
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: result,
          photoError: ''
        }));
      };
      reader.onerror = () => {
        setFormData(prev => ({
          ...prev,
          photoError: 'Failed to load image preview',
          photo: null,
          photoPreview: ''
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        photo: null,
        photoPreview: '',
        photoError: ''
      }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: '',
      photoError: ''
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.title || !formData.price || !formData.name || !formData.email) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Step 1: Upload image if provided
      let imageUrl = '';
      if (formData.photo) {
        const uploadForm = new FormData();
        uploadForm.append('image', formData.photo);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST', body: uploadForm
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(uploadData.error);
        imageUrl = uploadData.url;
      }

      // Step 2: Save the post
      // TODO: Replace 'user_id_here' with actual user ID from your auth system
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id || 'anonymous';

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          brand: formData.brand,
          specs: formData.specs,
          condition: formData.condition,
          price: parseFloat(formData.price),
          description: formData.description,
          location: formData.location,
          contactName: formData.name,
          contactPhone: formData.phone,
          contactEmail: formData.email,
          imageUrl,
          userId,
        }),
      });
      const postData = await postRes.json();
      if (!postData.success) throw new Error(postData.error);

      // Step 3: Redirect to home
      router.push('/user-intetface/home');

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-finding-page">
      <header className="post-finding-header">
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/computer.png" alt="Post Computer" width={32} height={32} />
          </span>
          <span className="brand-name">Post Computer</span>
        </div>
      </header>

      <main className="post-finding-content">
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#fee', 
            color: '#c00', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}
        <form className="post-finding-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Photo</h2>
            <label className="photo-upload" htmlFor="photo">
              <div className="photo-icon">
                {formData.photoPreview ? (
                  <Image 
                    src={formData.photoPreview} 
                    alt="Preview" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '2rem' }}>+</span>
                )}
              </div>
              <span>{formData.photoPreview ? 'Change Photo' : 'Add Photo'}</span>
            </label>
            <input 
              id="photo" 
              type="file" 
              className="sr-only" 
              onChange={handlePhotoChange}
              accept="image/*"
            />
            {formData.photoError && (
              <div className="photo-error">
                {formData.photoError}
              </div>
            )}
            {formData.photoPreview && (
              <button 
                type="button" 
                className="remove-photo-btn"
                onClick={removePhoto}
                aria-label="Remove photo"
              >
                <i className="fa fa-times"></i>
                Remove Photo
              </button>
            )}
          </section>

          <section className="form-section">
            <h2>Computer Details</h2>
            <input 
              type="text" 
              name="title"
              placeholder="Title (e.g. MacBook Pro M1 2020)" 
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <select 
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                Type
              </option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="monitor">Monitor</option>
              <option value="accessories">Accessories</option>
              <option value="parts">Parts</option>
            </select>
            <input 
              type="text" 
              name="brand"
              placeholder="Brand (e.g. Apple, Dell, Asus)" 
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
            <input 
              type="text" 
              name="specs"
              placeholder="Specs (RAM, Storage, Processor)" 
              value={formData.specs}
              onChange={handleInputChange}
              required
            />
            <input 
              type="text" 
              name="condition"
              placeholder="Condition (e.g. New, Used, Like New)" 
              value={formData.condition}
              onChange={handleInputChange}
              required
            />
            
            <div className="input-prefix">
              <span>$</span>
              <input 
                type="number" 
                name="price"
                placeholder="Price" 
                min="0" 
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <textarea 
              name="description"
              placeholder="Description (Defects, Warranty, etc.)" 
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <input 
              type="text" 
              name="location"
              placeholder="Location" 
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </section>

          <section className="form-section">
            <h2>Contact Detail</h2>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone number" 
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </section>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Computer'}
          </button>
        </form>
      </main>
    </div>
  );
}
