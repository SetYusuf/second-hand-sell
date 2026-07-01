'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SellerCard, { SellerInfo } from '../../../../components/SellerCard'
import SellerProductGrid, { SellerProduct } from '../../../../components/SellerProductGrid'
import './seller-profile.css'
import { getCurrentUserIdFromStorage } from '@/lib/profile-utils'
import { getStoredAuthToken } from '@/lib/auth-storage'

export default function SellerProfilePage() {
  const router = useRouter()
  const params = useParams<{ sellerID: string }>()
  const sellerID = params?.sellerID

  const [seller, setSeller] = useState<SellerInfo | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    setCurrentUserId(getCurrentUserIdFromStorage())

    if (!sellerID) {
      setLoading(false)
      setError('No seller ID provided in the URL.')
      return
    }

    const fetchSeller = async () => {
      try {
        const res = await fetch(`/api/users/${sellerID}`)
        const data = await res.json()
        if (data.success) {
          setSeller(data.user as SellerInfo)
        } else {
          setError(data.error || 'Seller not found.')
        }
      } catch (err) {
        console.error('Failed to fetch seller:', err)
        setError('Failed to load seller profile.')
      } finally {
        setLoading(false)
      }
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/seller/${sellerID}`)
        const data = await res.json()
        if (data.success) {
          setProducts(data.posts as SellerProduct[])
        }
      } catch (err) {
        console.error('Failed to fetch seller products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchSeller()
    fetchProducts()
    fetchFollowStatus(sellerID)
  }, [sellerID])

  const fetchFollowStatus = async (targetUserId: string) => {
    try {
      const token = getStoredAuthToken()
      if (!token) return
      const res = await fetch(`/api/follow/status/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setIsFollowing(Boolean(data.isFollowing))
    } catch (error) {
      console.error('Failed to load follow status:', error)
    }
  }

  const handleFollowToggle = async () => {
    if (!sellerID || !seller || followLoading) return
    try {
      setFollowLoading(true)
      const token = getStoredAuthToken()
      const res = await fetch(`/api/follow/${sellerID}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setIsFollowing(Boolean(data.isFollowing))
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="seller-profile-page">
        <div className="seller-profile-page__loading">
          <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
          <p>Loading seller profile...</p>
        </div>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="seller-profile-page">
        <header className="seller-profile-page__header">
          <button
            type="button"
            className="seller-profile-page__back"
            onClick={() => router.back()}
          >
            ← Back
          </button>
        </header>
        <div className="seller-profile-page__error">
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
          <p>{error || 'Seller not found.'}</p>
          <button
            type="button"
            className="seller-profile-page__retry"
            onClick={() => router.push('/user-intetface/home')}
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-profile-page">
      <header className="seller-profile-page__header">
        <button
          type="button"
          className="seller-profile-page__back"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <h1 className="seller-profile-page__title">Seller Profile</h1>
      </header>

      <div className="seller-profile-page__content">
        {/* TOP SECTION — Seller Identity */}
        <SellerCard
          seller={seller}
          variant="header"
          listingCount={products.length}
          showFriendButton
        />
        {currentUserId && currentUserId !== seller.id && (
          <div className="seller-profile-page__follow-row">
            <button
              type="button"
              className={`seller-profile-page__follow ${isFollowing ? 'is-following' : ''}`}
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        )}

        {/* BOTTOM SECTION — Seller's Listings */}
        <div className="seller-profile-page__listings">
          {loadingProducts ? (
            <div className="seller-profile-page__loading">
              <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
              <p>Loading listings...</p>
            </div>
          ) : (
            <SellerProductGrid
              products={products}
              showDetails
              title={`What ${seller.name} is Selling`}
              emptyMessage="This seller has no active listings."
            />
          )}
        </div>
      </div>
    </div>
  )
}