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
                <img
                  src="/icons/logo-2m.png"
                  alt="2Millions d'articles"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                    2Millions <span style={{ color: '#facc15' }}>d'articles</span>
                  </span>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Football Store • Tunisie
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '16px', maxWidth: '300px' }}>
                Votre destination football depuis 2017. Maillots rétro, saison actuelle et éditions spéciales.
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.12)', padding: '5px 10px', borderRadius: '4px', fontWeight: 700, color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  🇹🇳 100% Tunisien
                </span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(250, 204, 21, 0.2)', padding: '5px 10px', borderRadius: '4px', fontWeight: 700, color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)' }}>
                  Paiement à la livraison
                </span>
              </div>
            </div>

            {/* Col 2 : Navigation Rapide */}
            <div>
              <div className="footer-col-title">Navigation</div>
              <ul className="footer-links-list">
                <li><Link to="/catalog?category=new-season">Saison 2024/25</Link></li>
                <li><Link to="/catalog?category=classical">Maillots Rétro</Link></li>
                <li><Link to="/catalog?category=international">Sélections</Link></li>
                <li><Link to="/catalog?category=winter-collection">Survêtements</Link></li>
                <li><Link to="/catalog?onSale=true">Bons Plans</Link></li>
              </ul>
            </div>

            {/* Col 3 : Informations */}
            <div>
              <div className="footer-col-title">Informations</div>
              <ul className="footer-links-list">
                <li><span>🚚 Livraison 24-48h</span></li>
                <li><span>💵 Paiement à la livraison</span></li>
                <li><span>🔄 Échange sous 7 jours</span></li>
                <li><span>✅ Qualité garantie</span></li>
              </ul>
            </div>

            {/* Col 4 : Contact */}
            <div>
              <div className="footer-col-title">Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📞 +216 20 000 000</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✉️ contact@2millions-articles.tn</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>Support client 7j/7 • Réponse rapide</span>
                <a
                  href="https://wa.me/21620000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#25d366',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    width: 'fit-content',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
            <div>© {new Date().getFullYear()} 2Millions d'articles — Football Store Tunisie. Tous droits réservés.</div>
            <div>Livraison express dans les 24 gouvernorats tunisiens.</div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
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
