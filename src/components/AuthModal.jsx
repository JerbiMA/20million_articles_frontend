import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('Tunis');
  const [regPostal, setRegPostal] = useState('1000');
  const [regCountry, setRegCountry] = useState('Tunisie');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(loginEmail, loginPassword);
      showToast('Bienvenue sur MRIWL !', 'success');
      closeAuthModal();
    } catch (err) {
      showToast(err.message || 'Email ou mot de passe incorrect', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        address: {
          street: regStreet,
          city: regCity,
          postalCode: regPostal,
          country: regCountry,
        },
      };
      await register(payload);
      showToast('Compte créé avec succès !', 'success');
      closeAuthModal();
    } catch (err) {
      showToast(err.message || "Échec de l'inscription", 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (type) => {
    if (type === 'admin') {
      setLoginEmail('admin@mriwl.com');
      setLoginPassword('Admin@12345678');
    } else {
      setLoginEmail('user@mriwl.com');
      setLoginPassword('User@12345678');
    }
    setAuthModalMode('login');
    showToast(`Identifiants ${type === 'admin' ? 'Administrateur' : 'Client'} pré-remplis !`, 'info');
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setAuthModalMode('login')}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: authModalMode === 'login' ? '#fff' : 'var(--text-muted)',
                borderBottom: authModalMode === 'login' ? '2px solid var(--accent-gold)' : 'none',
                paddingBottom: '4px',
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => setAuthModalMode('register')}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: authModalMode === 'register' ? '#fff' : 'var(--text-muted)',
                borderBottom: authModalMode === 'register' ? '2px solid var(--accent-gold)' : 'none',
                paddingBottom: '4px',
              }}
            >
              Créer un compte
            </button>
          </div>
          <button className="nav-icon-btn" onClick={closeAuthModal}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Seed Credentials Pill */}
          <div style={{ background: 'rgba(229, 185, 92, 0.08)', border: '1px solid rgba(229, 185, 92, 0.25)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} /> Accès démo rapide (Comptes de test) :
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillTestCredentials('customer')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Client (user@mriwl.com)
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Admin (admin@mriwl.com)
              </button>
            </div>
          </div>

          {authModalMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Adresse Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
                style={{ marginTop: '16px' }}
              >
                {loading ? 'Authentification...' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Youssef Msakni"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone (Tunisie)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 20 000 000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse Email</label>
                <input
                  type="email"
                  required
                  placeholder="youssef@exemple.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 caract., 1 majuscule, 1 symbole"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adresse de rue</label>
                <input
                  type="text"
                  required
                  placeholder="Avenue Habib Bourguiba"
                  value={regStreet}
                  onChange={(e) => setRegStreet(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ville / Gouvernorat</label>
                  <input
                    type="text"
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pays</label>
                  <input
                    type="text"
                    required
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
                style={{ marginTop: '12px' }}
              >
                {loading ? 'Création en cours...' : 'Finaliser mon inscription'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
