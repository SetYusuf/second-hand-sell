'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../home/home.css';

interface FavoriteProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoriteProducts');
      if (stored) {
        const parsed: FavoriteProduct[] = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Failed to read favorite products from storage', error);
    }
  }, []);

  const handleProductClick = (product: FavoriteProduct) => {
    const params = new URLSearchParams();
    params.set('title', product.title);
    params.set('price', product.price);
    params.set('desc', product.description);
    params.set('image', product.image);
    params.set('id', product.id.toString());
    params.set('category', product.title.toLowerCase());
    router.push(`/user-intetface/buy-detail?${params.toString()}`);
  };

  const hasFavorites = favorites.length > 0;

  return (
    <div className="favorites-page">
      {/* Simple header reusing navbar styles */}
      <div className="topbar">
        <header className="navbar">
          <div className="icon">
            <Image
              src="/home/lg.png"
              alt="Finding Product Logo"
              className="brand-logo"
              width={180}
              height={60}
            />
            <Link
              href="/user-intetface/home"
              className="home-inline"
              aria-label="Home"
              title="Home"
            >
              <svg viewBox="0 0 24 24" width={20} height={20}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
          </div>
        </header>
      </div>

      <main className="product-list" style={{ paddingTop: '120px' }}>
        <h1>
          Your <span>Saved Products</span>
        </h1>

        {!hasFavorites && (
          <div
            style={{
              maxWidth: 600,
              margin: '40px auto',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <p style={{ fontSize: 18, marginBottom: 8 }}>No saved products yet.</p>
            <p style={{ marginBottom: 16 }}>
              Browse the home page and click <strong>Save</strong> on any product to see it here.
            </p>
            <Link href="/user-intetface/home" className="sell-inline">
              Go to Home
            </Link>
          </div>
        )}

        {hasFavorites && (
          <div className="product-list-box">
            {favorites.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h2>{product.title}</h2>
                  <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                  <div className="price">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

