import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Award, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="store-footer">
        <div className="container">
          <div className="footer-grid-4col">
            {/* Col 1 : À propos & Logo */}
            <div>
              <div className="brand-logo" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#8d0021',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1rem',
                  }}
                >
                  2M
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                    2Millions <span style={{ color: '#facc15' }}>d'articles</span>
                  </span>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Football Store • Tunisie
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.12)', padding: '5px 10px', borderRadius: '4px', fontWeight: 700, color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  🇹🇳 100% Tunisien
                </span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(250, 204, 21, 0.2)', padding: '5px 10px', borderRadius: '4px', fontWeight: 700, color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)' }}>
                  Paiement à la livraison
                </span>
              </div>
            </div>

            {/* Col 2 : Service Client & Règlement */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📞 +216 20 000 000</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✉️ contact@2millions-articles.tn</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>Support client 7j/7</span>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
            <div>© {new Date().getFullYear()} 2Millions d'articles — Football Store Tunisie. Tous droits réservés.</div>
            <div>Livraison express dans les 24 gouvernorats tunisiens.</div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button (Screenshot 2 & 3) */}
      <a
        href="https://wa.me/21620000000"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn"
        title="Discuter sur WhatsApp"
        aria-label="Contact WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
}
