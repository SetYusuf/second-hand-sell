'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import './bdetail.css';

function BuyDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL params or fallback to default
  const title = searchParams.get('title') || 'Computer for Selling';
  const price = searchParams.get('price') || '$1,500';
  const desc = searchParams.get('desc') || 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working';
  const mainImage = searchParams.get('image') || '/home/bann1.png';
  const adId = searchParams.get('id') || '1288583223';

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
              <Image src={mainImage} alt={title} width={800} height={500} className="main-image" />
              <div className="watermark">RUPP SecondHand</div>
            </div>
            <div className="thumbnail-row">
              <div className="thumbnail">
                <Image src={mainImage} alt="Thumb 1" width={150} height={100} className="thumb-img" />
              </div>
              <div className="thumbnail">
                <Image src={mainImage} alt="Thumb 2" width={150} height={100} className="thumb-img" />
              </div>
              <div className="thumbnail">
                <Image src={mainImage} alt="Thumb 3" width={150} height={100} className="thumb-img" />
                <div className="more-overlay">+5</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{title}</h1>
            <div className="product-meta">
              <span>AD ID: {adId}</span> • <span>Phnom Penh</span> • <span>12m</span>
            </div>
            <div className="product-price">{price}</div>
          </div>

          {/* Details */}
          <div className="details-section">
            <p style={{ whiteSpace: 'pre-line' }}>{desc}</p>
            <br />
            <p><strong>Location :</strong> Boeng Keng Kang Muoy, Boeng Keng Kang, Phnom Penh</p>
            
            <div className="map-placeholder">
               <div className="map-content">
                  <span className="map-icon">📍</span> Show on Google Map
               </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-section">
            <p>📲 <strong>Telegram:</strong> <a href="#">https://t.me/afinytank</a></p>
            <p><strong>Contact Info:</strong></p>
            <p className="phone-number">097 451 7128</p>
            <p className="phone-number">097 451 7128</p>
          </div>

          {/* Bottom Profile */}
          <div className="bottom-profile">
            <div className="profile-row">
                <Image src="/notification-image/lina.png" alt="Seller" width={50} height={50} className="profile-avatar" />
                <div className="profile-text">
                    <div className="profile-name">Afiny Tank</div>
                    <div className="profile-handle">@Afiny Tank</div>
                    <div className="profile-meta">Members since 21, may 2023</div>
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
                        <div className="profile-name">Afiny Tank</div>
                        <div className="profile-handle">@Afiny Tank</div>
                        <div className="profile-meta">Members since 21, may 2023</div>
                    </div>
                </div>
                <div className="sidebar-actions">
                    <button className="btn-view-profile-blue">View Profile</button>
                    <button className="btn-chat-green">Chat</button>
                </div>
            </div>

            <div className="sidebar-ad-space">
                {/* Empty gray space as per screenshot */}
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
