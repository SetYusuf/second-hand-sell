'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import './ichat.css';

function InsideChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name') || 'Lina';
  const avatar = searchParams.get('avatar') || '/notification-image/lina.png';
  const initialMsg = searchParams.get('msg') || 'Hey bro, what are you doing? 😄';

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-center">
            <div className="avatar-wrapper">
                <Image src={avatar} alt={name} width={80} height={80} className="avatar" />
            </div>
            <span className="user-name">{name}</span>
        </div>
        <div className="header-right"></div>
      </header>

      <main className="chat-body">
        <div className="message-row received">
          <div className="message-avatar">
             <Image src={avatar} alt={name} width={40} height={40} className="avatar-small" />
          </div>
          <div className="message-content">
             <p className="message-text">{initialMsg}</p>
             <span className="message-time">11:45pm</span>
          </div>
        </div>
      </main>

      <footer className="chat-footer">
        <div className="footer-icons">
          <button className="icon-btn">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
             </svg>
          </button>
          <button className="icon-btn">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
             </svg>
          </button>
        </div>
        <div className="input-wrapper">
            <input type="text" placeholder="Message" className="chat-input" />
        </div>
        <button className="like-btn">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
             </svg>
        </button>
      </footer>
    </div>
  );
}

export default function InsideChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InsideChatContent />
    </Suspense>
  );
}
