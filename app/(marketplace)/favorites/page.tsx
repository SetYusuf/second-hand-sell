'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../home/home.css';
import NotificationDropdownEnhanced from '../home/NotificationDropdownEnhanced';
import { getStoredCustomAvatar, getStoredUserEmail } from '@/lib/auth-storage';

// NOTE: The home page saves the full Product object to localStorage under
// `favoriteProducts`. The shape uses `_id`, `imageUrl`, and a numeric `price`.
// This interface must match that shape so images and prices render correctly.
interface FavoriteProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  type: string;
  condition?: string;
  location?: string;
  brand?: string;
}

interface CartItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

interface NotificationItem {
  id: number;
  name: string;
  text: string;
  time: string;
  avatar: string;
  type: 'like' | 'friend_request' | 'friend_accepted' | 'post';
  read?: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostCategories, setShowPostCategories] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [hasNewChatMessage, setHasNewChatMessage] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [customAvatar, setCustomAvatar] = useState<string>('');
  const [userLetter, setUserLetter] = useState('U');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('eng');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoriteProducts');
      if (stored) {
        const parsed: FavoriteProduct[] = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Failed to read favorite products from storage', error);
    }
  }, []);

  // Load custom avatar and user letter from localStorage
  useEffect(() => {
    const savedAvatar = getStoredCustomAvatar();
    if (savedAvatar) {
      setCustomAvatar(savedAvatar);
    }
    const userEmail = getStoredUserEmail() || 'user@example.com';
    const userName = userEmail.split('@')[0];
    setUserLetter(userName.charAt(0).toUpperCase());
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setCart(parsed);
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  }, []);

  const handleProductClick = (product: FavoriteProduct) => {
    const params = new URLSearchParams();
    params.set('category', (product.type || '').toLowerCase());
    params.set('id', product._id);
    router.push(`/user-intetface/buy-detail?${params.toString()}`);
  };

  const addToCart = (product: FavoriteProduct) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product._id);
      if (existingItem) {
        console.log('Item already in cart:', product.title);
        return prev;
      }
      const cartItem: CartItem = {
        id: product._id,
        title: product.title,
        description: product.description,
        price: `$${product.price}`,
        image: product.imageUrl || '/home/computer.png'
      };
      const newCart = [...prev, cartItem];
      try {
        localStorage.setItem('cart', JSON.stringify(newCart));
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }
      return newCart;
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/user-intetface/home?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleLangDropdown = () => {
    setLangDropdown(!langDropdown);
  };

  const switchLanguage = (lang: 'eng' | 'cam') => {
    setCurrentLang(lang);
    setLangDropdown(false);
    console.log(`Switched to ${lang === 'eng' ? 'English' : 'Khmer'}`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter(item => item.id !== productId);
      try {
        localStorage.setItem('cart', JSON.stringify(newCart));
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }
      return newCart;
    });
  };

  const getCartItemCount = () => cart.length;

  const getCartTotal = () => {
    return cart.reduce((total: number, item: { price: string }) => {
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
  };

  const goToChat = () => {
    setHasNewChatMessage(false);
    setShowChatModal(false);
    router.push('/user-intetface/chat');
  };

  const goToNotifications = () => {
    setHasNewNotification(false);
    setShowNotificationModal(false);
    router.push('/user-intetface/notification');
  };

  const notifications: NotificationItem[] = [
    { id: 0, name: 'Lina', text: 'like your post', time: '1mn', avatar: '/notification-image/lina.png', type: 'like' },
    { id: 1, name: 'Bopa', text: 'Sent you a friend request', time: '5h', avatar: '/notification-image/bopa.png', type: 'friend_request' },
    { id: 2, name: 'Leakna', text: 'accepted your friend request', time: '2d', avatar: '/notification-image/leakna.png', type: 'friend_accepted' },
    { id: 3, name: 'Somnag', text: 'added new post', time: '23d', avatar: '/notification-image/somnang.png', type: 'post' },
  ];

  const hasFavorites = favorites.length > 0;

  return (
    <div className="favorites-page">
      {/* Full navbar - forced white for visibility */}
      <div className="topbar" style={{ background: '#ffffff' }}>
        <header className="navbar">
          <div className="icon">
            <Image
              src="/home/lg.png"
              alt="Finding Product Logo"
              className="brand-logo"
              width={180}
              height={60}
            />
            <div className="lang-popup">
              <button
                className="lang-btn"
                onClick={toggleLangDropdown}
                aria-label="Language"
                type="button"
              >
                <Image
                  src={`/home/${currentLang}.png`}
                  alt={currentLang === 'eng' ? 'English' : 'Khmer'}
                  className="lang-icon"
                  width={24}
                  height={24}
                />
              </button>
              {langDropdown && (
                <div className="lang-dropdown show">
                  <button
                    className="cam-btn"
                    onClick={() => switchLanguage('cam')}
                    aria-label="Khmer"
                    type="button"
                  >
                    <Image src="/home/cam.png" alt="Khmer" width={24} height={24} />
                  </button>
                  <button
                    className="eng-btn"
                    onClick={() => switchLanguage('eng')}
                    aria-label="English"
                    type="button"
                  >
                    <Image src="/home/eng.png" alt="English" width={24} height={24} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => router.back()}
              className="home-inline"
              aria-label="Back"
              title="Back"
              type="button"
            >
              <svg viewBox="0 0 24 24" width={24} height={24}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <Link
              href="/user-intetface/home"
              className="home-inline"
              aria-label="Home"
              title="Home"
            >
              <svg viewBox="0 0 24 24" width={20} height={20}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <Link
              href="/user-intetface/favorites"
              className="favorite-nav"
              aria-label="Favorites"
              title="Favorites"
            >
              <i className="fa fa-heart"></i>
            </Link>
          </div>

          {/* Search Section */}
          <form className="search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              className="srch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClearSearch}
                aria-label="Cancel"
              >
                &times;
              </button>
            )}
            <button type="submit" className="search-icon" aria-label="Search">
              <i className="fa fa-search"></i>
            </button>
          </form>

          {/* Navbar Menu */}
          <nav className="navbar-menu">
            <ul>
              <li className="sell">
                <button
                  onClick={() => setShowPostCategories(true)}
                  className="sell-inline"
                  type="button"
                >
                  POST
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="chat-btn"
                  aria-label="Messages"
                  title="Messages"
                  type="button"
                >
                  <i className="fa fa-comments"></i>
                  {hasNewChatMessage && <span className="chat-notification-dot"></span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="notification-btn"
                  aria-label="Notifications"
                  title="Notifications"
                  type="button"
                >
                  <i className="fa fa-bell"></i>
                  {hasNewNotification && <span className="notification-badge-dot"></span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowCartModal(true)}
                  className="cart-btn"
                  aria-label="Cart"
                  title="View Cart"
                  type="button"
                >
                  <i className="fa fa-shopping-cart"></i>
                  {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
                </button>
              </li>
              <li>
                <Link href="/user-intetface/profile" aria-label="Profile" title="Profile" className="profile-link">
                  {customAvatar ? (
                    <Image src={customAvatar} alt="Profile" className="profile-nav-avatar" width={32} height={32} />
                  ) : (
                    <div className="profile-nav-letter">
                      {userLetter}
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <main className="product-list" style={{ paddingTop: '120px' }}>
        <h1>
          Your <span>Saved Products</span>
        </h1>

        {!hasFavorites && (
          <div
            style={{
              maxWidth: 600,
              margin: '40px auto',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <p style={{ fontSize: 18, marginBottom: 8 }}>No saved products yet.</p>
            <p style={{ marginBottom: 16 }}>
              Browse the home page and click <strong>Save</strong> on any product to see it here.
            </p>
            <Link href="/user-intetface/home" className="sell-inline">
              Go to Home
            </Link>
          </div>
        )}

        {hasFavorites && (
          <div className="product-list-box">
            {favorites.map((product) => (
              <div
                key={product._id}
                className="product-card clickable"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container">
                  <Image
                    src={product.imageUrl || '/home/computer.png'}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h2>{product.title}</h2>
                  <div className="price">${product.price}</div>
                  <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                  <div className="product-buttons">
                    <button
                      className="product-btn primary-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      type="button"
                    >
                      <i className="fa fa-shopping-bag"></i>
                      Buy Now
                    </button>
                    <button
                      className="product-btn secondary-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      type="button"
                    >
                      <i className="fa fa-cart-plus"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Categories Modal */}
      {showPostCategories && (
        <div className="post-modal-overlay" onClick={() => setShowPostCategories(false)}>
          <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="post-modal-close"
              onClick={() => setShowPostCategories(false)}
              type="button"
            >
              ×
            </button>
            <h2 className="post-modal-title">Select Category</h2>
            <div className="post-modal-categories">
              <div
                className="post-modal-category"
                onClick={() => {
                  router.push('/user-intetface/post-book');
                  setShowPostCategories(false);
                }}
              >
                <Image src="/home/book.png" alt="Book" className="post-modal-icon" width={100} height={100} />
                <p>Book</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-computer');
                setShowPostCategories(false);
              }}>
                <Image src="/home/computer.png" alt="Computer" className="post-modal-icon" width={100} height={100} />
                <p>Computer</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-phone');
                setShowPostCategories(false);
              }}>
                <Image src="/home/phone.png" alt="Phone" className="post-modal-icon" width={100} height={100} />
                <p>Phone</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-electronics');
                setShowPostCategories(false);
              }}>
                <Image src="/home/electronics.png" alt="Electronics" className="post-modal-icon" width={100} height={100} />
                <p>Electronics</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-service');
                setShowPostCategories(false);
              }}>
                <Image src="/home/ser.png" alt="Service" className="post-modal-icon" width={100} height={100} />
                <p>Service</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Messages</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowChatModal(false)}
                aria-label="Close"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {hasNewChatMessage ? (
                <div className="chat-message-preview">
                  <div className="message-item" onClick={goToChat}>
                    <div className="message-avatar">
                      <i className="fa fa-user-circle"></i>
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender-name">John Doe</span>
                        <span className="message-time">2 min ago</span>
                      </div>
                      <div className="message-text">
                        Hi! Is this item still available?
                      </div>
                    </div>
                    <div className="message-indicator">
                      <span className="new-message-dot"></span>
                    </div>
                  </div>
                  <button className="go-to-chat-btn" onClick={goToChat}>
                    <i className="fa fa-comments"></i>
                    Go to Chat
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fa fa-comments"></i>
                  <p>No new messages</p>
                  <p>Your conversations will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Shopping Cart ({getCartItemCount()} items)</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCartModal(false)}
                aria-label="Close"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body cart-body">
              {cart.length > 0 ? (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-price">{item.price}</p>
                        <p className="cart-item-description" style={{ fontSize: '12px', color: '#666' }}>
                          {item.description.split('\n')[0]}
                        </p>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          className="remove-from-cart-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          type="button"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-summary">
                    <div className="cart-total">
                      <div className="cart-items-count">
                        <span>Items: {cart.length}</span>
                      </div>
                      <div className="cart-price-total">
                        <span>Total: ${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="checkout-btn">
                      <i className="fa fa-credit-card"></i>
                      Proceed to Checkout (${getCartTotal().toFixed(2)})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-cart">
                  <i className="fa fa-shopping-cart"></i>
                  <p>Your cart is empty</p>
                  <p>Browse products and add them to your cart</p>
                  <button
                    className="continue-shopping-btn"
                    onClick={() => setShowCartModal(false)}
                    type="button"
                  >
                    <i className="fa fa-arrow-left"></i>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Dropdown */}
      <NotificationDropdownEnhanced
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onNotificationClick={() => {
          goToNotifications();
        }}
      />
    </div>
  );
}