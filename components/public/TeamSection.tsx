'use client';

const team = [
  {
    id: 1,
    name: 'Mehmet Usta',
    role: 'Baş Berber',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '15 yıllık deneyimiyle modern ve klasik stillerin ustası.'
  },
  {
    id: 2,
    name: 'Ali Kaya',
    role: 'VIP Uzmanı',
    image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'VIP hizmetleri ve cilt bakımı konusunda uzman.'
  },
  {
    id: 3,
    name: 'Can Demir',
    role: 'Sakal Ustası',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Sakal şekillendirme ve bakımının ismi.'
  }
];

export default function TeamSection() {
  return (
    <section id="ekip" className="section" style={{ background: 'var(--color-bg-2)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Ekibimiz</span>
          <h2 className="section-title">Usta Eller</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">
            Her biri alanında uzman, tarzınızı en iyi şekilde yansıtacak profesyonel ekibimizle tanışın.
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: '3rem' }}>
          {team.map((member, index) => (
            <div key={member.id} className={`reveal reveal-delay-${index + 1}`} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                overflow: 'hidden', 
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                <img loading="lazy" decoding="async" 
                  src={member.image} 
                  alt={member.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }} 
                  className="team-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 50%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="team-overlay">
                  <button className="btn btn-primary btn-sm">Randevu Al</button>
                </div>
              </div>
              <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>{member.name}</h3>
              <div style={{ color: 'var(--color-gold)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{member.role}</div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .team-img {
          transform: scale(1);
        }
        .reveal:hover .team-img {
          transform: scale(1.05);
        }
        .reveal:hover .team-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
