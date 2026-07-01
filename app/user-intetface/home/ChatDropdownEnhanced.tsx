'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ChatItem {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: boolean;
}

interface ChatDropdownEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatItem[];
  onChatClick?: (chat: ChatItem) => void;
}

export default function ChatDropdownEnhanced({
  isOpen,
  onClose,
  chats,
  onChatClick
}: ChatDropdownEnhancedProps) {
  const [chatList, setChatList] = useState<ChatItem[]>(chats);

  const handleMarkAllAsRead = () => {
    console.log('All chats marked as read');
    
    // Mark all chats as read
    setChatList(prev => 
      prev.map(chat => ({ ...chat, unread: false }))
    );
  };

  const handleClearChats = () => {
    console.log('All chats cleared');
    
    // Clear all chats
    setChatList([]);
  };

  const handleChatClick = (chat: ChatItem) => {
    if (onChatClick) {
      onChatClick(chat);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-dropdown-enhanced">
      <div className="chat-dropdown-overlay" onClick={onClose}>
        <div className="chat-dropdown-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="chat-dropdown-header">
            <h3>Messages</h3>
            <button 
              className="chat-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="chat-action-buttons">
            <button 
              onClick={handleMarkAllAsRead}
              className="chat-mark-read-btn"
            >
              Mark All as Read
            </button>
            <button 
              onClick={handleClearChats}
              className="chat-clear-btn"
            >
              Clear All
            </button>
          </div>

          {/* Chat List */}
          <div className="chat-dropdown-list">
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`chat-dropdown-item ${chat.unread ? 'unread' : 'read'}`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="chat-dropdown-avatar">
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      width={40}
                      height={40}
                      className="chat-avatar-image"
                    />
                  </div>

                  <div className="chat-dropdown-info">
                    <div className="chat-dropdown-header">
                      <span className="chat-dropdown-name">{chat.name}</span>
                      <span className="chat-dropdown-time">{chat.time}</span>
                    </div>
                    <div className="chat-dropdown-preview">{chat.preview}</div>
                  </div>

                  <div className="chat-dropdown-indicator">
                    {chat.unread && <span className="chat-unread-dot"></span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-empty-state">
                <i className="fa fa-comments"></i>
                <p>No messages</p>
                <p>Your conversations will appear here</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {chatList.length > 0 && (
            <div className="chat-dropdown-footer">
              <button className="see-all-chats-btn">
                See all messages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
