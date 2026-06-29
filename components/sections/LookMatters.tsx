import { useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const images = [
  { src: '/images/look-1.jpg', label: 'Saç Tasarımı' },
  { src: '/images/look-2.jpg', label: 'VIP Deneyim' },
  { src: '/images/look-3.jpg', label: 'İnce İşçilik' },
  { src: '/images/look-4.jpg', label: 'Klasik Kesim' },
  { src: '/images/service-beard-1.jpg', label: 'Sakal Bakımı' },
];

export default function LookMatters() {
  const textRef = useScrollReveal<HTMLDivElement>();
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;
    
    const swiper = new Swiper(swiperRef.current, {
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
      slidesPerView: 1.3,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      speed: 900,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 120,
        modifier: 1.5,
        slideShadows: false
      },
      breakpoints: {
        768: { slidesPerView: 2.5 },
        1200: { slidesPerView: 3.5 }
      }
    });

    return () => {
      swiper.destroy(true, true);
    };
  }, []);

  return (
    <section className="bg-[#111111] py-[100px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div ref={textRef} className="max-w-[600px] mb-16">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Çünkü Tarzınız Önemli
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4 max-w-[560px]">
            İyi görünmek sadece modaya uymak değil, özgüveninizi, duruşunuzu ve her gün nasıl hissettiğinizi yansıtmaktır. Ustalıkla yapılmış bir saç kesimi ve özenli bir sakal tasarımı, duruşunuzu ve dünyanın sizi nasıl gördüğünü baştan aşağı değiştirebilir.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div ref={swiperRef} className="swiper gallery-swiper pb-10">
          <div className="swiper-wrapper">
            {images.map((img, i) => (
              <div key={i} className="swiper-slide">
                <div className="gallery-item rounded-lg overflow-hidden shadow-card">
                  <img loading="lazy" decoding="async" src={img.src} alt={img.label} className="w-full aspect-[4/5] object-cover" />
                  <div className="gallery-overlay">
                    <span>{img.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .gallery-item { 
          position: relative; 
          overflow: hidden; 
          transform: translateZ(0); /* Safari fix */
        }
        .gallery-overlay {
          position: absolute; 
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
          opacity: 0;
          display: flex; 
          align-items: flex-end;
          padding: 20px;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .gallery-item:hover .gallery-overlay { 
          opacity: 1; 
        }
        .gallery-overlay span {
          color: #c9a84c;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          transform: translateY(10px);
          transition: transform 0.4s ease;
        }
        .gallery-item:hover .gallery-overlay span {
          transform: translateY(0);
        }
        .gallery-item img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-item:hover img { 
          transform: scale(1.06); 
        }
      `}</style>
    </section>
  );
}
