import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame, ChevronLeft, ChevronRight, Star, ArrowRight,
  Sparkles, Award, Shield, Trophy, CheckCircle, Truck, Shirt
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/catalog';
import {
  ClassicShirtIcon,
  NewSeasonShirtIcon,
  KidsKitIcon,
  MysteryPackIcon,
  TrackJacketIcon,
  TrainingSetIcon,
  MedalsCupsIcon,
  SignedFrameIcon,
  SizeChartIcon,
  PromoOfferIcon,
} from '../components/SportsIcons';
import { formatPrice, getProductImage, formatMoney } from '../utils/formatters';

/* ──────────────── Fade-in on scroll hook ──────────────── */
function useFadeInOnScroll() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel offset for Split sections
  const [featuredPage, setFeaturedPage] = useState(0);
  const [bestsellerPage, setBestsellerPage] = useState(0);

  const [isHovered, setIsHovered] = useState(false);

  // Fade-in refs for each section
  const [storyRef, storyVisible] = useFadeInOnScroll();
  const [circleRef, circleVisible] = useFadeInOnScroll();
  const [productsRef, productsVisible] = useFadeInOnScroll();

  // The 10 Circular Collections with user's uploaded #8d0021 icons + matching sports vectors
  const circularItems = [
    {
      id: 'classical',
      label: 'Maillots Rétro',
      subLabel: 'Classics 80-90s',
      image: '/icons/categories/icon-shirt-sparkle.png',
      path: '/catalog?category=classical',
    },
    {
      id: 'new-season',
      label: 'Saison 2024/25',
      subLabel: 'Nouveautés',
      Icon: NewSeasonShirtIcon,
      path: '/catalog?category=new-season',
    },
    {
      id: 'kids',
      label: 'Enfants & Junior',
      subLabel: 'Ensembles Kids',
      Icon: KidsKitIcon,
      path: '/catalog?search=kids',
    },
    {
      id: 'mystery-box',
      label: 'Pack Mystère',
      subLabel: 'Coffret Surprise',
      Icon: MysteryPackIcon,
      path: '/catalog?category=thrifting',
    },
    {
      id: 'winter',
      label: 'Survêtements',
      subLabel: 'Vestes & Hoodies',
      image: '/icons/categories/icon-hanger-apparel.png',
      path: '/catalog?category=winter-collection',
    },
    {
      id: 'training',
      label: 'Collection Hiver',
      subLabel: 'Hiver & Training',
      image: '/icons/categories/icon-snowflake-winter.png',
      path: '/catalog?search=training',
    },
    {
      id: 'international',
      label: 'Sélections',
      subLabel: 'Drapeaux & Coupe',
      image: '/icons/categories/icon-passport-football.png',
      path: '/catalog?category=international',
    },
    {
      id: 'trophies',
      label: 'Médailles & Coupes',
      subLabel: 'Trophées & Podiums',
      Icon: MedalsCupsIcon,
      path: '/catalog?category=international',
    },
    {
      id: 'size-chart',
      label: 'Guide Tailles',
      subLabel: 'Mensurations cm',
      image: '/icons/categories/icon-ruler-size.png',
      path: '/catalog#size-guide',
    },
    {
      id: 'offers',
      label: 'Offre Spéciale -10%',
      subLabel: 'Code WELCOME10',
      Icon: PromoOfferIcon,
      path: '/catalog?onSale=true',
    },
  ];

  const heroSlides = [
    {
      id: 'season-26-27',
      isGraphicBanner: true,
      tag: '⭐ SAISON PROCHAINE 26/27',
      title: 'MAILLOTS SAISON PROCHAINE 26/27',
      desc: 'Découvrez en avant-première les maillots de la saison prochaine 26/27.',
      link: '/catalog?category=new-season',
      bannerImage: '/banners/hero-saison-26-27.jpg',
    },
    {
      id: 'official-clubs',
      isGraphicBanner: false,
      tag: '⚡ NOUVELLE COLLECTION 2024/2025',
      title: 'MAILLOTS OFFICIELS & ÉDITIONS CLUBS',
      desc: 'Real Madrid, FC Barcelone, Manchester City, Chelsea, Arsenal, PSG, Bayern, Sélections. Flocages officiels et livraison 24-48h partout en Tunisie.',
      link: '/catalog?category=new-season',
      cta: 'Commander Maintenant',
      secondaryCta: 'Maillots Rétro',
      bannerImage: '/banners/hero-soccer-jerseys.jpg',
    },
    {
      id: 'retro-legends',
      isGraphicBanner: false,
      tag: '🏆 LÉGENDES & VINTAGE 80s • 90s • 2000s',
      title: 'LES MAILLOTS DE LÉGENDE DE L\'HISTOIRE',
      desc: 'Revivez l\'histoire : Zidane 98, Ronaldo R9 98, Maradona 86, Maldini 2003, Del Piero 10, Beckham 7. Des pièces d\'archive intemporelles de collection.',
      link: '/catalog?category=classical',
      cta: 'Explorer les Légendes',
      secondaryCta: 'Tous les Clubs',
      bannerImage: '/banners/hero-retro-jerseys.jpg',
    },
  ];

  // Auto-slide carousel
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isHovered, heroSlides.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, allRes, catRes] = await Promise.all([
          productService.getProducts({ isFeatured: true, limit: 8 }),
          productService.getProducts({ limit: 12 }),
          categoryService.getCategories(),
        ]);
        if (featRes?.success) setFeaturedProducts(featRes.data || []);
        if (allRes?.success) setBestsellerProducts(allRes.data || []);
        if (catRes?.success) setCategories(catRes.data || []);
      } catch (err) {
        console.warn('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const currentFeaturedSlice = featuredProducts.slice(featuredPage * 4, featuredPage * 4 + 4);
  const currentBestsellerSlice = bestsellerProducts.slice(bestsellerPage * 4, bestsellerPage * 4 + 4);

  return (
    <div>
      {/* =========================================================================
          1. HERO BANNER THÉMATIQUE FOOTBALL (Panoramique avec Maillots de Foot)
          ========================================================================= */}
      <section
        className="sports-hero-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          minHeight: '480px',
          background: '#07090e',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background Image Slide with smooth transition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroSlides[currentSlide].bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.5s ease-in-out',
          }}
        />

        {/* If this is the Graphic Banner (banner.jpg), make it a direct clickable showcase */}
        {heroSlides[currentSlide].isGraphicBanner ? (
          <Link
            to={heroSlides[currentSlide].link}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            aria-label="Commander Maillots Saison Prochaine 26/27"
          />
        ) : (
          <>
            {/* Cinematic Sports Atmosphere Gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(7, 9, 14, 0.94) 0%, rgba(7, 9, 14, 0.82) 42%, rgba(7, 9, 14, 0.4) 70%, rgba(7, 9, 14, 0.15) 100%)',
              }}
            />

            {/* Content Container */}
            <div className="container" style={{ position: 'relative', zIndex: 10, padding: '60px 20px' }}>
              <div style={{ maxWidth: '640px' }}>
                {/* Tag Badge */}
                <div
                  className="fade-in-up"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: 'rgba(141, 0, 33, 0.45)',
                    border: '1px solid #facc15',
                    color: '#facc15',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '16px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Flame size={15} /> {heroSlides[currentSlide].tag}
                </div>

                {/* Main Headline */}
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    marginBottom: '16px',
                    letterSpacing: '-0.5px',
                    textTransform: 'uppercase',
                    textShadow: '0 4px 20px rgba(0,0,0,0.7)',
                  }}
                >
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Description */}
                <p
                  style={{
                    color: '#e2e8f0',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    marginBottom: '28px',
                    maxWidth: '560px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  }}
                >
                  {heroSlides[currentSlide].desc}
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link
                    to={heroSlides[currentSlide].link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      background: '#facc15',
                      color: '#0a0d14',
                      fontWeight: 900,
                      fontSize: '0.98rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      boxShadow: '0 8px 24px rgba(250, 204, 21, 0.4)',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                    }}
                    className="banner-cta-primary"
                  >
                    <span>{heroSlides[currentSlide].cta}</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/catalog?category=classical"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 26px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.94rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    className="banner-cta-secondary"
                  >
                    <span>{heroSlides[currentSlide].secondaryCta || 'Maillots Rétro'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Left & Right Slide Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            backdropFilter: 'blur(6px)',
          }}
          aria-label="Diapositive précédente"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            backdropFilter: 'blur(6px)',
          }}
          aria-label="Diapositive suivante"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 20,
          }}
        >
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '32px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: currentSlide === idx ? '#facc15' : 'rgba(255, 255, 255, 0.35)',
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          NOTRE HISTOIRE & MANIFESTE — AFTER THE BANNER, WHITE BACKGROUND
          ========================================================================= */}
      <section
        ref={storyRef}
        className={`brand-story-section ${storyVisible ? 'fade-in-visible' : 'fade-in-hidden'}`}
        style={{
          background: '#ffffff',
          padding: '56px 0 48px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '1080px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Subtle badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '999px',
                background: 'rgba(141, 0, 33, 0.06)',
                border: '1px solid rgba(141, 0, 33, 0.15)',
                color: '#8d0021',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <span>⭐</span>
              <span>DEPUIS 2017 • 2MILLIONS D'ARTICLES</span>
            </div>

            {/* Main paragraph */}
            <p
              style={{
                fontSize: 'clamp(0.98rem, 1.8vw, 1.12rem)',
                lineHeight: 1.8,
                color: '#334155',
                fontWeight: 500,
                margin: 0,
                letterSpacing: '0.2px',
                maxWidth: '800px',
              }}
            >
              Since 2017, we've been more than just a football shirt shop — we're a home for football lovers, passionate fans, and collectors. We believe every shirt tells a story. That's why we offer a wide range of football shirts in all sizes, with quality you can trust. Whether you're looking for your next favorite jersey or adding a special piece to your collection, you're in the right place.
            </p>

            {/* Feature pills row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              {[
                { icon: <CheckCircle size={16} />, text: 'Toutes Tailles Disponibles' },
                { icon: <Shield size={16} />, text: 'Flocages & Écussons Authentiques' },
                { icon: <Truck size={16} />, text: 'Livraison Express 24h-48h' },
              ].map((feat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#475569',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ color: '#8d0021', display: 'flex' }}>{feat.icon}</span>
                  {feat.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. GRILLE DES 10 CERCLES AVEC ICÔNES ROUGES #8d0021
          ========================================================================= */}
      <section
        ref={circleRef}
        className={`circle-collections-section ${circleVisible ? 'fade-in-visible' : 'fade-in-hidden'}`}
        style={{ background: '#ffffff', padding: '50px 0 40px' }}
      >
        <div className="container">
          <div className="section-centered-title" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              2Millions d'articles — Nos Rayons
            </h2>
          </div>

          <div className="circle-grid-10">
            {circularItems.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="circle-collection-item"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="circle-icon-badge">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <IconComponent size={68} color="#ffffff" />
                    )}
                  </div>
                  <div>
                    <div className="circle-collection-title">
                      {item.label}
                    </div>
                    <div className="circle-collection-sub">
                      {item.subLabel}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. DUAL SPLIT SECTION: MAILLOTS EN VEDETTE & BESTSELLERS (Screenshot 3)
          ========================================================================= */}


      {/* =========================================================================
          4. GRILLE DES NOUVEAUTÉS
          ========================================================================= */}
      <section
        ref={productsRef}
        className={`${productsVisible ? 'fade-in-visible' : 'fade-in-hidden'}`}
        style={{ padding: '40px 0 80px', background: '#ffffff' }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>
                Tous les Nouveaux Arrivages
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Expédition rapide partout en Tunisie • Paiement en espèces à la livraison</p>
            </div>

            <Link
              to="/catalog"
              style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Voir tout</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {bestsellerProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
