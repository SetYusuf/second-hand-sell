'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import './bdetail.css';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  condition: string;
  location: string;
  brand: string;
  type: string;
  specs?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function BuyDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = searchParams.get('id');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.post);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="buy-detail-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Fallback data if no product found
  const displayProduct = product || {
    _id: searchParams.get('id') || '1288583223',
    title: searchParams.get('title') || 'Computer for Selling',
    description: searchParams.get('desc') || 'Computer for Selling\nlocation Toul Kork\n98% Condition, 100% working',
    price: parseFloat((searchParams.get('price') || '1500').replace(/[^0-9.]/g, '')),
    imageUrl: searchParams.get('image') || '/home/bann1.png',
    condition: 'Good',
    location: 'Phnom Penh',
    brand: 'Generic',
    type: 'Computer',
    contactName: 'Seller',
    contactPhone: '012 345 678',
    contactEmail: 'seller@example.com',
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="buy-detail-container">
      <header className="detail-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </header>

      <div className="content-wrapper">
        {/* Left Column */}
        <div className="left-column">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image-wrapper">
              <Image src={displayProduct.imageUrl || '/home/computer.png'} alt={displayProduct.title} width={800} height={500} className="main-image" />
              <div className="watermark">RUPP SecondHand</div>
            </div>
            <div className="thumbnail-row">
              <div className="thumbnail">
                <Image src={displayProduct.imageUrl || '/home/computer.png'} alt="Thumb 1" width={150} height={100} className="thumb-img" />
              </div>
              <div className="thumbnail">
                <Image src={displayProduct.imageUrl || '/home/computer.png'} alt="Thumb 2" width={150} height={100} className="thumb-img" />
              </div>
              <div className="thumbnail">
                <Image src={displayProduct.imageUrl || '/home/computer.png'} alt="Thumb 3" width={150} height={100} className="thumb-img" />
                <div className="more-overlay">+5</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{displayProduct.title}</h1>
            <div className="product-meta">
              <span>AD ID: {displayProduct._id}</span> • <span>{displayProduct.location}</span> • <span>{displayProduct.type}</span>
            </div>
            <div className="product-price">${displayProduct.price}</div>
          </div>

          {/* Details */}
          <div className="details-section">
            <p style={{ whiteSpace: 'pre-line' }}>{displayProduct.description}</p>
            <br />
            {displayProduct.condition && (
              <p><strong>Condition:</strong> {displayProduct.condition}</p>
            )}
            {displayProduct.brand && (
              <p><strong>Brand:</strong> {displayProduct.brand}</p>
            )}
            {displayProduct.specs && (
              <p><strong>Specs:</strong> {displayProduct.specs}</p>
            )}
            <p><strong>Location:</strong> {displayProduct.location}</p>
            
            <div className="map-placeholder">
               <div className="map-content">
                  <span className="map-icon">📍</span> Show on Google Map
               </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-section">
            <p><strong>Contact Info:</strong></p>
            <p className="contact-name">👤 {displayProduct.contactName}</p>
            <p className="phone-number">📱 {displayProduct.contactPhone}</p>
            <p className="phone-number">📧 {displayProduct.contactEmail}</p>
          </div>

          {/* Bottom Profile */}
          <div className="bottom-profile">
            <div className="profile-row">
                <Image src="/notification-image/lina.png" alt="Seller" width={50} height={50} className="profile-avatar" />
                <div className="profile-text">
                    <div className="profile-name">{displayProduct.contactName}</div>
                    <div className="profile-handle">@{displayProduct.contactName}</div>
                    <div className="profile-meta">Member since {new Date(displayProduct.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
            <div className="bottom-actions">
                <button className="btn-view-profile-light">View Profile</button>
                <button className="btn-follow">+ Follow</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
            <div className="sidebar-profile-card">
                <div className="profile-row">
                    <Image src="/notification-image/lina.png" alt="Seller" width={50} height={50} className="profile-avatar" />
                    <div className="profile-text">
                        <div className="profile-name">{displayProduct.contactName}</div>
                        <div className="profile-handle">@{displayProduct.contactName}</div>
                        <div className="profile-meta">Member since {new Date(displayProduct.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="sidebar-actions">
                    <button className="btn-view-profile-blue">View Profile</button>
                    <button className="btn-chat-green" onClick={() => window.open(`tel:${displayProduct.contactPhone}`)}>Chat</button>
                </div>
            </div>

            <div className="sidebar-ad-space">
                {/* Empty gray space */}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyDetailContent />
    </Suspense>
  );
}