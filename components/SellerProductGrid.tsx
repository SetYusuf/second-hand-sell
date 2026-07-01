'use client'

import { useRouter } from 'next/navigation'
import './SellerProductGrid.css'

export interface SellerProduct {
  _id: string
  title: string
  price: number
  type?: string
  category?: string
  location?: string
  imageUrl?: string
  createdAt?: string
}

interface SellerProductGridProps {
  products: SellerProduct[]
  /** Show extra details (category, date) on each card */
  showDetails?: boolean
  /** Optional section title rendered above the grid */
  title?: string
  /** Empty state message */
  emptyMessage?: string
}

export default function SellerProductGrid({
  products,
  showDetails = false,
  title,
  emptyMessage = 'This seller has no active listings.',
}: SellerProductGridProps) {
  const router = useRouter()

  const handleProductClick = (product: SellerProduct) => {
    const params = new URLSearchParams()
    const category = (product.type || product.category || 'product').toLowerCase()
    params.set('category', category)
    params.set('id', product._id)
    router.push(`/user-intetface/buy-detail?${params.toString()}`)
  }

  return (
    <div className="seller-products">
      {title && <h2 className="seller-products__title">{title}</h2>}

      {products.length === 0 ? (
        <div className="seller-products__empty">
          <i className="fa fa-inbox" aria-hidden="true"></i>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="seller-products__grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="seller-product-card"
              onClick={() => handleProductClick(product)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleProductClick(product)
              }}
            >
              <div className="seller-product-card__image-wrap">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="seller-product-card__image"
                  />
                ) : (
                  <div className="seller-product-card__image seller-product-card__image--placeholder">
                    <i className="fa fa-image" aria-hidden="true"></i>
                  </div>
                )}
              </div>

              <div className="seller-product-card__body">
                <h3 className="seller-product-card__title">{product.title}</h3>
                <div className="seller-product-card__price">
                  ${product.price}
                </div>

                {showDetails && (
                  <div className="seller-product-card__details">
                    {product.type && (
                      <span className="seller-product-card__chip">
                        {product.type}
                      </span>
                    )}
                    {product.location && (
                      <span className="seller-product-card__chip">
                        📍 {product.location}
                      </span>
                    )}
                    {product.createdAt && (
                      <span className="seller-product-card__date">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}