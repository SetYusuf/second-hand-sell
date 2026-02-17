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
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPostCategories, setShowPostCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [hasNewChatMessage, setHasNewChatMessage] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [customAvatar, setCustomAvatar] = useState<string>('');
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category')?.toLowerCase() || '';
  const selectedCategory = rawCategory;

  // Load custom avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('customAvatar');
    if (savedAvatar) {
      setCustomAvatar(savedAvatar);
    }
  }, []);

  // Listen for email changes and update profile button
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        // Force re-render to update the first letter
        setCustomAvatar(prev => prev); // This triggers a re-render
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for email changes periodically (for same-tab updates)
  useEffect(() => {
    const checkEmailChange = () => {
      const currentEmail = localStorage.getItem('userEmail');
      // Just trigger a re-render if email exists
      if (currentEmail) {
        setCustomAvatar(prev => prev);
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
        const ids = new Set(parsed.map((p) => p.id));
        setFavorites(ids);
      }
    } catch (error) {
      console.error('Failed to load favorite products from storage', error);
    }
  }, []);

  // Get user first letter for default avatar
  const getUserFirstLetter = () => {
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userName = userEmail.split('@')[0];
    return userName.charAt(0).toUpperCase();
  };

  // Product data model and dataset
  interface Product {
    id: number;
    title: 'Computer' | 'Phone' | 'Product' | 'Book' | 'Service' | string;
    description: string;
    price: string;
    image: string;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products: Product[] = [
    {
      id: 1,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$280',
      image: '/home/computer.png',
    },
    {
      id: 2,
      title: 'Phone',
      description: 'Phone for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$250',
      image: '/home/phone.png',
    },
    {
      id: 3,
      title: 'Product',
      description: 'Product for Selling \n location near RUPP\n 90% Condition, 100% working',
      price: '$200',
      image: '/home/electronics.png',
    },
    {
      id: 4,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$1200',
      image: '/home/computer.png',
    },
    {
      id: 5,
      title: 'Computer ',
      description: 'Computer for Selling \nlocation Phnom Penh \n 98% Condition, 100% working',
      price: '$320',
      image: '/home/computer.png',
    },
    {
      id: 6,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$450',
      image: '/home/computer.png',
    },
    {
      id: 7,
      title: 'Product',
      description: 'Product for Selling \n location near Olympic Stadium\n 98% Condition, 100% working',
      price: '$180',
      image: '/home/electronics.png',
    },
    {
      id: 8,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1500',
      image: '/home/computer.png',
    },

    {
      id: 9,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$280',
      image: '/home/computer.png',
    },
    {
      id: 10,
      title: 'Phone',
      description: 'Phone for Selling \n location TK \n98% Condition, 100% working',
      price: '$150',
      image: '/home/phone.png',
    },
    {
      id: 11,
      title: 'Product',
      description: 'Product for Selling \n location near RUPP\n 90% Condition, 100% working',
      price: '$200',
      image: '/home/electronics.png',
    },
    {
      id: 12,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1200',
      image: '/home/computer.png',
    },
    {
      id: 13,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Phnom Penh \n 98% Condition, 100% working',
      price: '$320',
      image: '/home/computer.png',
    },
    {
      id: 14,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$450',
      image: '/home/computer.png',
    },
    {
      id: 15,
      title: 'Product',
      description: 'Product for Selling \n location near Olympic Stadium\n 98% Condition, 100% working',
      price: '$180',
      image: '/home/electronics.png',
    },
    {
      id: 16,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1500',
      image: '/home/computer.png',
    },

    {
      id: 17,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$280',
      image: '/home/computer.png',
    },
    {
      id: 18,
      title: 'Phone',
      description: 'Phone for Selling \n location TK \n98% Condition, 100% working',
      price: '$150',
      image: '/home/phone.png',
    },
    {
      id: 19,
      title: 'Product',
      description: 'Product for Selling \n location near RUPP\n 90% Condition, 100% working',
      price: '$200',
      image: '/home/electronics.png',
    },
    {
      id: 20,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1200',
      image: '/home/computer.png',
    },
    {
      id: 21,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Phnom Penh \n 98% Condition, 100% working',
      price: '$320',
      image: '/home/computer.png',
    },
    {
      id: 22,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$450',
      image: '/home/computer.png',
    },
    {
      id: 23,
      title: 'Product',
      description: 'Product for Selling \n location near Olympic Stadium\n 98% Condition, 100% working',
      price: '$180',
      image: '/home/electronics.png',
    },
    {
      id: 24,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1500',
      image: '/home/computer.png',
    },

    {
      id: 25,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Sen Sok \n 98% Condition, 100% working',
      price: '$280',
      image: '/home/computer.png',
    },
    {
      id: 26,
      title: 'Phone',
      description: 'Phone for Selling \n location TK \n98% Condition, 100% working',
      price: '$150',
      image: '/home/phone.png',
    },
    {
      id: 27,
      title: 'Product',
      description: 'Product for Selling \n location near RUPP\n 90% Condition, 100% working',
      price: '$200',
      image: '/home/electronics.png',
    },
    {
      id: 28,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1200',
      image: '/home/computer.png',
    },
    {
      id: 29,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Phnom Penh \n 98% Condition, 100% working',
      price: '$320',
      image: '/home/computer.png',
    },
    {
      id: 30,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$450',
      image: '/home/computer.png',
    },
    {
      id: 31,
      title: 'Product',
      description: 'Product for Selling \n location near Olympic Stadium\n 98% Condition, 100% working',
      price: '$180',
      image: '/home/electronics.png',
    },
    {
      id: 32,
      title: 'Computer',
      description: 'Computer for Selling \nlocation Toul Kork \n 98% Condition, 100% working',
      price: '$1500',
      image: '/home/computer.png',
    },
    {
      id: 33,
      title: 'Book',
      description: 'Java Programming \n Author: John Doe',
      price: '$25',
      image: '/home/book.png',
    },
    {
      id: 34,
      title: 'Book',
      description: 'Clean Code \n Author: Robert C. Martin',
      price: '$30',
      image: '/home/book.png',
    },
    {
      id: 35,
      title: 'Book',
      description: 'The Pragmatic Programmer \n Author: Andrew Hunt',
      price: '$35',
      image: '/home/book.png',
    },
    {
      id: 36,
      title: 'Service',
      description: 'House Cleaning \n Professional cleaning service',
      price: '$50',
      image: '/home/ser.png',
    },
    {
      id: 37,
      title: 'Service',
      description: 'AC Repair \n Fast and reliable AC repair',
      price: '$40',
      image: '/home/ser.png',
    },
    {
      id: 38,
      title: 'Service',
      description: 'Plumbing Service \n Expert plumbing solutions',
      price: '$60',
      image: '/home/ser.png',
    },
  ];

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

  const toggleFavorite = (productId: number) => {
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
        const favoriteProducts = products.filter((p) => newFavorites.has(p.id));
        localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
      } catch (error) {
        console.error('Failed to save favorite products to storage', error);
      }

      return newFavorites;
    });
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
      ? products.filter((r) => r.title.toLowerCase().includes(selectedCategory))
      : products;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.price.toLowerCase().includes(q)
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
                  onClick={toggleTheme}
                  className="theme-toggle-nav"
                  aria-label="Toggle theme"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  type="button"
                >
                  <i className={`fa ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                </button>
              </li>
              <li>
                <Link href="/user-intetface/profile" aria-label="Profile" title="Profile" className="profile-link">
                  {customAvatar ? (
                    <Image src={customAvatar} alt="Profile" className="profile-nav-avatar" width={32} height={32} />
                  ) : (
                    <div className="profile-nav-letter">
                      {getUserFirstLetter()}
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
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              type="button"
            >
              <i className={`fa ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              <i className="fa fa-chevron-right"></i>
            </button>

            <Link href="/user-intetface/profile" className="mobile-menu-item">
              {customAvatar ? (
                <Image src={customAvatar} alt="Profile" className="mobile-profile-avatar" width={24} height={24} />
              ) : (
                <div className="mobile-profile-letter">
                  {getUserFirstLetter()}
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
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <button
                  className={`favorite-btn ${favorites.has(product.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Add to favorites"
                  type="button"
                >
                  <i className="fa fa-heart"></i>
                </button>
              </div>

              <div className="product-info">
                <h2>{product.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                <div className="price">{  product.price}</div>
                <div className="product-buttons">
                  <button 
                    className="product-btn primary-action"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('category', product.title.toLowerCase());
                      params.set('id', product.id.toString());
                      router.push(`/user-intetface/buy-detail?${params.toString()}`);
                    }}
                    type="button"
                  >
                    <i className="fa fa-shopping-bag"></i>
                    Buy Now
                  </button>
                  <button 
                    className="product-btn secondary-action"
                    onClick={() => {
                      // Add to cart functionality or other action
                      console.log('Added to cart:', product.title);
                    }}
                    type="button"
                  >
                    <i className="fa fa-cart-plus"></i>
                    Add to Cart
                  </button>
                  <button 
                    className="product-btn tertiary-action"
                    onClick={() => {
                      // Save to favorites functionality
                      toggleFavorite(product.id);
                    }}
                    type="button"
                  >
                    <i className="fa fa-heart"></i>
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
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
