'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotificationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [likedNotifications, setLikedNotifications] = useState<Set<number>>(new Set([0, 3, 4]));


  const handleClearSearch = () => setSearchQuery('');

  // Notification data model and dataset
  interface NotificationItem {
    id: number;
    name: string;
    text: string;
    time: string;
    avatar: string;
    type: 'like' | 'friend_request' | 'friend_accepted' | 'post' | string;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notifications: NotificationItem[] = [
    { id: 0, name: 'Lina', text: 'like your post', time: '1mn', avatar: '/notification-image/lina.png', type: 'like' },
    { id: 1, name: 'Bopa', text: 'Sent you a friend request', time: '5h', avatar: '/notification-image/bopa.png', type: 'friend_request' },
    { id: 2, name: 'Leakna', text: 'accepted your friend request', time: '2d', avatar: '/notification-image/leakna.png', type: 'friend_accepted' },
    { id: 3, name: 'Somnag', text: 'added new post', time: '23d', avatar: '/notification-image/somnang.png', type: 'post' },
    { id: 4, name: 'Lina', text: 'like your post', time: '1mp', avatar: '/notification-image/lina.png', type: 'like' },
    { id: 5, name: 'Lina', text: 'like your post', time: '1mn', avatar: '/notification-image/lina.png', type: 'like' },
    { id: 6, name: 'Bopa', text: 'Sent you a friend request', time: '5h', avatar: '/notification-image/bopa.png', type: 'friend_request' },
    { id: 7, name: 'Leakna', text: 'accepted your friend request', time: '2d', avatar: '/notification-image/leakna.png', type: 'friend_accepted' },
    { id: 8, name: 'Somnag', text: 'added new post', time: '23d', avatar: '/notification-image/somnang.png', type: 'post' },
    { id: 9, name: 'Lina', text: 'like your post', time: '1mp', avatar: '/notification-image/lina.png', type: 'like' },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching:', searchQuery);
  };

  const toggleLike = (id: number) => {
    setLikedNotifications((prev) => {
      const newSet = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleConfirmFriend = (id: number) => console.log('Confirm friend:', id);
  const handleDeleteFriend = (id: number) => console.log('Delete friend:', id);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notifications;
    return notifications.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.text.toLowerCase().includes(q) ||
        n.time.toLowerCase().includes(q)
    );
  }, [notifications, searchQuery]);

  return (
    <div className="notification-page">

      {/* ------------------- NAVBAR ------------------- */}
      <div className="topbar">
        <header className="navbar">
          <div className="icon">
            <Image src="/home/lg.png" alt="Logo" className="brand-logo" width={120} height={40} />


            <Link href="/user-intetface/home" className="home-inline">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>

            <Link href="#" className="favorite-nav">
              <i className="fa fa-heart"></i>
            </Link>
          </div>

          {/* Search Bar */}
          <form className="search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search...."
              className="srch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button className="cancel-btn" type="button" onClick={handleClearSearch}>
                &times;
              </button>
            )}

            <button type="submit" className="search-icon">
              <i className="fa fa-search"></i>
            </button>
          </form>

          {/* ------------------ YOUR ADDED MENU ------------------ */}
          <nav className="navbar-menu">
            <ul>

              <li>
                <Link href="/user-intetface/chat" aria-label="Messages" title="Messages">
                  <i className="fa fa-comments"></i>
                </Link>
              </li>

              <li>
                <Link href="/user-intetface/notification" aria-label="Notifications" title="Notifications">
                  <i className="fa fa-bell"></i>
                </Link>
              </li>

              <li>
                <Link href="/login" aria-label="Login" title="Login">
                  <i className="fa fa-user"></i>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      {/* ------------------- NOTIFICATIONS CONTENT ------------------- */}
      <div className="notification-content-wrapper">
        <div className="notification-content">
          <div className="notification-list">
            {filtered.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-avatar">
                  <Image
                    src={notification.avatar}
                    alt={notification.name}
                    width={50}
                    height={50}
                    className="avatar-image"
                  />
                </div>

                <div className="notification-info">
                  <div className="notification-text">
                    <span className="notification-name">{notification.name}</span>
                    <span> {notification.text}</span>
                  </div>

                  <div className="notification-time">{notification.time}</div>

                  {notification.type === 'friend_request' && (
                    <div className="friend-request-buttons">
                      <button className="confirm-btn" onClick={() => handleConfirmFriend(notification.id)}>
                        Confirm
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteFriend(notification.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className={`notification-heart ${likedNotifications.has(notification.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(notification.id)}
                >
                  <i className="fa fa-heart"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
