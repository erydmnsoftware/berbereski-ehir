const testimonials = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Düzenli Müşteri',
    content: 'Eskişehir\'de gittiğim en iyi berber. VIP hizmeti gerçekten hissettiriyorlar. Temizlik ve hijyen üst düzeyde, çalışanlar çok ilgili.',
    rating: 5
  },
  {
    id: 2,
    name: 'Burak Keskin',
    role: 'VIP Müşteri',
    content: 'Özellikle cilt bakımı ve saç kesimini birlikte aldığım VIP paketten çok memnunum. Kendinize zaman ayırmak istiyorsanız kesinlikle tavsiye ederim.',
    rating: 5
  },
  {
    id: 3,
    name: 'Cem Öztürk',
    role: 'Yeni Müşteri',
    content: 'İlk defa geldim ve çok memnun kaldım. Randevu sistemi çok pratik, bekleme yapmıyorsunuz. Kesim tam istediğim gibi oldu.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="section" style={{ background: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background element */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'var(--color-gold-muted)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header reveal">
          <span className="section-tag">Yorumlar</span>
          <h2 className="section-title">Müşterilerimiz Ne Diyor?</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="grid-3" style={{ marginTop: '3rem' }}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={`card card-glass reveal reveal-delay-${index + 1}`} style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--color-gold)', marginBottom: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                "{testimonial.content}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-gold-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="heading-md" style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{testimonial.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
