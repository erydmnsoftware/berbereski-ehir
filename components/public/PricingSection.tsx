export default function PricingSection() {
  const categories = [
    {
      name: "Saç & Sakal",
      items: [
        { name: "Klasik Saç Kesimi", price: "200 ₺", desc: "Yıkama ve şekillendirme dahil" },
        { name: "Modern Saç Tasarımı", price: "250 ₺", desc: "Kişiye özel analiz ve kesim" },
        { name: "Sakal Kesimi", price: "100 ₺", desc: "Makine ile kısaltma ve düzeltme" },
        { name: "VIP Sakal Tasarımı", price: "150 ₺", desc: "Ustura ile detaylı şekillendirme" },
        { name: "Saç & Sakal Kombo", price: "350 ₺", desc: "Tam kapsamlı saç ve sakal bakımı" }
      ]
    },
    {
      name: "Bakım & Renklendirme",
      items: [
        { name: "Klasik Cilt Bakımı", price: "250 ₺", desc: "Temizleme ve nemlendirme" },
        { name: "VIP Cilt Bakımı", price: "350 ₺", desc: "Buhar, siyah nokta temizliği, maske" },
        { name: "Saç Boyama", price: "500 ₺", desc: "Profesyonel renklendirme" },
        { name: "Beyaz Kapatma", price: "300 ₺", desc: "Doğal görünümlü beyaz kırma" },
        { name: "Keratin Bakımı", price: "400 ₺", desc: "Yıpranmış saçlar için onarıcı bakım" }
      ]
    }
  ];

  return (
    <section id="fiyatlar" className="section">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Fiyatlarımız</span>
          <h2 className="section-title">Şeffaf Fiyatlandırma</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="grid-2" style={{ marginTop: '3rem' }}>
          {categories.map((category, index) => (
            <div key={index} className={`card reveal reveal-delay-${index + 1} price-card`} style={{ padding: '2.5rem' }}>
              <h3 className="heading-md" style={{ color: 'var(--color-gold)', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                {category.name}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {category.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text)' }}>{item.name}</span>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-gold)' }}>{item.price}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{item.desc}</span>
                      <div style={{ flex: 1, borderBottom: '1px dashed var(--color-border)', opacity: 0.5 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="reveal reveal-delay-3" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            VIP Paketlerimiz ve size özel çözümlerimiz için iletişime geçin.
          </p>
          <a href="/randevu" className="btn btn-primary">Hemen Randevu Al</a>
        </div>
      </div>
    </section>
  );
}
