'use client';

import { useState } from 'react';
import Image from 'next/image';
import './pservice.css';

export default function PostServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    availability: '',
    price: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    email: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Upload image first if photo exists
      let imageUrl = '';
      if (photo) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', photo);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const uploadData = await uploadRes.json();
        
        if (uploadData.success) {
          imageUrl = uploadData.url;
        }
      }

      // Step 2: Get real userId from localStorage
      const userId = localStorage.getItem('userId') || 'anonymous';
      const token = localStorage.getItem('token') || '';

      // Step 3: Create the post with real data
      const postData = {
        title: formData.title,
        type: 'Service',
        brand: formData.category,
        specs: formData.availability,
        condition: 'N/A',
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        contactName: formData.name,
        contactPhone: formData.phone,
        contactEmail: formData.email,
        userId: userId,
        imageUrl: imageUrl
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Posted successfully!');
        setFormData({
          title: '', category: '', availability: '',
          price: '', description: '', location: '', name: '', phone: '', email: '',
        });
        setPhoto(null); setPreview(null);
      } else {
        alert('Failed to post: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error posting service. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-finding-page">
      <header className="post-finding-header">
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/ser.png" alt="Post Service" width={32} height={32} />
          </span>
          <span className="brand-name">Post Service</span>
        </div>
      </header>

      <main className="post-finding-content">
        <form className="post-finding-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Photo</h2>
            <label className="photo-upload" htmlFor="photo">
              <div className="photo-icon">
                {preview ? (
                  <Image src={preview} alt="Preview" width={64} height={64} style={{ borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem' }}>+</span>
                )}
              </div>
              <span>{preview ? 'Change Photo' : 'Add Photo'}</span>
            </label>
            <input id="photo" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
          </section>

          <section className="form-section">
            <h2>Service Details</h2>
            <input type="text" name="title" placeholder="Title (e.g. AC Repair, Cleaning)" value={formData.title} onChange={handleChange} required />
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Category</option>
              <option value="Repair">Repair</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="availability" placeholder="Availability (e.g. Weekends, 9AM-5PM)" value={formData.availability} onChange={handleChange} required />
            <div className="input-prefix">
              <span>$</span>
              <input type="number" name="price" placeholder="Price (per hour/job)" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
            <textarea name="description" placeholder="Description (Service Details, Experience, etc.)" rows={4} value={formData.description} onChange={handleChange} />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          </section>

          <section className="form-section">
            <h2>Contact Detail</h2>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </section>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Service'}
          </button>
        </form>
      </main>
    </div>
  );
}