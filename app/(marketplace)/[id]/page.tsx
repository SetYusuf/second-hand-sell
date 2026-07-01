'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import './bdetail.css';
import { getCurrentUserIdFromStorage, getProfileRouteForUser, openChatWithUser } from '@/lib/profile-utils';
import { getStoredCustomAvatar, getStoredUserEmail } from '@/lib/auth-storage';

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

interface SellerInfo {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location?: string;
  memberSince?: string;
  bio?: string;
  listingCount?: number;
}

interface SellerProduct {
  _id: string;
  title: string;
  price: number;
  type?: string;
  imageUrl?: string;
}

function BuyDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [moreProducts, setMoreProducts] = useState<SellerProduct[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // Navbar state
  const [customAvatar, setCustomAvatar] = useState('');
  const [userLetter, setUserLetter] = useState('U');
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('eng');
  const [showPostCategories, setShowPostCategories] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [hasNewChatMessage] = useState(true);
  const [hasNewNotification] = useState(true);
  const [cart, setCart] = useState<{ id: string; title: string; price: string; image: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const productId = searchParams.get('id');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setLoading(false);
    }
  }, [productId]);

  // Load navbar data
  useEffect(() => {
    setCurrentUserId(getCurrentUserIdFromStorage());
    const savedAvatar = getStoredCustomAvatar();
    if (savedAvatar) setCustomAvatar(savedAvatar);
    const userEmail = getStoredUserEmail() || 'user@example.com';
    const userName = userEmail.split('@')[0];
    setUserLetter(userName.charAt(0).toUpperCase());
    try {
      const stored = localStorage.getItem('cart');
      if (stored) setCart(JSON.parse(stored));
    } catch {
      // ignore malformed cart values
    }
  }, []);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        const fetchedProduct = data.post as Product;
        setProduct(fetchedProduct);
        if (fetchedProduct.userId) {
          fetchSeller(fetchedProduct.userId);
          fetchMoreFromSeller(fetchedProduct.userId, fetchedProduct._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeller = async (sellerID: string) => {
    try {
      const res = await fetch(`/api/users/${sellerID}`);
      const data = await res.json();
      if (data.success) {
        setSeller(data.user as SellerInfo);
      }
    } catch (error) {
      console.error('Failed to fetch seller:', error);
    }
  };

  const fetchMoreFromSeller = async (sellerID: string, currentProductId: string) => {
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/products/seller/${sellerID}?exclude=${currentProductId}`
      );
      const data = await res.json();
      if (data.success) {
        setMoreProducts(data.posts as SellerProduct[]);
      }
    } catch (error) {
      console.error('Failed to fetch more from seller:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/user-intetface/home?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const switchLanguage = (lang: 'eng' | 'cam') => {
    setCurrentLang(lang);
    setLangDropdown(false);
  };

  const getCartItemCount = () => cart.length;

  if (loading) {
    return (
      <div className="bd-page">
        <div className="bd-loading">
          <div className="bd-loading__spinner" />
          <p className="bd-loading__text">Loading product details...</p>
        </div>
      </div>
    );
  }

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
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const imageList: string[] = displayProduct.imageUrl
    ? displayProduct.imageUrl.split(',').map((url: string) => url.trim()).filter(Boolean)
    : ['/home/computer.png'];

  const currentImage = imageList[selectedImage] || imageList[0];

  const memberSinceText = seller?.memberSince
    ? new Date(seller.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const totalListings = moreProducts.length + (product ? 1 : 0);

  const handleViewProfile = () => {
    if (seller) {
      const targetPath = getProfileRouteForUser(currentUserId, seller.id);
      router.push(targetPath);
    }
  };

  const handleChat = () => {
    if (seller) {
      openChatWithUser({
        router,
        participant: {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar || '/notification-image/lina.png',
        },
        initialMessage: 'Hi, I am interested in your listing.',
      });
    }
  };

  return (
    <div className="bd-page">
      {/* ═══════════════ TOP NAVBAR ═══════════════ */}
      <div className="desktop-nav">
        <header className="navbar">
          <div className="icon">
            {/* Back button */}
            <button className="bd-back" onClick={() => router.back()} aria-label="Go back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <Image src="/home/lg.png" alt="Finding Product Logo" className="brand-logo" width={240} height={80} />
            <div className="lang-popup">
              <button className="lang-btn" onClick={() => setLangDropdown(!langDropdown)} aria-label="Language" type="button">
                <Image src={`/home/${currentLang}.png`} alt={currentLang === 'eng' ? 'English' : 'Khmer'} className="lang-icon" width={24} height={24} />
              </button>
              {langDropdown && (
                <div className="lang-dropdown show">
                  <button className="cam-btn" onClick={() => switchLanguage('cam')} aria-label="Khmer" type="button">
                    <Image src="/home/cam.png" alt="Khmer" width={24} height={24} />
                  </button>
                  <button className="eng-btn" onClick={() => switchLanguage('eng')} aria-label="English" type="button">
                    <Image src="/home/eng.png" alt="English" width={24} height={24} />
                  </button>
                </div>
              )}
            </div>
            <Link href="/user-intetface/home" className="home-inline" aria-label="Home" title="Home">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            </Link>
            <Link href="/user-intetface/favorites" className="favorite-nav" aria-label="Favorites" title="Favorites">
              <i className="fa fa-heart"></i>
            </Link>
          </div>

          <form className="search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search products..." className="srch" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button type="button" className="cancel-btn" onClick={() => setSearchQuery('')} aria-label="Clear">&times;</button>
            )}
            <button type="submit" className="search-icon" aria-label="Search"><i className="fa fa-search"></i></button>
          </form>

          <nav className="navbar-menu">
            <ul>
              <li className="sell">
                <button onClick={() => setShowPostCategories(true)} className="sell-inline" type="button">POST</button>
              </li>
              <li>
                <button onClick={() => setShowChatModal(true)} className="chat-btn" aria-label="Messages" title="Messages" type="button">
                  <i className="fa fa-comments"></i>
                  {hasNewChatMessage && <span className="chat-notification-dot"></span>}
                </button>
              </li>
              <li>
                <button onClick={() => setShowNotificationModal(true)} className="notification-btn" aria-label="Notifications" title="Notifications" type="button">
                  <i className="fa fa-bell"></i>
                  {hasNewNotification && <span className="notification-badge-dot"></span>}
                </button>
              </li>
              <li>
                <button onClick={() => setShowCartModal(true)} className="cart-btn" aria-label="Cart" title="View Cart" type="button">
                  <i className="fa fa-shopping-cart"></i>
                  {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
                </button>
              </li>
              <li>
                <Link href="/user-intetface/profile" aria-label="Profile" title="Profile" className="profile-link">
                  {customAvatar ? (
                    <Image src={customAvatar} alt="Profile" className="profile-nav-avatar" width={32} height={32} />
                  ) : (
                    <div className="profile-nav-letter">{userLetter}</div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <div className="bd-layout">
        {/* ═══════════════ LEFT COLUMN ═══════════════ */}
        <div className="bd-main">
          {/* ── Image Gallery ── */}
          <section className="bd-gallery">
            <div className="bd-gallery__main">
              <Image
                src={currentImage}
                alt={displayProduct.title}
                width={800}
                height={500}
                className="bd-gallery__img"
                key={currentImage}
              />
            </div>
            {imageList.length > 1 && (
              <div className="bd-gallery__thumbs">
                {imageList.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`bd-gallery__thumb ${idx === selectedImage ? 'bd-gallery__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <Image src={imgSrc} alt={`View ${idx + 1}`} width={150} height={100} className="bd-gallery__thumb-img" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Product Info ── */}
          <section className="bd-card bd-info">
            <h1 className="bd-info__title">{displayProduct.title}</h1>
            <div className="bd-info__price">${displayProduct.price}</div>
            <div className="bd-info__meta">
              <span className="bd-info__tag">{displayProduct.type}</span>
              <span className="bd-info__dot">•</span>
              <span>{displayProduct.location}</span>
              <span className="bd-info__dot">•</span>
              <span className="bd-info__id">AD: {displayProduct._id.slice(-8)}</span>
            </div>
          </section>

          {/* ── Description ── */}
          <section className="bd-card bd-desc">
            <h2 className="bd-card__title">Description</h2>
            <p className="bd-desc__text">{displayProduct.description}</p>
            <hr className="bd-divider" />
            <div className="bd-desc__grid">
              {displayProduct.condition && (
                <div className="bd-desc__item">
                  <span className="bd-desc__label">Condition</span>
                  <span className="bd-desc__value">{displayProduct.condition}</span>
                </div>
              )}
              {displayProduct.brand && (
                <div className="bd-desc__item">
                  <span className="bd-desc__label">Brand</span>
                  <span className="bd-desc__value">{displayProduct.brand}</span>
                </div>
              )}
              {displayProduct.specs && (
                <div className="bd-desc__item">
                  <span className="bd-desc__label">Specs</span>
                  <span className="bd-desc__value">{displayProduct.specs}</span>
                </div>
              )}
              <div className="bd-desc__item">
                <span className="bd-desc__label">Location</span>
                <span className="bd-desc__value">{displayProduct.location}</span>
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="bd-card bd-contact">
            <h2 className="bd-card__title">Contact Information</h2>
            <div className="bd-contact__list">
              <div className="bd-contact__item">
                <span className="bd-contact__icon">👤</span>
                <span>{displayProduct.contactName}</span>
              </div>
              <div className="bd-contact__item">
                <span className="bd-contact__icon">📱</span>
                <span>{displayProduct.contactPhone}</span>
              </div>
              <div className="bd-contact__item">
                <span className="bd-contact__icon">📧</span>
                <span>{displayProduct.contactEmail}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
        <aside className="bd-sidebar">
          {/* ── Seller Card ── */}
          <div className="bd-card bd-seller">
            <div className="bd-seller__top">
              {seller?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={seller.avatar} alt={seller.name} className="bd-seller__avatar" />
              ) : (
                <div className="bd-seller__avatar bd-seller__avatar--empty">
                  {seller?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="bd-seller__info">
                <div className="bd-seller__name">{seller?.name || 'Seller'}</div>
                <div className="bd-seller__username">@{seller?.username || 'unknown'}</div>
                <div className="bd-seller__meta">
                  {memberSinceText && <span>Member since {memberSinceText}</span>}
                </div>
                <div className="bd-seller__listings">{totalListings} listing{totalListings === 1 ? '' : 's'}</div>
              </div>
            </div>
            <div className="bd-seller__actions">
              <button type="button" className="bd-btn bd-btn--profile" onClick={handleViewProfile}>
                {currentUserId && seller?.id && currentUserId === seller.id ? 'Edit Profile' : 'View Profile'}
              </button>
              {currentUserId && seller?.id && currentUserId !== seller.id && (
                <button type="button" className="bd-btn bd-btn--chat" onClick={handleChat}>
                  Chat
                </button>
              )}
            </div>
          </div>

          {/* ── More From Seller ── */}
          <div className="bd-card bd-more">
            <h3 className="bd-more__title">More from {seller?.name || 'this Seller'}</h3>

            {loadingMore ? (
              <div className="bd-more__loading">
                <div className="bd-loading__spinner bd-loading__spinner--sm" />
              </div>
            ) : moreProducts.length === 0 ? (
              <p className="bd-more__empty">No other listings from this seller</p>
            ) : (
              <div className="bd-more__list">
                {moreProducts.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="bd-more__item"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('category', (item.type || 'product').toLowerCase());
                      params.set('id', item._id);
                      router.push(`/user-intetface/buy-detail?${params.toString()}`);
                    }}
                  >
                    <div className="bd-more__thumb">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.title} className="bd-more__thumb-img" />
                      ) : (
                        <div className="bd-more__thumb-placeholder">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="bd-more__info">
                      <div className="bd-more__item-title">{item.title}</div>
                      <div className="bd-more__item-price">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {seller && (
              <button type="button" className="bd-more__see-all" onClick={handleViewProfile}>
                See all listings →
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── Post Categories Modal ── */}
      {showPostCategories && (
        <div className="post-modal-overlay" onClick={() => setShowPostCategories(false)}>
          <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="post-modal-close" onClick={() => setShowPostCategories(false)} type="button">×</button>
            <h2 className="post-modal-title">Select Category</h2>
            <div className="post-modal-categories">
              <div className="post-modal-category" onClick={() => { router.push('/user-intetface/post-book'); setShowPostCategories(false); }}>
                <Image src="/home/book.png" alt="Book" className="post-modal-icon" width={100} height={100} /><p>Book</p>
              </div>
              <div className="post-modal-category" onClick={() => { router.push('/user-intetface/post-computer'); setShowPostCategories(false); }}>
                <Image src="/home/computer.png" alt="Computer" className="post-modal-icon" width={100} height={100} /><p>Computer</p>
              </div>
              <div className="post-modal-category" onClick={() => { router.push('/user-intetface/post-phone'); setShowPostCategories(false); }}>
                <Image src="/home/phone.png" alt="Phone" className="post-modal-icon" width={100} height={100} /><p>Phone</p>
              </div>
              <div className="post-modal-category" onClick={() => { router.push('/user-intetface/post-electronics'); setShowPostCategories(false); }}>
                <Image src="/home/electronics.png" alt="Electronics" className="post-modal-icon" width={100} height={100} /><p>Electronics</p>
              </div>
              <div className="post-modal-category" onClick={() => { router.push('/user-intetface/post-service'); setShowPostCategories(false); }}>
                <Image src="/home/ser.png" alt="Service" className="post-modal-icon" width={100} height={100} /><p>Service</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyDetailPage() {
  return (
    <Suspense fallback={<div className="bd-page"><div className="bd-loading"><div className="bd-loading__spinner" /><p className="bd-loading__text">Loading...</p></div></div>}>
      <BuyDetailContent />
    </Suspense>
  );
}