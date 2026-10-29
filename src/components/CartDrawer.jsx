import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney, getProductImage } from '../utils/formatters';

export default function CartDrawer() {
  const {
    items,
    subtotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    validatingCoupon,
    validateCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  // Seuil de livraison gratuite en Tunisie : 150 DT (environ 2 maillots)
  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  // Frais standard de livraison en Tunisie : 7 DT
  const shippingFee = subtotal >= freeShippingThreshold || totalItems === 0 ? 0 : 7;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      await validateCoupon(couponCode);
      setCouponCode('');
    } catch {
      // Toast géré dans CartContext
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer" role="dialog" aria-label="Panier d'achats">
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <span>Mon Panier</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ({totalItems} {totalItems === 1 ? 'article' : 'articles'})
            </span>
          </div>
          <button className="nav-icon-btn" onClick={() => setIsCartOpen(false)} aria-label="Fermer le panier">
            <X size={18} />
          </button>
        </div>

        {/* Barre de progression livraison gratuite en Tunisie */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', marginBottom: '6px' }}>
            <Truck size={15} color="var(--accent-gold)" />
            {remainingForFree > 0 ? (
              <span>Ajoutez <strong>{formatMoney(remainingForFree)}</strong> pour la <strong>Livraison GRATUITE</strong> en Tunisie</span>
            ) : (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>🎉 Félicitations ! Livraison GRATUITE offerte !</span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-emerald))', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Corps du panier */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={28} color="var(--text-muted)" />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>Votre panier est vide</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Explorez les maillots officiels 2024/25 ou les classiques vintage.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/catalog');
                }}
              >
                Découvrir le catalogue
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const product = item.product || {};
              const imageUrl = getProductImage(product);
              const productId = product._id || item.productId;

              return (
                <div key={`${productId}-${item.size}-${idx}`} className="cart-item-row">
                  <div className="cart-item-thumb">
                    <img src={imageUrl} alt={product.name || 'Maillot'} />
                  </div>
                  <div className="cart-item-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className="cart-item-title">{product.name || 'Maillot Foot'}</h4>
                      <button
                        onClick={() => removeFromCart(productId, item.size)}
                        style={{ color: 'var(--text-muted)', padding: '2px' }}
                        title="Supprimer l'article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="cart-item-sub">
                      Taille : <strong>{item.size}</strong> • {formatMoney(item.price)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(productId, item.size, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(productId, item.size, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                        {formatMoney(item.itemTotal || item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pied du panier */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <form onSubmit={handleApplyCoupon} className="coupon-box">
              <input
                type="text"
                placeholder="Code promo (ex: WELCOME10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button
                type="submit"
                disabled={validatingCoupon || !couponCode.trim()}
                className="btn btn-secondary btn-sm"
              >
                Appliquer
              </button>
            </form>

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
                  <Tag size={14} />
                  Code : <strong>{appliedCoupon.code}</strong> (-{formatMoney(appliedCoupon.discountAmount)})
                </span>
                <button onClick={removeCoupon} style={{ color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="price-summary-line">
                <span>Sous-total</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="price-summary-line" style={{ color: 'var(--accent-emerald)' }}>
                  <span>Réduction code promo</span>
                  <span>-{formatMoney(discountAmount)}</span>
                </div>
              )}
              <div className="price-summary-line">
                <span>Livraison (Tunisie)</span>
                <span>{shippingFee === 0 ? 'GRATUITE' : formatMoney(shippingFee)}</span>
              </div>
              <div className="price-summary-line total">
                <span>Total estimé</span>
                <span style={{ color: 'var(--accent-gold)' }}>{formatMoney(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary btn-full"
              style={{ padding: '14px', fontSize: '1rem' }}
            >
              <span>Passer la commande</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
