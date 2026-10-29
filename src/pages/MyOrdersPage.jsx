import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/catalog';
import { formatMoney } from '../utils/formatters';

export default function MyOrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const res = await orderService.getMyOrders();
          if (res.success && res.data) {
            setOrders(res.data);
          }
        } catch (err) {
          console.warn('Orders fetch error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <Package size={48} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Connectez-vous pour voir vos commandes</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Retrouvez l'historique complet de vos achats, statuts de livraison et factures.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn btn-primary">
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 100px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Mes Commandes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bienvenue, {user?.name}. Retrouvez ici vos commandes de maillots de foot.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(229, 185, 92, 0.2)', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <ShoppingBag size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Aucune commande pour l'instant</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Prêt à démarrer votre collection de maillots ?</p>
          <Link to="/catalog" className="btn btn-primary">
            Explorer le catalogue
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((ord) => (
            <div
              key={ord._id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>{ord.orderNumber}</span>
                  <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>
                    {ord.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Commandé le {new Date(ord.createdAt).toLocaleDateString('fr-FR')} • {ord.items?.length || 0} articles • Règlement : {ord.paymentMethod?.toUpperCase()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {formatMoney(ord.total)}
                </span>
                <Link
                  to={`/track-order?orderNumber=${encodeURIComponent(ord.orderNumber)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  <span>Détails & Suivi</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
