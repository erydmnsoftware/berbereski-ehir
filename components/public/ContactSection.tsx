'use client';

export default function ContactSection() {
  return (
    <footer id="iletisim" style={{ background: 'var(--color-bg-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4xl)' }}>
      <div className="container">
        <div className="grid-3" style={{ marginBottom: 'var(--space-3xl)' }}>
          
          <div className="reveal">
            <img loading="lazy" decoding="async" src="/logo.png" alt="BerberOS Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '1.5rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
              Şehrin premium erkek kuaförü. Tarzınızı sanata dönüştüren usta eller, VIP hizmet anlayışıyla sizleri bekliyor.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Facebook</a>
            </div>
          </div>
          
          <div className="reveal reveal-delay-2">
            <h4 className="heading-md" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>İletişim</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Adres</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Merkez Şube,<br />İstanbul, Türkiye</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>📞</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Telefon</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>+90 222 000 0000</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>E-posta</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>info@berberos.com</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="reveal reveal-delay-3">
            <h4 className="heading-md" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Çalışma Saatleri</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span>Pazartesi - Cuma</span>
                <span style={{ color: 'var(--color-text)' }}>09:00 - 19:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span>Cumartesi</span>
                <span style={{ color: 'var(--color-text)' }}>09:00 - 17:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span>Pazar</span>
                <span style={{ color: 'var(--color-error)' }}>Kapalı</span>
              </div>
            </div>
            
            <a href="/randevu" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
              Hızlı Randevu Al
            </a>
          </div>
          
        </div>
        
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} BerberOS. Tüm hakları saklıdır.
        </div>
      </div>
      
      <style jsx>{`
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        .social-link:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
          background: var(--color-gold-muted);
        }
      `}</style>
    </footer>
  );
}
