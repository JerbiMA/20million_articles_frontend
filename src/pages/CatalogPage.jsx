import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, RotateCcw, ChevronLeft, ChevronRight,
  LayoutGrid, Grid2X2, ArrowLeft, Star, Sparkles
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService, categoryService, teamService } from '../services/catalog';
import { LEAGUES_DATA, NATIONAL_TEAMS, CLUBS_DATA } from '../data/sportsIdentity';
import { formatMoney } from '../utils/formatters';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL Query Parameters
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const teamParam = searchParams.get('team') || '';
  const leagueParam = searchParams.get('league') || '';
  const countryParam = searchParams.get('country') || '';
  const sortParam = searchParams.get('sort') || '-createdAt';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '20', 10);
  const inStockParam = searchParams.get('inStock') === 'true';
  const onSaleParam = searchParams.get('onSale') === 'true';
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 250;

  // Local UI state
  const [priceRange, setPriceRange] = useState(maxPriceParam);
  const [gridCols, setGridCols] = useState(4);
  const [selectedLeague, setSelectedLeague] = useState(leagueParam);
  const [selectedCountry, setSelectedCountry] = useState(countryParam);
  const [selectedClub, setSelectedClub] = useState(teamParam);

  // Hub View Mode: 'leagues' | 'countries' | 'clubs'
  const [hubView, setHubView] = useState(() => {
    if (leagueParam === 'international' || categoryParam === 'international') return 'countries';
    if (leagueParam && leagueParam !== 'international') return 'clubs';
    return 'leagues';
  });

  useEffect(() => {
    Promise.all([categoryService.getCategories(), teamService.getTeams()])
      .then(([cats, tms]) => {
        if (cats?.success) setCategories(cats.data || []);
        if (tms?.success) setTeams(tms.data || []);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pageParam,
        limit: limitParam,
        sort: sortParam,
      };

      if (categoryParam) {
        const matched = categories.find((c) => c.slug === categoryParam || c._id === categoryParam);
        params.category = matched ? matched._id : categoryParam;
      }
      if (teamParam) params.team = teamParam;
      if (searchParam) params.search = searchParam;
      if (inStockParam) params.inStock = true;

      const res = await productService.getProducts(params);
      if (res?.success) {
        let items = res.data || [];

        // On sale filter
        if (onSaleParam) {
          items = items.filter((p) => p.salePrice != null && p.salePrice < p.price);
        }

        // Country filter (Sélections)
        if (selectedCountry) {
          items = items.filter((p) =>
            p.team?.country?.toLowerCase().includes(selectedCountry.toLowerCase()) ||
            p.name?.toLowerCase().includes(selectedCountry.toLowerCase())
          );
        }

        // Club filter
        if (selectedClub) {
          items = items.filter((p) =>
            p.team?._id === selectedClub ||
            p.team?.name?.toLowerCase().includes(selectedClub.toLowerCase()) ||
            p.name?.toLowerCase().includes(selectedClub.toLowerCase())
          );
        }

        // League filter
        if (selectedLeague && selectedLeague !== 'international') {
          const lObj = LEAGUES_DATA.find((l) => l.id === selectedLeague);
          if (lObj?.country) {
            items = items.filter((p) => p.team?.country?.toLowerCase().includes(lObj.country.toLowerCase()));
          }
        }

        // Price range
        items = items.filter((p) => (p.salePrice || p.price) <= priceRange);

        setProducts(items);
      }
    } catch (err) {
      console.warn('Catalog load error:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, teamParam, searchParam, sortParam, pageParam, limitParam, inStockParam, onSaleParam, priceRange, selectedCountry, selectedClub, selectedLeague, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  // Handlers for Hub Navigation
  const handleLeagueClick = (lId) => {
    if (lId === 'international') {
      setSelectedLeague('international');
      setSelectedClub('');
      setHubView('countries');
      updateParam('league', 'international');
      updateParam('category', 'international');
    } else {
      setSelectedLeague(lId);
      setSelectedCountry('');
      setHubView('clubs');
      updateParam('league', lId);
    }
  };

  const handleCountryClick = (country) => {
    if (selectedCountry === country.name) {
      setSelectedCountry('');
      updateParam('country', '');
    } else {
      setSelectedCountry(country.name);
      updateParam('country', country.name);
    }
  };

  const handleClubClick = (club) => {
    if (selectedClub === club.name) {
      setSelectedClub('');
      updateParam('team', '');
    } else {
      setSelectedClub(club.name);
      updateParam('team', club.name);
    }
  };

  const resetAllFilters = () => {
    setSearchParams({});
    setSelectedLeague('');
    setSelectedCountry('');
    setSelectedClub('');
    setHubView('leagues');
    setPriceRange(250);
  };

  const currentTitle = selectedCountry
    ? `Sélection Nationale : ${selectedCountry}`
    : selectedClub
    ? `Maillots du Club : ${selectedClub}`
    : selectedLeague === 'international'
    ? 'Sélections Nationales & Coupe du Monde'
    : selectedLeague
    ? LEAGUES_DATA.find((l) => l.id === selectedLeague)?.name || 'Championnat'
    : categoryParam
    ? categories.find((c) => c.slug === categoryParam)?.name || 'Catalogue'
    : searchParam
    ? `Résultats pour « ${searchParam} »`
    : 'Tous les Maillots de Football';

  // Filter clubs by active league if applicable
  const visibleClubs = selectedLeague && selectedLeague !== 'international'
    ? CLUBS_DATA.filter((c) => {
        const lObj = LEAGUES_DATA.find((l) => l.id === selectedLeague);
        return lObj?.country ? c.country.toLowerCase() === lObj.country.toLowerCase() : true;
      })
    : CLUBS_DATA;

  return (
    <div className="container catalog-page-wrapper">
      {/* Fil d'Ariane Dynamique */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#64748b', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#0f172a', fontWeight: 600 }}>Accueil</Link>
        <span>›</span>
        <button onClick={resetAllFilters} style={{ color: '#475569', cursor: 'pointer' }}>Catalogue</button>
        {selectedLeague && (
          <>
            <span>›</span>
            <button
              onClick={() => {
                setSelectedCountry('');
                setSelectedClub('');
                setHubView(selectedLeague === 'international' ? 'countries' : 'clubs');
              }}
              style={{ color: '#475569', fontWeight: 600 }}
            >
              {selectedLeague === 'international' ? 'Sélections Nationales' : LEAGUES_DATA.find(l => l.id === selectedLeague)?.name}
            </button>
          </>
        )}
        {(selectedCountry || selectedClub) && (
          <>
            <span>›</span>
            <span style={{ color: 'var(--brand-gold)', fontWeight: 800 }}>{selectedCountry || selectedClub}</span>
          </>
        )}
      </nav>

      {/* Titre & Sous-titre */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>
          {currentTitle}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {products.length} maillots disponibles en stock avec flocage authentique et livraison express en Tunisie.
        </p>
      </div>

      {/* DISPOSITION PRINCIPALE: SIDEBAR + CONTENU */}
      <div className="catalog-layout-grid">
        {/* SIDEBAR DE FILTRES GAUCHE (Screenshot 4 & 5) */}
        <aside className="filter-sidebar">
          {/* Slider Prix */}
          <div>
            <h3 className="filter-section-title">Intervalle de Prix</h3>
            <div className="price-slider-box">
              <div className="price-slider-values">
                <span>Min: 0.000 DT</span>
                <span style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>Max: {formatMoney(priceRange)}</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-range-input"
              />
            </div>
          </div>

          {/* En Stock */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h3 className="filter-section-title">Disponibilité</h3>
            <label className="filter-checkbox-line">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
              />
              <span>En Stock uniquement</span>
            </label>
          </div>

          {/* En Promotion */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h3 className="filter-section-title">Promotions</h3>
            <label className="filter-checkbox-line">
              <input
                type="checkbox"
                checked={onSaleParam}
                onChange={(e) => updateParam('onSale', e.target.checked ? 'true' : '')}
              />
              <span>En Promotion uniquement</span>
            </label>
          </div>

          {/* Catégories de Maillots */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h3 className="filter-section-title">Rayons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => updateParam('category', '')}
                style={{
                  textAlign: 'left',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '0.84rem',
                  fontWeight: !categoryParam ? 700 : 500,
                  color: !categoryParam ? 'var(--brand-gold)' : '#334155',
                  background: !categoryParam ? 'var(--brand-gold-light)' : 'transparent',
                }}
              >
                Tous les rayons
              </button>
              {categories.map((c) => {
                const isActive = categoryParam === c.slug || categoryParam === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => updateParam('category', c.slug)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--brand-gold)' : '#334155',
                      background: isActive ? 'var(--brand-gold-light)' : 'transparent',
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetAllFilters}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Réinitialiser les filtres</span>
          </button>
        </aside>

        {/* CONTENU PRINCIPAL DROIT */}
        <div>
          {/* =========================================================================
              HUB 1: CHAMPIONNATS & LIGUES (Screenshot 4)
              ========================================================================= */}
          {hubView === 'leagues' && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '14px', letterSpacing: '0.5px' }}>
                Choisissez votre Championnat ou les Sélections Mondiales :
              </div>
              <div className="leagues-hub-grid">
                {LEAGUES_DATA.map((l) => (
                  <div
                    key={l.id}
                    className="league-card"
                    onClick={() => handleLeagueClick(l.id)}
                  >
                    <div className="league-logo-wrap" style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={l.badge}
                        alt={l.name}
                        style={{ maxHeight: '70px', maxWidth: '70px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://flagcdn.com/w160/tn.png';
                        }}
                      />
                    </div>
                    <div className="league-card-title">{l.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{l.desc}</div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-gold)', background: 'var(--brand-gold-light)', padding: '2px 8px', borderRadius: '4px' }}>
                      {l.badgeCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              HUB 2: SÉLECTIONS NATIONALES AVEC DRAPEAUX (QUAND ON CLIQUE SUR INTERNATIONAL)
              ========================================================================= */}
          {hubView === 'countries' && (
            <div style={{ marginBottom: '36px', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setHubView('leagues');
                      setSelectedLeague('');
                      setSelectedCountry('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Retour aux Championnats</span>
                  </button>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    🌍 Drapeaux des Sélections Nationales & Coupe du Monde
                  </h3>
                </div>

                {selectedCountry && (
                  <button
                    onClick={() => setSelectedCountry('')}
                    style={{ fontSize: '0.8rem', color: 'var(--accent-crimson)', fontWeight: 700 }}
                  >
                    Effacer le filtre ({selectedCountry})
                  </button>
                )}
              </div>

              {/* Grille des drapeaux de pays */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                {NATIONAL_TEAMS.map((country) => {
                  const isSelected = selectedCountry === country.name;
                  return (
                    <div
                      key={country.id}
                      onClick={() => handleCountryClick(country)}
                      style={{
                        background: isSelected ? 'var(--brand-gold-light)' : '#f8fafc',
                        border: isSelected ? '2px solid var(--brand-gold)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '14px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      <div style={{ width: '56px', height: '38px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <img
                          src={country.flag}
                          alt={country.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? 'var(--brand-gold)' : '#0f172a' }}>
                        {country.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {country.nickname}
                      </div>
                      {country.stars > 0 && (
                        <div style={{ display: 'flex', gap: '2px', color: 'var(--brand-amber)' }}>
                          {[...Array(country.stars)].map((_, i) => (
                            <Star key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              HUB 3: CLUBS AVEC ÉCUSSONS OFFICIELS
              ========================================================================= */}
          {hubView === 'clubs' && (
            <div style={{ marginBottom: '36px', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setHubView('leagues');
                      setSelectedLeague('');
                      setSelectedClub('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Retour aux Championnats</span>
                  </button>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    🛡️ Choisissez votre Club Favori
                  </h3>
                </div>

                {selectedClub && (
                  <button
                    onClick={() => setSelectedClub('')}
                    style={{ fontSize: '0.8rem', color: 'var(--accent-crimson)', fontWeight: 700 }}
                  >
                    Effacer le filtre ({selectedClub})
                  </button>
                )}
              </div>

              {/* Grille des clubs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                {visibleClubs.map((club) => {
                  const isSelected = selectedClub === club.name;
                  return (
                    <div
                      key={club.id}
                      onClick={() => handleClubClick(club)}
                      style={{
                        background: isSelected ? 'var(--brand-gold-light)' : '#f8fafc',
                        border: isSelected ? '2px solid var(--brand-gold)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '16px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={club.crest}
                          alt={club.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: isSelected ? 'var(--brand-gold)' : '#0f172a' }}>
                        {club.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {club.league}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BARRE D'OUTILS ET CONTRÔLE D'AFFICHAGE (Screenshot 5) */}
          <div className="catalog-toolbar">
            <div className="catalog-toolbar-left">
              <span>Afficher :</span>
              <select
                value={limitParam}
                onChange={(e) => updateParam('limit', e.target.value)}
                className="form-select"
                style={{ padding: '6px 10px', fontSize: '0.84rem', width: 'auto', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="20">20 par page</option>
                <option value="50">50 par page</option>
                <option value="100">100 par page</option>
              </select>
            </div>

            <div className="catalog-toolbar-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#475569' }}>
                <span>Trier par :</span>
                <select
                  value={sortParam}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="form-select"
                  style={{ padding: '6px 12px', fontSize: '0.84rem', width: 'auto', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                >
                  <option value="-createdAt">Nouveautés</option>
                  <option value="price">Prix croissant</option>
                  <option value="-price">Prix décroissant</option>
                </select>
              </div>

              {/* View Switcher: 4 or 2 cols */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setGridCols(4)}
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: gridCols === 4 ? '#0f172a' : '#fff', color: gridCols === 4 ? '#fff' : '#475569' }}
                  title="Grille compacte (4 colonnes)"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setGridCols(2)}
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: gridCols === 2 ? '#0f172a' : '#fff', color: gridCols === 2 ? '#fff' : '#475569' }}
                  title="Grille large (2 colonnes)"
                >
                  <Grid2X2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* GRILLE DES PRODUITS */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--brand-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px', color: '#64748b' }}>Chargement des maillots...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>Aucun maillot pour cette sélection</h3>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Essayez d'élargir vos filtres ou de sélectionner un autre club/pays.</p>
              <button onClick={resetAllFilters} className="btn btn-primary">
                Afficher tous les maillots
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: gridCols === 4 ? 'repeat(auto-fill, minmax(220px, 1fr))' : 'repeat(2, 1fr)',
                gap: '20px',
              }}
            >
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
