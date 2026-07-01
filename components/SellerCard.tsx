'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './SellerCard.css'
import { getCurrentUserIdFromStorage, getProfileRouteForUser, openChatWithUser } from '@/lib/profile-utils'

export interface SellerInfo {
  id: string
  name: string
  username: string
  avatar: string
  location?: string
  memberSince?: string
  bio?: string
  phone?: string
}

interface SellerCardProps {
  seller: SellerInfo | null
  /** Optional listing count to display */
  listingCount?: number
  /** Show a larger header-style card (used on profile page) */
  variant?: 'card' | 'header'
  /** Show an "Add Friend" button in addition to Chat */
  showFriendButton?: boolean
}

export default function SellerCard({
  seller,
  listingCount,
  variant = 'card',
  showFriendButton = false,
}: SellerCardProps) {
  const router = useRouter()
  const [currentUserId] = useState(() => getCurrentUserIdFromStorage())

  if (!seller) {
    return (
      <div className={`seller-card seller-card--${variant} seller-card--loading`}>
        <div className="seller-card__avatar seller-card__avatar--placeholder">
          ?
        </div>
        <div className="seller-card__info">
          <div className="seller-card__name">Seller info unavailable</div>
          <div className="seller-card__username">@unknown</div>
        </div>
      </div>
    )
  }

  const memberSinceText = seller.memberSince
    ? new Date(seller.memberSince).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A'

  const handleViewProfile = () => {
    const targetPath = getProfileRouteForUser(currentUserId, seller.id)
    router.push(targetPath)
  }

  const handleChat = () => {
    openChatWithUser({
      router,
      participant: {
        id: seller.id,
        name: seller.name,
        avatar: seller.avatar || '/notification-image/lina.png',
      },
      initialMessage: 'Hi, I am interested in your listing.',
    })
  }

  const handleAddFriend = () => {
    alert(`Friend request sent to ${seller.name}!`)
  }

  const avatarNode = seller.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={seller.avatar}
      alt={seller.name}
      className="seller-card__avatar"
    />
  ) : (
    <div className="seller-card__avatar seller-card__avatar--placeholder">
      {seller.name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  )

  if (variant === 'header') {
    return (
      <div className="seller-card seller-card--header">
        <div className="seller-card__header-top">
          {avatarNode}
          <div className="seller-card__info">
            <h1 className="seller-card__name">{seller.name}</h1>
            <div className="seller-card__username">@{seller.username}</div>
            <div className="seller-card__meta">
              <span>📅 Member since {memberSinceText}</span>
              {seller.location && <span>📍 {seller.location}</span>}
              {typeof listingCount === 'number' && (
                <span>🏷️ {listingCount} listing{listingCount === 1 ? '' : 's'}</span>
              )}
            </div>
            {seller.bio && <p className="seller-card__bio">{seller.bio}</p>}
          </div>
        </div>

        <div className="seller-card__actions">
          {currentUserId && currentUserId === seller.id ? null : (
            <button
              type="button"
              className="seller-card__btn seller-card__btn--chat"
              onClick={handleChat}
            >
              💬 Chat
            </button>
          )}
          {showFriendButton && currentUserId && currentUserId !== seller.id && (
            <button
              type="button"
              className="seller-card__btn seller-card__btn--friend"
              onClick={handleAddFriend}
            >
              ＋ Add Friend
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`seller-card seller-card--${variant}`}>
      <div className="seller-card__row">
        {avatarNode}
        <div className="seller-card__info">
          <div className="seller-card__name">{seller.name}</div>
          <div className="seller-card__username">@{seller.username}</div>
          <div className="seller-card__meta">
            Member since {memberSinceText}
            {seller.location ? ` • ${seller.location}` : ''}
          </div>
        </div>
      </div>

      <div className="seller-card__actions">
        <button
          type="button"
          className="seller-card__btn seller-card__btn--profile"
          onClick={handleViewProfile}
        >
          {currentUserId && currentUserId === seller.id ? 'Edit Profile' : 'View Profile'}
        </button>
        {currentUserId && currentUserId !== seller.id && (
          <button
            type="button"
            className="seller-card__btn seller-card__btn--chat"
            onClick={handleChat}
          >
            Chat
          </button>
        )}
      </div>
    </div>
  )
}