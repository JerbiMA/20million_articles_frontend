import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { formatPrice, getProductImage } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const priceInfo = formatPrice(product);
  const imageUrl = getProductImage(product);
  const isFav = isInWishlist(product._id);

  const availableSizes = product.sizes?.filter((s) => s.stock > 0) || [];
  const defaultSize = availableSizes.length > 0 ? availableSizes[0].size : null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultSize) {
      await addToCart(product._id, defaultSize, 1);
    }
  };

  return (
    <div className="product-card" style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${product.slug}`} className="product-image-wrap" style={{ background: '#f8fafc' }}>
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Badges gauche */}
        <div className="badge-group" style={{ top: '8px', left: '8px' }}>
          {priceInfo.hasDiscount && (
            <span className="product-badge badge-sale" style={{ background: 'var(--accent-crimson)', borderRadius: '2px' }}>
              {priceInfo.save}
            </span>
          )}
          {product.season && (
            <span className="product-badge" style={{ background: '#0f172a', color: '#fff', borderRadius: '2px' }}>
              {product.season}
            </span>
          )}
        </div>

        {/* Wishlist bouton droite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFav ? 'var(--accent-crimson)' : '#94a3b8',
            transition: 'all 0.2s',
            zIndex: 10,
          }}
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info" style={{ padding: '14px', background: '#ffffff' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
          {product.team?.name || product.category?.name || 'Football'}
        </div>

        <Link to={`/product/${product.slug}`} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em', marginBottom: '8px' }}>
          {product.name}
        </Link>

        {/* 5-star rating (Screenshot 3) */}
        <div style={{ display: 'flex', gap: '2px', color: 'var(--brand-amber)', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5].map((st) => (
            <Star key={st} size={12} fill="currentColor" />
          ))}
        </div>

        <div className="product-price-row" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: 'auto' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-gold)' }}>
            {priceInfo.current}
          </span>
          {priceInfo.hasDiscount && (
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
              {priceInfo.original}
            </span>
          )}

          {defaultSize && (
            <button
              onClick={handleQuickAdd}
              style={{
                marginLeft: 'auto',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title={`Ajouter taille ${defaultSize}`}
            >
              <ShoppingBag size={13} />
              <span>+{defaultSize}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
