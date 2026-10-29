import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, User, Heart, ShoppingBag, Layers, ChevronDown,
  LogOut, Package, LayoutDashboard, Globe, Phone, X, Flame, Shield, History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryService } from '../services/catalog';
import { formatMoney } from '../utils/formatters';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const userMenuRef = useRef(null);
  const categoriesMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res?.success) setCategories(res.data || []);
    }).catch(() => { });
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(e.target)) {
        setIsAllCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Maillots Rétro', path: '/catalog?category=classical' },
    { label: 'Saison 2024/25', path: '/catalog?category=new-season' },
    { label: 'Sélections', path: '/catalog?category=international' },
    { label: 'Survêtements Hiver', path: '/catalog?category=winter-collection' },
    { label: 'Packs & Friperie', path: '/catalog?category=thrifting' },
    { label: 'Bons Plans', path: '/catalog?onSale=true' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#8d0021' }}>
      {/* 1. TOP UTILITY BAR (Screenshot 1 & 4) */}
      {/* <div className="top-utility-bar">
        <div className="container top-utility-inner">
          <div className="top-utility-left">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} color="#facc15" />
              <span>Dinar Tunisien (DT)</span>
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Français</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>🚚 Livraison 24-48h partout en Tunisie</span>
          </div>

          <div className="top-utility-right">
            <span>Paiement en espèces à la livraison</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} color="#facc15" />
              <span>Assistance Client : +216 20 000 000</span>
            </span>
          </div>
        </div>
      </div> */}

      {/* 2. MAIN HEADER (Logo, Wide Center Search, Actions) */}
      <div className="main-header">
        <div className="container main-header-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/icons/logo-2m.png"
                alt="2Millions d'articles"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.28rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
                  2Millions <span style={{ color: '#facc15' }}>d'articles</span>
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Football Shop • Tunisie
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar (Prominent center with gold button) */}
          <div className="header-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="header-search-form">
              <input
                type="text"
                placeholder="Rechercher un maillot, club, joueur (ex: Real Madrid, Maradona, Messi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-btn" aria-label="Rechercher">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Account dropdown / trigger */}
            <div className="header-action-item" ref={userMenuRef} onClick={() => isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : openAuthModal('login')}>
              <div className="header-action-icon-wrap">
                <User size={22} />
              </div>
              <div className="header-action-text">
                <span className="header-action-label">Mon Compte</span>
                <span className="header-action-val">
                  {isAuthenticated ? (user?.name?.split(' ')[0] || 'Profil') : 'Connexion'}
                </span>
              </div>

              {/* User Dropdown */}
              {isAuthenticated && isUserMenuOpen && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{user?.name}</div>
                    <div className="user-dropdown-role">{user?.role}</div>
                  </div>
                  <Link to="/my-orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <Package size={16} />
                    <span>Mes Commandes</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)} style={{ color: 'var(--brand-gold)' }}>
                      <LayoutDashboard size={16} />
                      <span>Espace Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="dropdown-item"
                    style={{ width: '100%', color: 'var(--accent-crimson)' }}
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>



            {/* Cart with live amount in DT */}
            <div className="header-action-item" onClick={() => setIsCartOpen(true)} title="Panier">
              <div className="header-action-icon-wrap">
                <ShoppingBag size={22} />
                <span className="header-badge-count cart-badge">{totalItems}</span>
              </div>
              <div className="header-action-text">
                <span className="header-action-label">Panier</span>
                <span className="header-action-val" style={{ color: 'var(--brand-gold)' }}>
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUB-NAVBAR WITH "TOUTES LES CATÉGORIES" (Screenshot 1 & 4) */}
      <div className="sub-navbar">
        <div className="container sub-navbar-inner">
          {/* All Categories Button */}
          <div style={{ position: 'relative' }} ref={categoriesMenuRef}>
            <button
              onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
              className={`all-categories-btn ${isAllCategoriesOpen ? 'active' : ''}`}
            >
              <Layers size={18} />
              <span>Toutes les catégories</span>
              <ChevronDown size={14} style={{ transform: isAllCategoriesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown Menu */}
            {isAllCategoriesOpen && (
              <div className="categories-mega-menu">
                <Link
                  to="/catalog"
                  className="mega-menu-item"
                  onClick={() => setIsAllCategoriesOpen(false)}
                >
                  <span>Tous les Maillots</span>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/catalog?category=${cat.slug}`}
                    className="mega-menu-item"
                    onClick={() => setIsAllCategoriesOpen(false)}
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
                <Link
                  to="/catalog?league=tunisia"
                  className="mega-menu-item"
                  onClick={() => setIsAllCategoriesOpen(false)}
                  style={{ color: 'var(--brand-gold)', fontWeight: 700 }}
                >
                  <span>🇹🇳 Clubs Tunisiens & Sélection</span>
                </Link>
              </div>
            )}
          </div>

          {/* Horizontal Links */}

        </div>
      </div>
    </header>
  );
}
