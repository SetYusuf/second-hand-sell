'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocket } from '../../contexts/SocketContext';
import '../chat/chat.css';
import { getCurrentUserIdFromStorage, getProfileRouteForUser } from '@/lib/profile-utils';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

function InsideChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socket } = useSocket();

  const otherUserId = searchParams.get('userId') || '';
  const initialConversationId = searchParams.get('conversationId') || '';
  const paramName = searchParams.get('name') || 'User';
  const paramAvatar = searchParams.get('avatar') || '/notification-image/lina.png';
  const initialMsg = searchParams.get('msg') || '';

  const [conversationId, setConversationId] = useState(initialConversationId);
  const [participant, setParticipant] = useState({ id: otherUserId, name: paramName, avatar: paramAvatar });
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState(initialConversationId ? '' : initialMsg);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUserId(getCurrentUserIdFromStorage());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async (convId: string) => {
    try {
      const token = getStoredAuthToken();
      const res = await fetch(`/api/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        if (data.participant) {
          setParticipant({
            id: data.participant.id,
            name: data.participant.name,
            avatar: data.participant.avatar || paramAvatar,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    if (initialConversationId) {
      loadConversation(initialConversationId);
    } else {
      setLoading(false);
    }
  }, [initialConversationId, otherUserId, paramAvatar, paramName]);

  // Listen for live incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      if (conversationId && msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      } else if (!conversationId && msg.senderId === otherUserId) {
        setConversationId(msg.conversationId);
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversationId, otherUserId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !participant.id) return;

    setText('');

    try {
      const token = getStoredAuthToken();
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: participant.id, text: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        const payload = data.message;
        if (!conversationId) setConversationId(data.conversationId);
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === payload._id);
          return exists ? prev : [...prev, payload];
        });
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      <div className="topbar">
        <header className="navbar">
          <div className="icon">
            <button
              onClick={() => router.push('/user-intetface/chat')}
              aria-label="Back"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <Image src="/home/lg.png" alt="Logo" className="brand-logo" width={120} height={40} />
          </div>
          <nav className="navbar-menu">
            <ul>
              <li>
                <Link href="/user-intetface/home" aria-label="Home" title="Home">
                  <i className="fa fa-home"></i>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <div className="chat-content-wrapper">
        <div className="chat-detail" style={{ minHeight: 'calc(100vh - 140px)' }}>
          <div className="chat-detail-header">
            <div
              className="detail-user"
              style={{ cursor: participant.id ? 'pointer' : 'default' }}
              onClick={() => {
                if (participant.id) {
                  router.push(getProfileRouteForUser(currentUserId, participant.id));
                }
              }}
            >
              <div className="chat-avatar">
                <Image src={participant.avatar} alt={participant.name} width={44} height={44} className="avatar-image" />
              </div>
              <div className="detail-meta">
                <span className="detail-name">{participant.name}</span>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {loading ? (
              <div style={{ textAlign: 'center', color: '#666', padding: 24 }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: 24 }}>
                No messages yet. Say hello!
              </div>
            ) : (
              messages.map((m) => (
                <div key={m._id} className={`msg-row ${m.senderId === currentUserId ? 'me' : ''}`}>
                  <div className="msg-bubble">
                    <span>{m.text}</span>
                    <span className="msg-time">{formatTime(m.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="msg-input-bar">
            <input
              type="text"
              className="msg-input"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="msg-send" onClick={handleSend} type="button" aria-label="Send">
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsideChatPage() {
  return (
    <Suspense fallback={<div className="chat-page"><div style={{ padding: 40, textAlign: 'center' }}>Loading...</div></div>}>
      <InsideChatContent />
    </Suspense>
  );
}
