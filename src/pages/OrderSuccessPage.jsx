import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { formatMoney } from '../utils/formatters';

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const orderNumber = order.orderNumber || order._id;

  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '680px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', border: '2px solid var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-emerald)' }}>
          <CheckCircle2 size={38} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Commande Confirmée !
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '24px' }}>
          Merci pour votre confiance. Votre maillot est en cours de préparation par notre équipe.
        </p>

        {/* Détails de la commande */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Numéro de commande :</span>
            <strong style={{ color: 'var(--accent-gold)' }}>{orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Client :</span>
            <span style={{ color: '#fff' }}>{order.customer?.name} ({order.customer?.phone})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Destination :</span>
            <span style={{ color: '#fff' }}>{order.shippingAddress?.street}, {order.shippingAddress?.city}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Mode de règlement :</span>
            <span style={{ color: '#fff', textTransform: 'uppercase' }}>
              {order.paymentMethod === 'cod' ? 'Paiement à la livraison (Espèces)' : 'Carte Bancaire / e-Dinar'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '1rem', fontWeight: 700 }}>
            <span style={{ color: '#fff' }}>Montant Total :</span>
            <span style={{ color: 'var(--accent-gold)' }}>{formatMoney(order.total)}</span>
          </div>
        </div>

        {/* Info transporteur Tunisie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(229, 185, 92, 0.08)', border: '1px solid rgba(229, 185, 92, 0.25)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left' }}>
          <Truck size={22} color="var(--accent-gold)" />
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Notre livreur vous contactera par téléphone au <strong style={{ color: '#fff' }}>{order.customer?.phone}</strong> avant de se présenter à votre adresse.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}`} className="btn btn-secondary">
            <Package size={16} />
            <span>Suivre l'état du colis</span>
          </Link>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
