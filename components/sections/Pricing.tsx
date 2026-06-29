import { useScrollReveal } from '@/hooks/useScrollReveal';
import Link from 'next/link';

const hairServices = [
  { name: 'Saç Kesim', duration: '30 Dakika', price: '250₺' },
  { name: 'Saç Boyama', duration: '90 Dakika', price: '500₺' },
  { name: 'Ense Düzeltme', duration: '15 Dakika', price: '100₺' },
];

const beardServices = [
  { name: 'Sakal Kesim & Düzeltme', duration: '20 Dakika', price: '150₺' },
  { name: 'Cilt Bakım', duration: '45 Dakika', price: '350₺' },
  { name: 'VIP Kombo Paket', duration: '90 Dakika', price: '650₺' },
];

export default function Pricing() {
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>({ stagger: 0.08, delay: 0.2 });

  return (
    <section id="pricing" className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16">
        {/* Left: Intro */}
        <div ref={leftRef}>
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Şeffaf Fiyatlandırma
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
            Fiyatlandırmamız şeffaf ve anlaşılırdır; her bir hizmetimizin ardındaki kaliteyi, ustalığı ve özeni yansıtır.
          </p>
          <p className="text-[16px] leading-[1.65] text-white mt-8">
            Sürpriz ödemeler yok — sadece dürüst fiyatlar ve premium VIP hizmetler.
          </p>
          <Link
            href="/randevu"
            className="inline-block mt-8 text-[14px] font-medium text-white border border-white px-8 py-3 hover:bg-white hover:text-[#111111] transition-all duration-300"
          >
            Randevu Al
          </Link>
        </div>

        {/* Right: Pricing Tables */}
        <div ref={rightRef}>
          <div className="reveal-item">
            <h3 className="text-[24px] font-medium leading-[1.3] text-white mb-2">
              Saç Hizmetleri
            </h3>
            <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mb-8">
              Rahatlık, hassasiyet ve kalıcı bir tarz için tasarlanmış profesyonel saç kesimleri.
            </p>
            <div className="space-y-0">
              {hairServices.map((service) => (
                <div
                  key={service.name}
                  className="price-card flex items-center justify-between py-4 border-b border-[#333333]"
                >
                  <span className="text-[16px] text-white">{service.name}</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[14px] text-[#6b6b6b]">{service.duration}</span>
                    <span className="text-[16px] text-white w-[60px] text-right">
                      {service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-item mt-12">
            <h3 className="text-[24px] font-medium leading-[1.3] text-white mb-2">
              Sakal & Cilt Bakımı
            </h3>
            <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mb-8">
              Kişisel tarzınıza uygun uzman sakal bakımı ve rahatlatıcı cilt bakım hizmetleri.
            </p>
            <div className="space-y-0">
              {beardServices.map((service) => (
                <div
                  key={service.name}
                  className="price-card flex items-center justify-between py-4 border-b border-[#333333]"
                >
                  <span className="text-[16px] text-white">{service.name}</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[14px] text-[#6b6b6b]">{service.duration}</span>
                    <span className="text-[16px] text-white w-[60px] text-right">
                      {service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
