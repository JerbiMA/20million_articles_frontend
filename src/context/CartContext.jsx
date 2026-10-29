import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, couponService } from '../services/catalog';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, finalAmount, type }
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        });
      }
    } catch (err) {
      console.warn('Cart load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      setLoading(true);
      const res = await cartService.addItem(productId, size, quantity);
      if (res.success && res.data) {
        setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        });
        showToast('Maillot ajouté à votre panier !', 'success');
        setIsCartOpen(true);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Impossible d'ajouter l'article";
      showToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId, size);
    }
    try {
      const res = await cartService.updateItem(productId, size, quantity);
      if (res.success && res.data) {
        setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        });
        if (appliedCoupon) {
          validateCoupon(appliedCoupon.code, res.data.subtotal, false);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour';
      showToast(msg, 'error');
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      const res = await cartService.removeItem(productId, size);
      if (res.success && res.data) {
        setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        });
        showToast('Article retiré du panier', 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression';
      showToast(msg, 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], subtotal: 0, totalItems: 0 });
      setAppliedCoupon(null);
    } catch (err) {
      console.warn('Clear cart error:', err);
    }
  };

  const validateCoupon = async (code, orderAmount = cart.subtotal, notify = true) => {
    if (!code) return;
    try {
      setValidatingCoupon(true);
      const res = await couponService.validateCoupon(code.toUpperCase().trim(), orderAmount);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        if (notify) {
          showToast(`Code promo ${res.data.code} appliqué ! Réduction de ${res.data.discountAmount} DT`, 'success');
        }
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Code promo invalide ou expiré';
      if (notify) showToast(msg, 'error');
      setAppliedCoupon(null);
      throw new Error(msg);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Code promo retiré', 'info');
  };

  const value = {
    items: cart.items,
    subtotal: cart.subtotal,
    totalItems: cart.totalItems,
    loading,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    validatingCoupon,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    validateCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
