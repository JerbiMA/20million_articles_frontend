import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { orderService } from '../services/catalog';
import { formatMoney } from '../utils/formatters';

const STATUS_STAGES = [
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmée' },
  { key: 'processing', label: 'En préparation' },
  { key: 'shipped', label: 'Expédiée' },
  { key: 'delivered', label: 'Livrée' },
];

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber') || '';

  const [orderNumberInput, setOrderNumberInput] = useState(orderNumberParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (num) => {
    if (!num) return;
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getGuestOrder(num.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Commande introuvable. Veuillez vérifier le numéro saisi.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Commande introuvable. Veuillez vérifier votre numéro.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumberParam) {
      setOrderNumberInput(orderNumberParam);
      fetchTracking(orderNumberParam);
    }
  }, [orderNumberParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderNumberInput.trim()) {
      setSearchParams({ orderNumber: orderNumberInput.trim() });
      fetchTracking(orderNumberInput.trim());
    }
  };

  const currentStageIndex = order
    ? STATUS_STAGES.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="container" style={{ padding: '40px 20px 100px', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Suivi de votre Commande
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Entrez votre numéro de commande MRIWL (ex: ORD-202610-00001) pour suivre son expédition en direct.
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            required
            placeholder="Numéro de commande (ex: ORD-202610-00001)"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', fontSize: '1rem', textTransform: 'uppercase' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 24px' }}>
          {loading ? 'Recherche...' : 'Suivre'}
        </button>
      </form>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '16px 20px', color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Suivi Colis</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {order.orderNumber}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--accent-gold-glow)', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.84rem', textTransform: 'uppercase' }}>
                Statut : {order.status}
              </span>
            </div>
          </div>

          {/* Timeline étapes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '40px', padding: '0 10px' }}>
            {STATUS_STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2, flex: 1 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--accent-gold)' : 'var(--bg-surface-elevated)',
                      border: isCurrent ? '2px solid #fff' : '1px solid var(--border-subtle)',
                      color: isCompleted ? '#000' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      marginBottom: '8px',
                      boxShadow: isCurrent ? '0 0 14px var(--accent-gold)' : 'none',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#fff' : 'var(--text-secondary)' }}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Adresse & Paiement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Adresse de Livraison</h4>
              <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: 1.5 }}>
                {order.customer?.name}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.country}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Règlement & Total</h4>
              <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Mode : <strong>{order.paymentMethod?.toUpperCase()}</strong><br />
                Paiement : <span style={{ color: order.paymentStatus === 'paid' ? 'var(--accent-emerald)' : 'var(--accent-gold)' }}>{order.paymentStatus || 'en attente'}</span><br />
                Total : <strong>{formatMoney(order.total)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
