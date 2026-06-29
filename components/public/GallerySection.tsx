'use client';

const gallery = [
  {
    src: '/sac_kesim.jpg',
    alt: 'Profesyonel Saç Kesimi',
    span: false
  },
  {
    src: '/sakal_kesim.jpg',
    alt: 'Sakal Düzeltme ve Tasarım',
    span: false
  },
  {
    src: '/cilt_bakim.jpg',
    alt: 'VIP Cilt Bakımı',
    span: true
  },
  {
    src: '/vip_hizmet.jpg',
    alt: 'VIP Hizmet Deneyimi',
    span: false
  },
  {
    src: '/hero_bg.png',
    alt: 'Salon İç Mekan',
    span: false
  },
  {
    src: '/logo.png',
    alt: 'BerberEskişehir VIP Logo',
    span: true
  }
];

export default function GallerySection() {
  return (
    <section id="galeri" className="section">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Galeri</span>
          <h2 className="section-title">Salonumuzdan Kareler</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">
            VIP salonumuzdan ve çalışma anlarımızdan özenle seçilmiş görüntüler.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '280px',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          {gallery.map((item, index) => (
            <div 
              key={index} 
              className={`reveal reveal-delay-${(index % 3) + 1}`} 
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                gridColumn: item.span ? 'span 2' : 'span 1',
                cursor: 'pointer'
              }}
            >
              <img loading="lazy" decoding="async" 
                src={item.src} 
                alt={item.alt} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: item.src === '/logo.png' ? 'contain' : 'cover',
                  background: item.src === '/logo.png' ? 'var(--color-surface)' : 'transparent',
                  transition: 'transform 0.6s ease'
                }} 
                className="gallery-img"
              />
              {/* Alt yazı overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0, right: 0,
                padding: '2rem 1.5rem 1rem',
                background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }} className="gallery-overlay">
                <span style={{ 
                  color: '#fff', 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                }}>{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gallery-img {
          transform: scale(1);
        }
        .reveal:hover .gallery-img {
          transform: scale(1.08);
        }
        .reveal:hover .gallery-overlay {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
          div[style*="grid-column: span 2"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
