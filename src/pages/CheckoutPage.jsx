import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Banknote, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/catalog';
import { formatMoney, getProductImage } from '../utils/formatters';

const GOVERNORATES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
  'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
  'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
];

export default function CheckoutPage() {
  const { items, subtotal, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Tunis');
  const [postalCode, setPostalCode] = useState('1000');
  const [country, setCountry] = useState('Tunisie');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' ou 'card'
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) {
        if (user.address.street) setStreet(user.address.street);
        if (user.address.city) setCity(user.address.city);
        if (user.address.postalCode) setPostalCode(user.address.postalCode);
        if (user.address.country) setCountry(user.address.country);
      }
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '12px' }}>Votre panier est vide</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Ajoutez des maillots avant de passer la commande.</p>
        <Link to="/catalog" className="btn btn-primary">Voir le catalogue</Link>
      </div>
    );
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  // Livraison gratuite à partir de 150 DT, sinon 7 DT partout en Tunisie
  const shippingFee = subtotal >= 150 ? 0 : 7;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !street.trim()) {
      showToast('Veuillez renseigner tous les champs obligatoires', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
        },
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        paymentMethod,
        couponCode: appliedCoupon?.code || undefined,
        notes: notes.trim() || undefined,
      };

      const res = await orderService.createOrder(payload);
      if (res.success && res.data) {
        const createdOrder = res.data;
        showToast('Commande validée avec succès !', 'success');
        clearCart();
        navigate('/order-success', { state: { order: createdOrder } });
      } else {
        throw new Error(res.message || 'Échec de la commande');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la commande';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
        Finaliser la Commande
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.94rem' }}>
        Paiement sécurisé à la livraison partout en Tunisie ou par carte.
      </p>

      {!isAuthenticated && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ color: '#fff', fontWeight: 600 }}>Déjà inscrit ? </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Connectez-vous pour pré-remplir vos coordonnées.</span>
          </div>
          <button onClick={() => openAuthModal('login')} className="btn btn-secondary btn-sm">
            Se connecter
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', alignItems: 'start' }} className="checkout-layout">
          {/* Formulaire gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Étape 1 : Coordonnées */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                Coordonnées de Contact
              </h2>

              <div className="form-group">
                <label className="form-label">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Youssef Msakni"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="youssef@exemple.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Numéro de Téléphone (Tunisie) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 20 000 000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Étape 2 : Adresse de livraison en Tunisie */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                Adresse de Livraison (Tunisie)
              </h2>

              <div className="form-group">
                <label className="form-label">Adresse Complète *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Rue Habib Bourguiba, Résidence Les Palmiers Apt 3"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gouvernorat / Ville *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-select"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Code Postal</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions pour le livreur (Optionnel)</label>
                <textarea
                  rows="2"
                  placeholder="ex: Appeler avant d'arriver ou sonner à l'interphone"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Étape 3 : Mode de règlement */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                Mode de Paiement
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <label
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    border: paymentMethod === 'cod' ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'cod' ? 'rgba(229, 185, 92, 0.08)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#fff' }}>
                      <Banknote size={20} color="var(--accent-gold)" />
                      <span>Paiement à la livraison</span>
                    </div>
                    <input type="radio" checked={paymentMethod === 'cod'} onChange={() => {}} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Réglez en espèces à la réception de votre colis.
                  </p>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    border: paymentMethod === 'card' ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'card' ? 'rgba(229, 185, 92, 0.08)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#fff' }}>
                      <CreditCard size={20} color="var(--accent-gold)" />
                      <span>Carte Bancaire / e-Dinar</span>
                    </div>
                    <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Paiement en ligne sécurisé (simulation).
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Récapitulatif droit */}
          <div style={{ position: 'sticky', top: '96px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Récapitulatif de la commande</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
              {items.map((item, idx) => {
                const product = item.product || {};
                const imageUrl = getProductImage(product);
                return (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '54px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Taille : {item.size} • Qté : {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                      {formatMoney(item.itemTotal || item.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="price-summary-line">
                <span>Sous-total</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="price-summary-line" style={{ color: 'var(--accent-emerald)' }}>
                  <span>Code Promo ({appliedCoupon.code})</span>
                  <span>-{formatMoney(discountAmount)}</span>
                </div>
              )}
              <div className="price-summary-line">
                <span>Frais de livraison (Tunisie)</span>
                <span>{shippingFee === 0 ? 'GRATUITE' : formatMoney(shippingFee)}</span>
              </div>
              <div className="price-summary-line total">
                <span>Total à régler</span>
                <span style={{ color: 'var(--accent-gold)' }}>{formatMoney(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full"
              style={{ padding: '16px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              <Lock size={18} />
              <span>{submitting ? 'Validation en cours...' : `Confirmer la commande (${formatMoney(grandTotal)})`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
