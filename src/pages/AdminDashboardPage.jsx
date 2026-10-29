import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Shield, Percent,
  LogOut, ExternalLink, Plus, RefreshCw, Trash2, Edit, CheckCircle2,
  AlertCircle, X, Search, Eye, TrendingUp, Truck, Layers, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService, productService } from '../services/catalog';
import { formatMoney, getProductImage } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'processing', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function AdminDashboardPage() {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState('apercu'); // 'apercu' | 'commandes' | 'produits' | 'categories' | 'equipes' | 'coupons'

  // Global data
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditStockOpen, setIsEditStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    team: '',
    season: '2024/2025',
    imageUrl: '',
    tags: '',
    isFeatured: false,
    isActive: true,
    sizes: STANDARD_SIZES.map((size) => ({ size, stock: size === 'M' || size === 'L' ? 10 : 5 })),
  });

  // New Category Form State
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });

  // New Team Form State
  const [teamForm, setTeamForm] = useState({ name: '', slug: '', league: 'La Liga', country: 'Espagne', type: 'club' });

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percentage', discountAmount: 10, minOrderAmount: 50 });

  // Fetch all admin data
  const loadData = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const [statsRes, ordersRes, productsRes, catsRes, teamsRes, couponsRes] = await Promise.all([
        adminService.getStats().catch(() => null),
        adminService.getOrders(orderStatusFilter ? { status: orderStatusFilter } : {}).catch(() => null),
        adminService.getProducts().catch(() => null),
        adminService.getCategories().catch(() => null),
        adminService.getTeams().catch(() => null),
        adminService.getCoupons().catch(() => null),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (ordersRes?.success) setOrders(ordersRes.data || []);
      if (productsRes?.success) setProducts(productsRes.data || []);
      if (catsRes?.success) setCategories(catsRes.data || []);
      if (teamsRes?.success) setTeams(teamsRes.data || []);
      if (couponsRes?.success) setCoupons(couponsRes.data || []);
    } catch (err) {
      console.warn('Admin load error:', err);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin, orderStatusFilter]);

  // Order status updater
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await adminService.updateOrderStatus(orderId, { status: newStatus });
      if (res.success) {
        showToast(`Statut mis à jour : ${newStatus}`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Échec de la mise à jour', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      showToast('Veuillez remplir les champs obligatoires (Nom, Prix, Catégorie)', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
        category: productForm.category,
        team: productForm.team || undefined,
        season: productForm.season.trim(),
        isFeatured: productForm.isFeatured,
        isActive: productForm.isActive,
        tags: productForm.tags ? productForm.tags.split(',').map((t) => t.trim().toLowerCase()) : [],
        sizes: productForm.sizes.map((s) => ({ size: s.size, stock: Number(s.stock) || 0 })),
        images: productForm.imageUrl ? [{ url: productForm.imageUrl.trim(), isMain: true }] : [],
      };

      const res = await adminService.createProduct(payload);
      if (res.success && res.data) {
        showToast('Maillot créé avec succès !', 'success');
        setIsAddProductOpen(false);
        // Reset form
        setProductForm({
          name: '',
          description: '',
          price: '',
          salePrice: '',
          category: '',
          team: '',
          season: '2024/2025',
          imageUrl: '',
          tags: '',
          isFeatured: false,
          isActive: true,
          sizes: STANDARD_SIZES.map((size) => ({ size, stock: size === 'M' || size === 'L' ? 10 : 5 })),
        });
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la création du maillot', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Stock Update Submit
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const sizesPayload = selectedProduct.sizes.map((s) => ({
        size: s.size,
        stock: Number(s.stock) || 0,
      }));
      const res = await adminService.updateProductStock(selectedProduct._id, sizesPayload);
      if (res.success) {
        showToast('Stock mis à jour !', 'success');
        setIsEditStockOpen(false);
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la mise à jour des stocks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le maillot « ${productName} » ?`)) return;
    try {
      await adminService.deleteProduct(productId);
      showToast('Maillot supprimé', 'info');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Échec de la suppression', 'error');
    }
  };

  // Create Category Submit
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    try {
      const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
      const res = await adminService.createCategory({ ...categoryForm, slug });
      if (res.success) {
        showToast('Catégorie ajoutée !', 'success');
        setIsAddCategoryOpen(false);
        setCategoryForm({ name: '', slug: '', description: '' });
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur création catégorie', 'error');
    }
  };

  // Create Team Submit
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.name) return;
    try {
      const slug = teamForm.slug || teamForm.name.toLowerCase().replace(/\s+/g, '-');
      const res = await adminService.createTeam({ ...teamForm, slug });
      if (res.success) {
        showToast('Équipe ajoutée !', 'success');
        setIsAddTeamOpen(false);
        setTeamForm({ name: '', slug: '', league: 'La Liga', country: 'Espagne', type: 'club' });
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur création équipe', 'error');
    }
  };

  // Create Coupon Submit
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountAmount) return;
    try {
      const res = await adminService.createCoupon({
        code: couponForm.code.toUpperCase().trim(),
        type: couponForm.type,
        discountAmount: Number(couponForm.discountAmount),
        minOrderAmount: Number(couponForm.minOrderAmount) || 0,
      });
      if (res.success) {
        showToast('Code promo créé avec succès !', 'success');
        setIsAddCouponOpen(false);
        setCouponForm({ code: '', type: 'percentage', discountAmount: 10, minOrderAmount: 50 });
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur création code promo', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '440px', textAlign: 'center' }}>
          <LayoutDashboard size={48} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>Espace Administrateur Réservé</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.92rem' }}>
            Veuillez vous connecter avec les identifiants administrateur pour gérer les produits, commandes et stocks.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => openAuthModal('login')} className="btn btn-primary">
              Se connecter
            </button>
            <Link to="/" className="btn btn-secondary">
              Aller à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.team?.name?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q) ||
      p.season?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07090e', color: '#fff' }}>
      {/* SIDEBAR BACK-OFFICE */}
      <aside style={{ width: '270px', background: '#0b0f19', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-badge" style={{ width: '32px', height: '32px' }}>M</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>
              MRIWL <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: 'rgba(229, 185, 92, 0.15)', borderRadius: '4px' }}>ADMIN</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestion & Logistique Tunisie</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
          <button
            onClick={() => setActiveTab('apercu')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'apercu' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'apercu' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'apercu' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <TrendingUp size={18} color={activeTab === 'apercu' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('commandes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'commandes' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'commandes' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'commandes' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Package size={18} color={activeTab === 'commandes' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Commandes</span>
            {orders.length > 0 && (
              <span style={{ marginLeft: 'auto', background: 'rgba(229, 185, 92, 0.2)', color: 'var(--accent-gold)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('produits')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'produits' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'produits' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'produits' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={18} color={activeTab === 'produits' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Maillots & Stocks</span>
            <span style={{ marginLeft: 'auto', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' }}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'categories' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'categories' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'categories' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Layers size={18} color={activeTab === 'categories' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Catégories</span>
          </button>

          <button
            onClick={() => setActiveTab('equipes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'equipes' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'equipes' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'equipes' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Shield size={18} color={activeTab === 'equipes' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Clubs & Sélections</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activeTab === 'coupons' ? '#fff' : 'var(--text-secondary)',
              background: activeTab === 'coupons' ? 'var(--bg-surface-elevated)' : 'transparent',
              borderLeft: activeTab === 'coupons' ? '3px solid var(--accent-gold)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Percent size={18} color={activeTab === 'coupons' ? 'var(--accent-gold)' : 'currentColor'} />
            <span>Codes Promo</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={15} />
            <span>Voir la boutique en direct</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>{user?.name || 'Admin'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>{user?.email}</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{ color: 'var(--accent-crimson)', padding: '6px' }}
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL DU BACK-OFFICE */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{ height: '70px', borderBottom: '1px solid var(--border-subtle)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {activeTab === 'apercu' && 'Tableau de Bord & KPIs'}
              {activeTab === 'commandes' && 'Gestion des Commandes'}
              {activeTab === 'produits' && 'Catalogue Maillots & Gestion des Stocks'}
              {activeTab === 'categories' && 'Gestion des Catégories'}
              {activeTab === 'equipes' && 'Gestion des Clubs & Sélections'}
              {activeTab === 'coupons' && 'Codes Promo & Réductions'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'produits' && (
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Nouveau Maillot</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Nouvelle Catégorie</span>
              </button>
            )}

            {activeTab === 'equipes' && (
              <button
                onClick={() => setIsAddTeamOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Nouvelle Équipe</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Nouveau Code</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="btn btn-secondary btn-sm"
              title="Rafraîchir les données"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} />
              <span>Actualiser</span>
            </button>
          </div>
        </header>

        {/* Corps de la page */}
        <div style={{ padding: '32px', flexGrow: 1 }}>
          {/* TAB 1: APERÇU / DASHBOARD */}
          {activeTab === 'apercu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Cartes KPI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>Chiffre d'Affaires</span>
                    <TrendingUp size={20} color="var(--accent-emerald)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {formatMoney(stats?.totalRevenue || 0)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '6px' }}>
                    Revenus cumulés en Tunisie
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>Commandes Totales</span>
                    <Package size={20} color="var(--accent-gold)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {stats?.totalOrders || orders.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Clients enregistrés et invités
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>En cours d'expédition</span>
                    <Truck size={20} color="var(--accent-blue)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '6px' }}>
                    Colis à livrer
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>Maillots au Catalogue</span>
                    <ShoppingBag size={20} color="#a855f7" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {categories.length} catégories actives
                  </div>
                </div>
              </div>

              {/* Commandes récentes */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Dernières Commandes</h3>
                  <button onClick={() => setActiveTab('commandes')} className="btn btn-secondary btn-sm">
                    Voir toutes les commandes
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune commande pour le moment</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 14px' }}>N° Commande</th>
                        <th style={{ padding: '10px 14px' }}>Client</th>
                        <th style={{ padding: '10px 14px' }}>Ville</th>
                        <th style={{ padding: '10px 14px' }}>Total</th>
                        <th style={{ padding: '10px 14px' }}>Mode</th>
                        <th style={{ padding: '10px 14px' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-gold)' }}>{ord.orderNumber}</td>
                          <td style={{ padding: '12px 14px', color: '#fff' }}>{ord.customer?.name}</td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{ord.shippingAddress?.city}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{formatMoney(ord.total)}</td>
                          <td style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: '0.78rem' }}>{ord.paymentMethod}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '0.78rem', textTransform: 'uppercase', color: ord.status === 'delivered' ? 'var(--accent-emerald)' : 'var(--accent-gold)' }}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMMANDES */}
          {activeTab === 'commandes' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Filter size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Filtrer par statut :</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '0.84rem' }}
                  >
                    <option value="">Tous les statuts ({orders.length})</option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                  Aucune commande ne correspond à ce filtre.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px 14px' }}>N° Commande</th>
                        <th style={{ padding: '12px 14px' }}>Date</th>
                        <th style={{ padding: '12px 14px' }}>Client</th>
                        <th style={{ padding: '12px 14px' }}>Gouvernorat</th>
                        <th style={{ padding: '12px 14px' }}>Articles</th>
                        <th style={{ padding: '12px 14px' }}>Total (DT)</th>
                        <th style={{ padding: '12px 14px' }}>Mode</th>
                        <th style={{ padding: '12px 14px' }}>Statut en direct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                            {ord.orderNumber}
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{ord.customer?.name}</div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{ord.customer?.phone}</div>
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                            {ord.shippingAddress?.city}
                          </td>
                          <td style={{ padding: '14px', color: '#fff' }}>
                            {ord.items?.length || 0} maillot(s)
                          </td>
                          <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                            {formatMoney(ord.total)}
                          </td>
                          <td style={{ padding: '14px', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                            {ord.paymentMethod === 'cod' ? 'Espèces (COD)' : 'Carte'}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <select
                              value={ord.status}
                              disabled={updatingOrderId === ord._id}
                              onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                              className="form-select"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: ord.status === 'delivered' ? 'var(--accent-emerald)' : ord.status === 'cancelled' ? 'var(--accent-crimson)' : 'var(--accent-gold)',
                                width: 'auto',
                              }}
                            >
                              {STATUS_OPTIONS.map((st) => (
                                <option key={st.value} value={st.value}>{st.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GESTION DES PRODUITS & STOCKS */}
          {activeTab === 'produits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Product Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '320px' }}>
                  <input
                    type="text"
                    placeholder="Filtrer par nom, club, saison..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                  />
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Total : <strong>{filteredProducts.length}</strong> maillot(s)
                </div>
              </div>

              {/* Product Table */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <th style={{ padding: '14px' }}>Aperçu</th>
                      <th style={{ padding: '14px' }}>Maillot</th>
                      <th style={{ padding: '14px' }}>Club / Sélection</th>
                      <th style={{ padding: '14px' }}>Catégorie</th>
                      <th style={{ padding: '14px' }}>Prix</th>
                      <th style={{ padding: '14px' }}>Stocks par taille</th>
                      <th style={{ padding: '14px' }}>Statut</th>
                      <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const img = getProductImage(p);
                      const totalStock = p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;

                      return (
                        <tr key={p._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ width: '48px', height: '54px', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                              <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                            <div style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Saison : {p.season || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                            {p.team?.name || '—'}
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                            {p.category?.name || '—'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 700, color: '#fff' }}>{p.salePrice ? `${p.salePrice} DT` : `${p.price} DT`}</span>
                            {p.salePrice && (
                              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '6px' }}>{p.price} DT</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {p.sizes?.map((s) => (
                                <span
                                  key={s.size}
                                  style={{
                                    fontSize: '0.72rem',
                                    padding: '2px 5px',
                                    borderRadius: '3px',
                                    background: s.stock > 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.15)',
                                    color: s.stock > 0 ? '#fff' : 'var(--accent-crimson)',
                                  }}
                                >
                                  {s.size}:{s.stock}
                                </span>
                              ))}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: totalStock > 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', marginTop: '4px' }}>
                              Total : {totalStock} pièces
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', background: p.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: p.isActive ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                              {p.isActive ? 'Actif' : 'Masqué'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setIsEditStockOpen(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                                title="Modifier les stocks"
                              >
                                Stock
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="btn btn-sm"
                                style={{ padding: '6px 8px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-crimson)' }}
                                title="Supprimer le maillot"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATÉGORIES */}
          {activeTab === 'categories' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Nom</th>
                    <th style={{ padding: '12px 14px' }}>Identifiant (Slug)</th>
                    <th style={{ padding: '12px 14px' }}>Description</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>{c.name}</td>
                      <td style={{ padding: '14px', color: 'var(--accent-gold)' }}>{c.slug}</td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{c.description || '—'}</td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Supprimer la catégorie « ${c.name} » ?`)) {
                              await adminService.deleteCategory(c._id);
                              showToast('Catégorie supprimée', 'info');
                              loadData();
                            }
                          }}
                          className="btn btn-sm"
                          style={{ color: 'var(--accent-crimson)', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: ÉQUIPES */}
          {activeTab === 'equipes' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Équipe</th>
                    <th style={{ padding: '12px 14px' }}>Type</th>
                    <th style={{ padding: '12px 14px' }}>Championnat / Ligue</th>
                    <th style={{ padding: '12px 14px' }}>Pays</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>{t.name}</td>
                      <td style={{ padding: '14px', textTransform: 'capitalize', color: 'var(--accent-gold)' }}>{t.type}</td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{t.league || '—'}</td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{t.country || '—'}</td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Supprimer l'équipe « ${t.name} » ?`)) {
                              await adminService.deleteTeam(t._id);
                              showToast('Équipe supprimée', 'info');
                              loadData();
                            }
                          }}
                          className="btn btn-sm"
                          style={{ color: 'var(--accent-crimson)', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: CODES PROMO */}
          {activeTab === 'coupons' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Code</th>
                    <th style={{ padding: '12px 14px' }}>Type de réduction</th>
                    <th style={{ padding: '12px 14px' }}>Valeur</th>
                    <th style={{ padding: '12px 14px' }}>Commande minimum</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((cp) => (
                    <tr key={cp._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 800, color: 'var(--accent-gold)' }}>{cp.code}</td>
                      <td style={{ padding: '14px', textTransform: 'capitalize' }}>{cp.type === 'percentage' ? 'Pourcentage (%)' : 'Montant fixe'}</td>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {cp.type === 'percentage' ? `${cp.discountAmount}%` : `${cp.discountAmount} DT`}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        {cp.minOrderAmount ? `${cp.minOrderAmount} DT` : 'Aucun'}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Supprimer le code « ${cp.code} » ?`)) {
                              await adminService.deleteCoupon(cp._id);
                              showToast('Code promo supprimé', 'info');
                              loadData();
                            }
                          }}
                          className="btn btn-sm"
                          style={{ color: 'var(--accent-crimson)', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: AJOUTER UN MAILLOT */}
      {isAddProductOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un Nouveau Maillot</h2>
              <button className="nav-icon-btn" onClick={() => setIsAddProductOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom du maillot *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Real Madrid Maillot Domicile 2024/25 - Bellingham"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Catégorie *</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Club ou Sélection</label>
                  <select
                    value={productForm.team}
                    onChange={(e) => setProductForm({ ...productForm, team: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Aucune / Neutre</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prix de base (DT) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="ex: 120"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prix soldé (DT) (Optionnel)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="ex: 95"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Saison</label>
                  <input
                    type="text"
                    placeholder="2024/2025 ou 1998"
                    value={productForm.season}
                    onChange={(e) => setProductForm({ ...productForm, season: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL de l'image</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Stock par taille */}
              <div className="form-group">
                <label className="form-label">Quantités en stock par taille</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '8px' }}>
                  {productForm.sizes.map((s, idx) => (
                    <div key={s.size} style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => {
                          const updated = [...productForm.sizes];
                          updated[idx].stock = Number(e.target.value) || 0;
                          setProductForm({ ...productForm, sizes: updated });
                        }}
                        className="form-input"
                        style={{ textAlign: 'center', padding: '6px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description détaillée</label>
                <textarea
                  rows="3"
                  placeholder="Détails du maillot, flocages, technologie textile..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  />
                  <span>Mettre en avant (Coup de cœur)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  />
                  <span>Actif & Visible en boutique</span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                {loading ? 'Création...' : 'Enregistrer le maillot'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MODIFIER LE STOCK D'UN PRODUIT */}
      {isEditStockOpen && selectedProduct && (
        <div className="modal-backdrop" onClick={() => setIsEditStockOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Modifier les Stocks : {selectedProduct.name}</h2>
              <button className="nav-icon-btn" onClick={() => setIsEditStockOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                {selectedProduct.sizes?.map((s, idx) => (
                  <div key={s.size} style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{s.size}</span>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) => {
                        const updatedSizes = [...selectedProduct.sizes];
                        updatedSizes[idx].stock = Number(e.target.value) || 0;
                        setSelectedProduct({ ...selectedProduct, sizes: updatedSizes });
                      }}
                      className="form-input"
                      style={{ textAlign: 'center', padding: '8px', marginTop: '4px' }}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                {loading ? 'Mise à jour...' : 'Sauvegarder les stocks'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UNE CATÉGORIE */}
      {isAddCategoryOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddCategoryOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouvelle Catégorie</h2>
              <button className="nav-icon-btn" onClick={() => setIsAddCategoryOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom de la catégorie *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Coupe d'Afrique des Nations"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Identifiant URL (Slug optionnel)</label>
                <input
                  type="text"
                  placeholder="ex: can-retro"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="2"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Créer la Catégorie
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UNE ÉQUIPE */}
      {isAddTeamOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddTeamOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouvelle Équipe / Club</h2>
              <button className="nav-icon-btn" onClick={() => setIsAddTeamOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom du Club / Équipe *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Espérance Sportive de Tunis"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={teamForm.type}
                    onChange={(e) => setTeamForm({ ...teamForm, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="club">Club</option>
                    <option value="national">Sélection Nationale</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ligue / Championnat</label>
                  <input
                    type="text"
                    placeholder="ex: Ligue 1 Pro Tunisie ou Premier League"
                    value={teamForm.league}
                    onChange={(e) => setTeamForm({ ...teamForm, league: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pays</label>
                <input
                  type="text"
                  placeholder="ex: Tunisie ou Angleterre"
                  value={teamForm.country}
                  onChange={(e) => setTeamForm({ ...teamForm, country: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Créer l'Équipe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UN CODE PROMO */}
      {isAddCouponOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddCouponOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouveau Code Promo</h2>
              <button className="nav-icon-btn" onClick={() => setIsAddCouponOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="modal-body">
              <div className="form-group">
                <label className="form-label">Code Promo *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: DERBY20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (DT)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Valeur de la réduction *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="ex: 15"
                    value={couponForm.discountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, discountAmount: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Montant minimum de commande (DT)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="ex: 80"
                  value={couponForm.minOrderAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Créer le Code Promo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
