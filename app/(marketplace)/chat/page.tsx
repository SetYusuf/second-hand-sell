'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage';
import './chat.css';

interface ConversationItem {
  _id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function ChatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversations = async () => {
    try {
      const token = getStoredAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserId(getStoredUserId());
    fetchConversations();

    // Poll for new conversations every 4 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchConversations();
    }, 4000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClearSearch = () => setSearchQuery('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.participant.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
            <Link href="/user-intetface/favorites" className="favorite-nav" aria-label="Favorites" title="Favorites">
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
                <Link href="/user-intetface/profile" aria-label="Profile" title="Profile">
                  <i className="fa fa-user"></i>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <div className="chat-content-wrapper">
        <div className="chat-list">
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>Loading conversations...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
              No conversations yet. Start chatting with a seller!
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c._id}
                className={`chat-item ${currentUserId && c.participant.id === currentUserId ? 'active' : ''}`}
                onClick={() =>
                  router.push(
                    `/user-intetface/inside-chat?conversationId=${c._id}&userId=${c.participant.id}&name=${encodeURIComponent(
                      c.participant.name
                    )}&avatar=${encodeURIComponent(c.participant.avatar || '/notification-image/lina.png')}`
                  )
                }
              >
                <div className="chat-avatar">
                  <Image
                    src={c.participant.avatar || '/notification-image/lina.png'}
                    alt={c.participant.name}
                    width={50}
                    height={50}
                    className="avatar-image"
                  />
                </div>
                <div className="chat-info">
                  <div className="chat-header">
                    <span className="chat-name">{c.participant.name}</span>
                    <span className="chat-time">{formatTime(c.lastMessageAt)}</span>
                  </div>
                  <div className="chat-preview">{c.lastMessage}</div>
                </div>
                {c.unreadCount > 0 && (
                  <span className="chat-unread-badge">{c.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
