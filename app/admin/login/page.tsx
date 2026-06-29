'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basit demo auth (Gerçek uygulamada API üzerinden kontrol edilir)
    if (password === 'admin123') {
      // Cookie ayarla
      document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax";
      router.push('/admin/takvim');
    } else {
      setError('Hatalı şifre. (Demo şifresi: admin123)');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img loading="lazy" decoding="async" src="/logo.png" alt="Logo" style={{ height: '60px', margin: '0 auto 1.5rem auto' }} />
          <h1 className="heading-md" style={{ color: 'var(--color-gold)' }}>Yönetim Paneli</h1>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-error)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Yönetici Şifresi</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
