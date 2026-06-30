export default function AboutSection() {
  return (
    <section id="hakkimizda" className="section">
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          <div className="reveal">
            <span className="section-tag">Hakkımızda</span>
            <h2 className="section-title">Geleneksel Ustalık,<br />Modern Yaklaşım</h2>
            <div className="gold-divider" style={{ margin: '1.5rem 0' }}></div>
            
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Şehrin kalbinde, sadece bir berber dükkanı değil, erkekler için özel bir yaşam alanı yarattık. VIP hizmet anlayışımızla sıradan bir saç kesimini bir deneyime dönüştürüyoruz.
            </p>
            
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Yılların getirdiği deneyimi, sürekli yenilenen trendlerle birleştirerek size en uygun stili tasarlıyoruz. Kaliteli ürünler, hijyenik ortam ve profesyonel ekibimizle her zaman en iyisini sunmayı hedefliyoruz.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ borderLeft: '2px solid var(--color-gold)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontWeight: 700, lineHeight: 1 }}>15+</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Yıllık Deneyim</div>
              </div>
              <div style={{ borderLeft: '2px solid var(--color-gold)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontWeight: 700, lineHeight: 1 }}>5K+</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Mutlu Müşteri</div>
              </div>
            </div>
          </div>
          
          <div className="reveal reveal-delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              position: 'absolute', 
              width: '80%', 
              height: '80%', 
              background: 'var(--color-gold-muted)', 
              borderRadius: 'var(--radius-full)', 
              filter: 'blur(60px)',
              zIndex: -1
            }}></div>
            <img loading="lazy" decoding="async" 
              src="/logo.png" 
              alt="BerberOS" 
              style={{ width: '70%', maxWidth: '400px', filter: 'drop-shadow(0 0 30px rgba(212, 168, 83, 0.3))' }} 
              className="animate-float"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
