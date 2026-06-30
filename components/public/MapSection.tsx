export default function MapSection() {
  return (
    <section id="konum" className="section-sm" style={{ paddingBottom: 0 }}>
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div className="section-header reveal">
          <span className="section-tag">Konum</span>
          <h2 className="section-title">Bizi Ziyaret Edin</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">
            Merkez, İstanbul — Kolayca ulaşabileceğiniz merkezi konumumuz.
          </p>
        </div>
      </div>

      <div className="reveal" style={{
        width: '100%',
        height: '450px',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-surface)'
      }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.1234567890!2d30.5256!3d39.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ2JzAwLjEiTiAzMMKwMzEnMzIuMiJF!5e0!3m2!1str!2str!4v1719100000000!5m2!1str!2str"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.2) contrast(0.9)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="BerberOS Konum"
        />

        {/* Üstte gold gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '60px',
          background: 'linear-gradient(to bottom, var(--color-bg), transparent)',
          pointerEvents: 'none',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '60px',
          background: 'linear-gradient(to top, var(--color-bg-2), transparent)',
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {/* Konum Bilgi Kartı */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          zIndex: 3,
          background: 'rgba(20, 20, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border-hover)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 2rem',
          maxWidth: '360px',
          boxShadow: 'var(--shadow-gold)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--color-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0
            }}>📍</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700 }}>BerberOS</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Merkez Şube, İstanbul, Türkiye
          </p>
          <a
            href="https://share.google/22hQ1RUsFYY9RBSIO"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Google Maps'te Aç →
          </a>
        </div>
      </div>
    </section>
  );
}
