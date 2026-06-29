'use client';

import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'Saç Kesim',
    description: 'Yüz hatlarınıza uygun, trendleri yansıtan veya klasik saç kesim tasarımları.',
    image: '/sac_kesim.jpg',
    price: '250 ₺',
    duration: '30 Dk'
  },
  {
    id: 2,
    title: 'Sakal Kesim',
    description: 'Ustura tıraşı ve modern makine kesimi ile kusursuz sakal tasarımı.',
    image: '/sakal_kesim.jpg',
    price: '150 ₺',
    duration: '20 Dk'
  },
  {
    id: 3,
    title: 'Cilt Bakım',
    description: 'Siyah nokta temizliği, buhar terapisi ve özel maskelerle VIP cilt bakımı.',
    image: '/cilt_bakim.jpg',
    price: '350 ₺',
    duration: '45 Dk'
  },
  {
    id: 4,
    title: 'VIP Hizmet',
    description: 'Saç, sakal, cilt bakımı ve özel içecek ikramlarıyla tam kapsamlı premium deneyim.',
    image: '/vip_hizmet.jpg',
    price: '650 ₺',
    duration: '90 Dk'
  }
];

export default function ServicesSection() {
  return (
    <section id="hizmetler" className="section" style={{ background: 'var(--color-bg-2)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Hizmetlerimiz</span>
          <h2 className="section-title">Premium Deneyimi Yaşayın</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">
            Usta ellerde şekillenen tarzınızla fark yaratın. İhtiyacınıza özel tasarlanmış profesyonel bakım hizmetlerimiz.
          </p>
        </div>

        <div className="grid-4" style={{ marginTop: '3rem' }}>
          {services.map((service, index) => (
            <div key={service.id} className={`card reveal reveal-delay-${index + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img loading="lazy" decoding="async" 
                  src={service.image} 
                  alt={service.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} 
                  className="service-img"
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(8,8,8,0.7)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-gold)',
                  color: 'var(--color-gold)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  {service.price}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 className="heading-md">{service.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>⏱ {service.duration}</span>
                </div>
                
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                  {service.description}
                </p>
                
                <Link href={`/randevu?service=${service.title}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Randevu Al
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .card:hover .service-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
