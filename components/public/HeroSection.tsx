import Link from 'next/link';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background Image with Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/hero_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2,
      }} />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.8) 100%)',
        zIndex: -1,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
        <div className="animate-fade-in-up">
          <span className="section-tag" style={{ marginBottom: '1.5rem' }}>Eskişehir'in En Prestijli Erkek Kuaförü</span>
          
          <h1 className="heading-display" style={{ marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Tarzınızı <span className="text-gradient-gold">Sanata</span> Dönüştürüyoruz
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: '#ccc', marginBottom: '2.5rem', lineHeight: 1.8 }}>
            Geleneksel berber ustalığını modern tasarım anlayışıyla harmanlıyoruz. 
            VIP salonumuzda size özel deneyimi yaşayın.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/randevu" className="btn btn-primary btn-lg">
              Hemen Randevu Al
            </Link>
            <Link href="#hizmetler" className="btn btn-outline btn-lg">
              Hizmetlerimizi İncele
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="animate-float" style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-gold)',
        opacity: 0.7
      }}>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aşağı Kaydır</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-gold), transparent)' }} />
      </div>
    </section>
  );
}
