import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Space() {
  const headerRef = useScrollReveal<HTMLDivElement>({ stagger: 0.12 });
  const gridRef = useScrollReveal<HTMLDivElement>({ stagger: 0.15, delay: 0.2 });

  return (
    <section className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <div className="reveal-item">
            <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
              Salonumuzdan Kareler
            </h2>
            <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
              Konforunuz düşünülerek tasarlanan salonumuzda, klasik detayları modern bir atmosferle harmanlıyoruz.
            </p>
          </div>
          <div className="reveal-item flex items-end">
            <p className="text-[16px] leading-[1.65] text-[#a0a0a0]">
              Stil, kalite ve rahatlığın bir araya geldiği, özenle oluşturulmuş mekanımızın her bir detayı VIP hissetmeniz için tasarlandı.
            </p>
          </div>
        </div>

        {/* Image Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left - Large */}
          <div className="reveal-item overflow-hidden rounded shadow-card md:row-span-2">
            <img loading="lazy" decoding="async"
              src="/galeri_1.jpg"
              alt="Salon İçi Görünüm"
              className="w-full h-full object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
            />
          </div>

          {/* Center - Text + Image */}
          <div className="reveal-item flex flex-col gap-5">
            <div>
              <h4 className="text-[18px] font-medium leading-[1.4] text-white">
                Özenli Atmosfer
              </h4>
              <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mt-2">
                Sıcak aydınlatmalar, kaliteli materyaller ve özenli bir yerleşim, kusursuz bir deneyim için doğru tonu belirliyor. İç mekan tasarımımız, detaya ve zamansız stile olan bağlılığımızı yansıtıyor.
              </p>
            </div>
            <div className="overflow-hidden rounded shadow-card h-full">
              <img loading="lazy" decoding="async"
                src="/galeri_2.jpg"
                alt="Salon Atmosferi"
                className="w-full h-full object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
              />
            </div>
          </div>

          {/* Right - Two stacked */}
          <div className="reveal-item flex flex-col gap-5">
            <div className="overflow-hidden rounded shadow-card h-[50%]">
              <img loading="lazy" decoding="async"
                src="/galeri_3.jpg"
                alt="Bekleme Alanı"
                className="w-full h-full object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
              />
            </div>
            <div className="overflow-hidden rounded shadow-card h-[50%]">
              <img loading="lazy" decoding="async"
                src="/galeri_4.jpg"
                alt="Salon Detay"
                className="w-full h-full object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
