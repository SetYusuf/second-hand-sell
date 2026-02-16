'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NotificationItem {
  id: number;
  name: string;
  text: string;
  time: string;
  avatar: string;
  type: 'like' | 'friend_request' | 'friend_accepted' | 'post';
  read?: boolean;
}

interface NotificationDropdownEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
}

export default function NotificationDropdownEnhanced({
  isOpen,
  onClose,
  notifications,
  onNotificationClick
}: NotificationDropdownEnhancedProps) {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(notifications);

  const handleConfirm = () => {
    console.log('All notifications confirmed/marked as read');
    
    // Mark all notifications as read
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Optional: Close dropdown after confirm
    // onClose();
  };

  const handleDelete = () => {
    console.log('All notifications deleted');
    
    // Clear all notifications
    setNotificationList([]);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown-enhanced">
      <div className="notification-dropdown-overlay" onClick={onClose}>
        <div className="notification-dropdown-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button 
              className="notification-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Action Buttons - Confirm & Delete */}
          <div className="notification-action-buttons">
            <button 
              onClick={handleConfirm}
              className="notification-confirm-btn"
            >
              Confirm
            </button>
            <button 
              onClick={handleDelete}
              className="notification-delete-btn"
            >
              Delete
            </button>
          </div>

          {/* Notifications List */}
          <div className="notification-dropdown-list">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-dropdown-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-dropdown-avatar">
                    <Image
                      src={notification.avatar}
                      alt={notification.name}
                      width={40}
                      height={40}
                      className="notification-avatar-image"
                    />
                  </div>

                  <div className="notification-dropdown-info">
                    <div className="notification-dropdown-text">
                      <span className="notification-dropdown-name">{notification.name}</span>
                      <span> {notification.text}</span>
                    </div>

                    <div className="notification-dropdown-time">{notification.time}</div>

                    {notification.type === 'friend_request' && (
                      <div className="notification-friend-buttons">
                        <button 
                          className="notification-friend-confirm"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Confirm friend request:', notification.id);
                          }}
                        >
                          Confirm
                        </button>
                        <button 
                          className="notification-friend-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete friend request:', notification.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="notification-dropdown-indicator">
                    {!notification.read && <span className="notification-dot"></span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty-state">
                <i className="fa fa-bell"></i>
                <p>No notifications</p>
                <p>You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificationList.length > 0 && (
            <div className="notification-dropdown-footer">
              <button className="see-all-btn">
                See all notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
