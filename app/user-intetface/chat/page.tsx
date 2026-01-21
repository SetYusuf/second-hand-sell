'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './chat.css';

export default function ChatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [likedChats, setLikedChats] = useState<Set<number>>(new Set([0, 3]));

  // Chat data model and dataset
  interface ChatItem {
    id: number;
    name: string;
    preview: string;
    time: string;
    avatar: string;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chats: ChatItem[] = [
    { id: 0, name: 'Lina', preview: 'Hey bro, what are you doing? 😁', time: '11:45pm', avatar: '/notification-image/lina.png' },
    { id: 1, name: 'Bopa', preview: 'Bro, I finally finished setting up my PC last …', time: 'Sun', avatar: '/notification-image/bopa.png' },
    { id: 2, name: 'Leakna', preview: 'Thanks again for helping me with my assig…', time: '23 Oct', avatar: '/notification-image/leakna.png' },
    { id: 3, name: 'Somnag', preview: 'Hey, random question — do you believe ever …', time: '29 Oct', avatar: '/notification-image/somnang.png' },
    { id: 4, name: 'Lina', preview: 'Can we meet tomorrow morning?', time: '10:12am', avatar: '/notification-image/lina.png' },
    { id: 5, name: 'Lina', preview: 'Hey bro, what are you doing? 😁', time: '11:45pm', avatar: '/notification-image/lina.png' },
    { id: 6, name: 'Bopa', preview: 'Bro, I finally finished setting up my PC last …', time: 'Sun', avatar: '/notification-image/bopa.png' },
    { id: 7, name: 'Leakna', preview: 'Thanks again for helping me with my assig…', time: '23 Oct', avatar: '/notification-image/leakna.png' },
    { id: 8, name: 'Somnag', preview: 'Hey, random question — do you believe ever …', time: '29 Oct', avatar: '/notification-image/somnang.png' },
    { id: 9, name: 'Lina', preview: 'Can we meet tomorrow morning?', time: '10:12am', avatar: '/notification-image/lina.png' },
    { id: 10, name: 'Lina', preview: 'Hey bro, what are you doing? 😁', time: '11:45pm', avatar: '/notification-image/lina.png' },
    { id: 11, name: 'Bopa', preview: 'Bro, I finally finished setting up my PC last …', time: 'Sun', avatar: '/notification-image/bopa.png' },
    { id: 12, name: 'Leakna', preview: 'Thanks again for helping me with my assig…', time: '23 Oct', avatar: '/notification-image/leakna.png' },
    { id: 13, name: 'Somnag', preview: 'Hey, random question — do you believe ever …', time: '29 Oct', avatar: '/notification-image/somnang.png' },
    { id: 14, name: 'Lina', preview: 'Can we meet tomorrow morning?', time: '10:12am', avatar: '/notification-image/lina.png' },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClearSearch = () => setSearchQuery('');

  const toggleLike = (id: number) => {
    setLikedChats((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Client-side search filter
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
  }, [chats, searchQuery]);

  return (
    <div className="chat-page">
      <div className="topbar">
        <header className="navbar">
          <div className="icon">
            <Image src="/home/lg.png" alt="Logo" className="brand-logo" width={120} height={40} />
            <Link href="/user-intetface/home" className="home-inline" aria-label="Home" title="Home">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <Link href="#" className="favorite-nav" aria-label="Favorites" title="Favorites">
              <i className="fa fa-heart"></i>
            </Link>
          </div>
          {/* Search box */}
          <form className="search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Chat..."
              className="srch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="cancel-btn" type="button" onClick={handleClearSearch} aria-label="Clear">
                &times;
              </button>
            )}
            <button type="submit" className="search-icon" aria-label="Search">
              <i className="fa fa-search"></i>
            </button>
          </form>

          <nav className="navbar-menu">
            <ul>
              <li>
                <Link href="/chat" aria-label="Messages" title="Messages">
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

      <div className="chat-content-wrapper">
        <div className="chat-list">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="chat-item"
              onClick={() => router.push(`/user-intetface/inside-chat?name=${encodeURIComponent(c.name)}&avatar=${encodeURIComponent(c.avatar)}&msg=${encodeURIComponent(c.preview)}`)}
            >
              <div className="chat-avatar">
                <Image src={c.avatar} alt={c.name} width={50} height={50} className="avatar-image" />
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{c.name}</span>
                  <span className="chat-time">{c.time}</span>
                </div>
                <div className="chat-preview">{c.preview}</div>
              </div>
              <button
                className={`chat-heart ${likedChats.has(c.id) ? 'liked' : ''}`}
                onClick={() => toggleLike(c.id)}
                aria-label="Favorite"
                type="button"
              >
                <i className="fa fa-heart"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
