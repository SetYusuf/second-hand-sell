'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import './home.css';
import NotificationDropdownEnhanced from './NotificationDropdownEnhanced';
import ChatDropdownEnhanced from './ChatDropdownEnhanced';
import { useTheme } from '../../contexts/ThemeContext';

function HomeContent() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('eng');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPostCategories, setShowPostCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [hasNewChatMessage, setHasNewChatMessage] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [customAvatar, setCustomAvatar] = useState<string>('');
  // Cart interface for localStorage compatibility
  interface CartItem {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
  }

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [userLetter, setUserLetter] = useState('U');
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category')?.toLowerCase() || '';
  const selectedCategory = rawCategory;

  // Load custom avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('customAvatar');
    if (savedAvatar) {
      setCustomAvatar(savedAvatar);
    }
    
    // Set user letter from localStorage
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userName = userEmail.split('@')[0];
    setUserLetter(userName.charAt(0).toUpperCase());
  }, []);

  // Load cart from localStorage on first render
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

  // Listen for email changes and update profile button
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        const newEmail = e.newValue || 'user@example.com';
        const userName = newEmail.split('@')[0];
        setUserLetter(userName.charAt(0).toUpperCase());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for email changes periodically (for same-tab updates)
  useEffect(() => {
    const checkEmailChange = () => {
      const currentEmail = localStorage.getItem('userEmail');
      if (currentEmail) {
        const userName = currentEmail.split('@')[0];
        setUserLetter(userName.charAt(0).toUpperCase());
      }
    };

    const interval = setInterval(checkEmailChange, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved favorite products from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoriteProducts');
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        const ids = new Set(parsed.map((p) => p._id));
        setFavorites(ids);
      }
    } catch (error) {
      console.error('Failed to load favorite products from storage', error);
    }
  }, []);

  // Product data model
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

  // Notification data model and dataset
  interface NotificationItem {
    id: number;
    name: string;
    text: string;
    time: string;
    avatar: string;
    type: 'like' | 'friend_request' | 'friend_accepted' | 'post';
    read?: boolean;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = searchQuery ? `/api/posts?search=${searchQuery}` : '/api/posts';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notifications: NotificationItem[] = [
    { id: 0, name: 'Lina', text: 'like your post', time: '1mn', avatar: '/notification-image/lina.png', type: 'like' },
    { id: 1, name: 'Bopa', text: 'Sent you a friend request', time: '5h', avatar: '/notification-image/bopa.png', type: 'friend_request' },
    { id: 2, name: 'Leakna', text: 'accepted your friend request', time: '2d', avatar: '/notification-image/leakna.png', type: 'friend_accepted' },
    { id: 3, name: 'Somnag', text: 'added new post', time: '23d', avatar: '/notification-image/somnang.png', type: 'post' },
    { id: 4, name: 'Lina', text: 'like your post', time: '1mp', avatar: '/notification-image/lina.png', type: 'like' },
  ];

  // Chat data model and dataset
  interface ChatItem {
    id: number;
    name: string;
    preview: string;
    time: string;
    avatar: string;
    unread?: boolean;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chats: ChatItem[] = [
    { id: 0, name: 'Lina', preview: 'Hey bro, what are you doing? 😁', time: '11:45pm', avatar: '/notification-image/lina.png', unread: true },
    { id: 1, name: 'Bopa', preview: 'Bro, I finally finished setting up my PC last …', time: 'Sun', avatar: '/notification-image/bopa.png', unread: true },
    { id: 2, name: 'Leakna', preview: 'Thanks again for helping me with my assig…', time: '23 Oct', avatar: '/notification-image/leakna.png', unread: false },
    { id: 3, name: 'Somnag', preview: 'Hey, random question — do you believe ever …', time: '29 Oct', avatar: '/notification-image/somnang.png', unread: false },
    { id: 4, name: 'Lina', preview: 'Can we meet tomorrow morning?', time: '10:12am', avatar: '/notification-image/lina.png', unread: true },
  ];

  const handleProductClick = (product: Product) => {
    const params = new URLSearchParams();
    params.set('category', product.type.toLowerCase());
    params.set('id', product._id);
    router.push(`/user-intetface/buy-detail?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search logic here
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleLangDropdown = () => {
    setLangDropdown(!langDropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const goToChat = () => {
    setHasNewChatMessage(false);
    setShowChatModal(false);
    router.push('/user-intetface/chat');
  };

  const goToSpecificChat = (chat: ChatItem) => {
    setHasNewChatMessage(false);
    setShowChatModal(false);
    router.push(`/user-intetface/inside-chat?name=${encodeURIComponent(chat.name)}&avatar=${encodeURIComponent(chat.avatar)}&msg=${encodeURIComponent(chat.preview)}`);
  };

  const goToNotifications = () => {
    setHasNewNotification(false);
    setShowNotificationModal(false);
    router.push('/user-intetface/notification');
  };

  const switchLanguage = (lang: 'eng' | 'cam') => {
    setCurrentLang(lang);
    setLangDropdown(false);
    console.log(`Switched to ${lang === 'eng' ? 'English' : 'Khmer'}`);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        console.log('Removed from favorites');
      } else {
        newFavorites.add(productId);
        console.log('Added to favorites');
      }

      // Persist favorites to localStorage so they can be viewed later
      try {
        const favoriteProducts = products.filter((p) => newFavorites.has(p._id));
        localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
      } catch (error) {
        console.error('Failed to save favorite products to storage', error);
      }

      return newFavorites;
    });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product._id);
      let newCart;
      
      if (existingItem) {
        // Item already exists, you could increase quantity here if needed
        console.log('Item already in cart:', product.title);
        return prev;
      } else {
        // Add new item to cart - convert to cart format
        const cartItem = {
          id: product._id,
          title: product.title,
          description: product.description,
          price: `$${product.price}`,
          image: product.imageUrl || '/home/computer.png'
        };
        newCart = [...prev, cartItem];
        console.log('Added to cart:', product.title);
      }

      // Persist cart to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(newCart));
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }

      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter(item => item.id !== productId);
      
      // Persist updated cart to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(newCart));
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }

      return newCart;
    });
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const getCartTotal = () => {
    return cart.reduce((total: number, item: { price: string }) => {
      // Extract numeric value from price string (e.g., "$280" -> 280)
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
  };

  // Welcome banner images - placeholder paths 
  const welcomeImages = [
    '/home/bann3.png',
    '/home/bann2.png',
    '/home/bann3.png',
    '/home/bann2.png',
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % welcomeImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + welcomeImages.length) % welcomeImages.length);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.lang-popup')) {
        setLangDropdown(false);
      }
    };

    if (langDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [langDropdown]);

  const filteredProducts = useMemo(() => {
    const base = selectedCategory
      ? products.filter((r) => r.type.toLowerCase().includes(selectedCategory) || r.title.toLowerCase().includes(selectedCategory))
      : products;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.brand.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.price.toString().includes(q)
    );
  }, [products, selectedCategory, searchQuery]);

  const headingText = selectedCategory === 'computer'
    ? 'Computer'
    : selectedCategory === 'phone'
      ? 'Phone'
      : selectedCategory === 'product'
        ? 'Product'
        : selectedCategory === 'book'
          ? 'Book'
          : selectedCategory === 'service'
            ? 'Service'
            : 'Product, Computer, Phone, Book, Service';

  return (
    <>
      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <header className="navbar">
          <div className="icon">
            <Image
              src="/home/lg.png"
              alt="Finding Product Logo"
              className="brand-logo"
              width={240}
              height={80}
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
            <Link href="/user-intetface/home" className="home-inline" aria-label="Home" title="Home">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <Link href="/user-intetface/favorites" className="favorite-nav" aria-label="Favorites" title="Favorites">
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

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <header className="mobile-header">
          <Image
            src="/home/lg.png"
            alt="Finding Product Logo"
            className="mobile-logo"
            width={160}
            height={50}
          />
          <button
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            aria-label="Menu"
            type="button"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </header>

        {/* Mobile Search Bar */}
        <div className="mobile-search-section">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              className="mobile-srch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="mobile-cancel-btn"
                onClick={handleClearSearch}
                aria-label="Cancel"
              >
                &times;
              </button>
            )}
            <button type="submit" className="mobile-search-icon" aria-label="Search">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <Image
              src="/home/lg.png"
              alt="Finding Product Logo"
              className="mobile-menu-logo"
              width={120}
              height={40}
            />
            <button
              className="close-menu"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
              type="button"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>

          <div className="mobile-menu-items">
            <button
              className="mobile-menu-item"
              onClick={() => {
                toggleLangDropdown();
              }}
              type="button"
            >
              <i className="fa fa-globe"></i>
              <span>Language</span>
              <i className="fa fa-chevron-right"></i>
            </button>

            {langDropdown && (
              <div className="mobile-lang-options">
                <button
                  className="mobile-lang-option"
                  onClick={() => {
                    switchLanguage('cam');
                    setLangDropdown(false);
                  }}
                  type="button"
                >
                  <Image src="/home/cam.png" alt="Khmer" width={20} height={20} />
                  <span>ខ្មែរ</span>
                </button>
                <button
                  className="mobile-lang-option"
                  onClick={() => {
                    switchLanguage('eng');
                    setLangDropdown(false);
                  }}
                  type="button"
                >
                  <Image src="/home/eng.png" alt="English" width={20} height={20} />
                  <span>English</span>
                </button>
              </div>
            )}

            <Link href="/user-intetface/home" className="mobile-menu-item">
              <i className="fa fa-home"></i>
              <span>Home</span>
              <i className="fa fa-chevron-right"></i>
            </Link>

            <Link href="/user-intetface/favorites" className="mobile-menu-item">
              <i className="fa fa-heart"></i>
              <span>Favorites</span>
              <i className="fa fa-chevron-right"></i>
            </Link>

            <button
              className="mobile-menu-item mobile-post-btn"
              onClick={() => {
                setShowPostCategories(true);
                setIsMobileMenuOpen(false);
              }}
              type="button"
            >
              <i className="fa fa-plus"></i>
              <span>POST</span>
              <i className="fa fa-chevron-right"></i>
            </button>

            <button
              className="mobile-menu-item"
              onClick={() => {
                setShowChatModal(true);
                setIsMobileMenuOpen(false);
              }}
              type="button"
            >
              <i className="fa fa-comments"></i>
              <span>Messages</span>
              {hasNewChatMessage && <span className="notification-badge">•</span>}
              <i className="fa fa-chevron-right"></i>
            </button>

            <button
              className="mobile-menu-item"
              onClick={() => {
                setShowNotificationModal(true);
                setIsMobileMenuOpen(false);
              }}
              type="button"
            >
              <i className="fa fa-bell"></i>
              <span>Notifications</span>
              {hasNewNotification && <span className="notification-badge">•</span>}
              <i className="fa fa-chevron-right"></i>
            </button>

            <button
              className="mobile-menu-item"
              onClick={() => {
                setShowCartModal(true);
                setIsMobileMenuOpen(false);
              }}
              type="button"
            >
              <i className="fa fa-shopping-cart"></i>
              <span>Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}</span>
              <i className="fa fa-chevron-right"></i>
            </button>

            <Link href="/user-intetface/profile" className="mobile-menu-item">
              {customAvatar ? (
                <Image src={customAvatar} alt="Profile" className="mobile-profile-avatar" width={24} height={24} />
              ) : (
                <div className="mobile-profile-letter">
                  {userLetter}
                </div>
              )}
              <span>Profile</span>
              <i className="fa fa-chevron-right"></i>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={toggleMobileMenu}
          ></div>
        )}
      </div>


      {/* Category Section */}
      <section className="category-section">
        <div className="category" onClick={() => router.push('/user-intetface/home?category=book')}>
          <Image
            src="/home/book.png"
            alt="Book"
            className="category-icon"
            width={100}
            height={100}
          />
          <p>Book</p>
        </div>
        <div className="category" onClick={() => router.push('/user-intetface/home?category=computer')}>
          <Image src="/home/computer.png"
            alt="Computer"
            className="category-icon"
            width={100}
            height={100} />
          <p>Computer</p>
        </div>
        <div className="category" onClick={() => router.push('/user-intetface/home?category=phone')}>
          <Image src="/home/phone.png"
            alt="Phone"
            className="category-icon"
            width={100}
            height={100} />
          <p>Phone</p>
        </div>
        <div className="category" onClick={() => router.push('/user-intetface/home?category=product')}>
          <Image src="/home/electronics.png"
            alt="Electronics"
            className="category-icon"
            width={100}
            height={100} />
          <p>Electronics</p>
        </div>
        <div className="category" onClick={() => router.push('/user-intetface/home?category=service')}>
          <Image src="/home/ser.png"
            alt="Service"
            className="category-icon"
            width={100}
            height={100} />
          <p>Service</p>
        </div>
      </section>


      {/* Welcome Banner Section */}
      <section className="welcome-banner-section">
        <div className="welcome-carousel">
          <button
            className="carousel-btn carousel-btn-left"
            onClick={prevSlide}
            aria-label="Previous slide"
            type="button"
          >
            <i className="fa fa-chevron-left"></i>
          </button>

          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {welcomeImages.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <div className="banner-image-wrapper">
                    <Image
                      src={image}
                      alt={`Welcome banner ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                    <div className="banner-overlay">
                      <div className="banner-content">


                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn carousel-btn-right"
            onClick={nextSlide}
            aria-label="Next slide"
            type="button"
          >
            <i className="fa fa-chevron-right"></i>
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {welcomeImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Listing Section */}
      <section className="product-list">
        <h1>
          Our <span>{headingText}</span>
        </h1>

        <div className="product-list-box">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
              <p>Loading posts...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fa fa-inbox" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#999' }}></i>
              <p>No posts found</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Be the first to post an item!</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
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
                <button
                  className={`favorite-btn ${favorites.has(product._id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product._id);
                  }}
                  aria-label="Add to favorites"
                  type="button"
                >
                  <i className="fa fa-heart"></i>
                </button>
              </div>

              <div className="product-info">
                <h2>{product.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                <div className="price">${product.price}</div>
                <div className="product-buttons">
                  <button
                    className="product-btn primary-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams();
                      params.set('category', product.type.toLowerCase());
                      params.set('id', product._id);
                      router.push(`/user-intetface/buy-detail?${params.toString()}`);
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
          ))
          )}
        </div>
      </section>

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
                <Image
                  src="/home/book.png"
                  alt="Book"
                  className="post-modal-icon"
                  width={100}
                  height={100}
                />
                <p>Book</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-computer');
                setShowPostCategories(false);
              }}>
                <Image
                  src="/home/computer.png"
                  alt="Computer"
                  className="post-modal-icon"
                  width={100}
                  height={100}
                />
                <p>Computer</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-phone');
                setShowPostCategories(false);
              }}>
                <Image
                  src="/home/phone.png"
                  alt="Phone"
                  className="post-modal-icon"
                  width={100}
                  height={100}
                />
                <p>Phone</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-electronics');
                setShowPostCategories(false);
              }}>
                <Image
                  src="/home/electronics.png"
                  alt="Electronics"
                  className="post-modal-icon"
                  width={100}
                  height={100}
                />
                <p>Electronics</p>
              </div>
              <div className="post-modal-category" onClick={() => {
                router.push('/user-intetface/post-service');
                setShowPostCategories(false);
              }}>
                <Image
                  src="/home/ser.png"
                  alt="Service"
                  className="post-modal-icon"
                  width={100}
                  height={100}
                />
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
                  <button
                    className="go-to-chat-btn"
                    onClick={goToChat}
                  >
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

      {/* Enhanced Notification Dropdown */}
      <NotificationDropdownEnhanced
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onNotificationClick={(notification) => {
          console.log('Notification clicked:', notification);
          goToNotifications();
        }}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
