import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmet Y.',
    quote: "Serkan Mermer ve ekibi gerçekten işinin ehli. Yıllardır saçımı başka kimseye kestirmedim. Eskişehir'de VIP hizmet arayanlar için tek adres.",
    rating: 5,
    color: 'bg-[#4285F4]' // Google blue
  },
  {
    name: 'Burak K.',
    quote: "Randevu sistemi harika, tam saatinde koltuğa oturuyorsunuz. Kullanılan ürünler kaliteli, hijyen üst düzey. Harika bir deneyim.",
    rating: 5,
    color: 'bg-[#0F9D58]' // Google green
  },
  {
    name: 'Cem T.',
    quote: "Sakal tasarımı ve cilt bakımında Serkan Bey'in üstüne tanımam. İlgi, alaka ve kahve ikramları için çok teşekkürler.",
    rating: 5,
    color: 'bg-[#DB4437]' // Google red
  },
  {
    name: 'Hakan M.',
    quote: "Eskişehir'in en klas kuaför salonu. İçerideki atmosfer, dekorasyon ve müzikler çok başarılı. Kendinizi çok özel hissediyorsunuz.",
    rating: 5,
    color: 'bg-[#F4B400]' // Google yellow
  },
  {
    name: 'Sinan E.',
    quote: "Uzun süredir Eskişehir'de profesyonel bir kuaför arıyordum, BerberEskişehir VIP beklentilerimin çok ötesinde. Herkese tavsiye ederim.",
    rating: 5,
    color: 'bg-[#4285F4]'
  }
];

export default function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="testimonials" className="bg-[#111111] py-[120px] px-5 md:px-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img loading="lazy" decoding="async" src="/logo.png" alt="Google" className="h-6 object-contain" />
              <span className="text-white font-medium">Google Yorumları</span>
            </div>
            <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
              Müşterilerimiz Neler Söylüyor
            </h2>
            <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4 max-w-[600px]">
              Her bir müşterimize değer veriyor, sürekli yüksek kalite ve harika bir VIP deneyimi sunmaktan gurur duyuyoruz.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 border border-[#333333] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Önceki Yorum"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 border border-[#333333] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Sonraki Yorum"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6"
              >
                <div className="bg-[#161616] border border-[#222222] p-8 rounded shadow-card h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4 text-[#fbbc05]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[15px] leading-[1.6] text-[#e0e0e0] flex-grow mb-6 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg ${t.color}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[16px] font-medium text-white">{t.name}</h4>
                      <p className="text-[13px] text-[#888888]">Google Yorumu</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
