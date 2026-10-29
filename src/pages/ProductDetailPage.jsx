import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import SizeSelector from '../components/SizeSelector';
import { productService } from '../services/catalog';
import { formatPrice, getProductImage } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToBag, setAddingToBag] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductBySlug(slug);
        if (res.success && res.data) {
          const prod = res.data;
          setProduct(prod);
          setSelectedImage(getProductImage(prod));

          const firstInStock = prod.sizes?.find((s) => s.stock > 0);
          if (firstInStock) {
            setSelectedSize(firstInStock.size);
          }
        }
      } catch (err) {
        console.warn('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(229, 185, 92, 0.2)', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Chargement des détails du maillot...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '12px' }}>Maillot introuvable</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Ce modèle n'existe pas ou n'est plus disponible.</p>
        <Link to="/catalog" className="btn btn-primary">Retour au catalogue</Link>
      </div>
    );
  }

  const priceInfo = formatPrice(product);
  const currentVariant = product.sizes?.find((s) => s.size === selectedSize);
  const isSelectedOutOfStock = !currentVariant || currentVariant.stock <= 0;

  const handleAddToBag = async () => {
    if (!selectedSize) {
      showToast('Veuillez d\'abord choisir une taille', 'error');
      return;
    }
    if (isSelectedOutOfStock) {
      showToast('La taille choisie est en rupture de stock', 'error');
      return;
    }

    try {
      setAddingToBag(true);
      await addToCart(product._id, selectedSize, quantity);
    } finally {
      setAddingToBag(false);
    }
  };

  const imagesList = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : [getProductImage(product)];

  return (
    <div className="container" style={{ padding: '40px 20px 100px' }}>
      {/* Fil d'Ariane */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: 'var(--text-secondary)' }}>Maillots</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link to={`/catalog?category=${product.category.slug || product.category._id}`} style={{ color: 'var(--text-secondary)' }}>
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span style={{ color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
          {product.name}
        </span>
      </nav>

      {/* Détails du maillot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'start' }}>
        {/* Galerie photos */}
        <div>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            paddingTop: '100%',
            marginBottom: '16px',
          }}>
            <img
              src={selectedImage || imagesList[0]}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {priceInfo.hasDiscount && (
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className="product-badge badge-sale">{priceInfo.save}</span>
              </div>
            )}
          </div>

          {imagesList.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {imagesList.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImage === url ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    opacity: selectedImage === url ? 1 : 0.6,
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                >
                  <img src={url} alt={`Miniature ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Colonne informations & Achat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {product.team?.name && (
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {product.team.name}
                </span>
              )}
              {product.season && (
                <span className="product-badge badge-season">{product.season}</span>
              )}
              {product.category?.name && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• {product.category.name}</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '16px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                {priceInfo.current}
              </span>
              {priceInfo.hasDiscount && (
                <>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {priceInfo.original}
                  </span>
                  <span className="discount-tag">{priceInfo.save}</span>
                </>
              )}
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
            {product.description}
          </div>

          {/* Sélecteur de taille */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>
                Choisir la Taille : <span style={{ color: 'var(--accent-gold)' }}>{selectedSize || 'Sélectionner'}</span>
              </span>
              {currentVariant && currentVariant.stock > 0 && currentVariant.stock <= 5 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-crimson)', fontWeight: 600 }}>
                  ⚡ Plus que {currentVariant.stock} en stock !
                </span>
              )}
            </div>

            <SizeSelector
              product={product}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
            />
          </div>

          {/* Quantité et Ajout au Panier */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '12px 16px', color: '#fff' }}
              >
                -
              </button>
              <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => {
                  const maxStock = currentVariant?.stock || 10;
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                style={{ padding: '12px 16px', color: '#fff' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={addingToBag || isSelectedOutOfStock}
              className="btn btn-primary"
              style={{ flexGrow: 1, padding: '14px 28px', fontSize: '1rem' }}
            >
              <ShoppingBag size={20} />
              <span>{isSelectedOutOfStock ? 'Rupture de stock' : addingToBag ? 'Ajout en cours...' : 'Ajouter au Panier'}</span>
            </button>
          </div>

          {/* Garanties Tunisie */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} color="var(--accent-gold)" />
              <span><strong>Paiement à la livraison (Espèces)</strong> disponible dans tous les gouvernorats de Tunisie.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} color="var(--accent-emerald)" />
              <span>Qualité 100% vérifiée. Flocages, écussons et finitions soignées.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <RotateCcw size={18} color="var(--accent-blue)" />
              <span>Échange de taille facile sous 7 jours si le maillot ne convient pas.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
