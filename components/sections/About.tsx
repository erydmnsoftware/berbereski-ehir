import { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CountUp } from 'countup.js';

const images = [
  '/images/about-portrait-1.jpg',
  '/images/about-portrait-2.jpg',
  '/images/about-portrait-3.jpg',
];

export default function About() {
  const textRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const carouselRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7, delay: 0.3 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!statsRef.current) return;
    
    // Sayaç Animasyonu
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const statElements = statsRef.current?.querySelectorAll('.stat-num');
        statElements?.forEach((el) => {
          const targetStr = (el as HTMLElement).dataset.target;
          if (!targetStr) return;
          const target = parseFloat(targetStr);
          const decimals = target % 1 !== 0 ? 1 : 0;
          const countUpAnim = new CountUp(el as HTMLElement, target, { 
            duration: 2.5, 
            decimalPlaces: decimals,
            separator: '.',
            decimal: ',' 
          });
          if (!countUpAnim.error) {
            countUpAnim.start();
          } else {
            console.error(countUpAnim.error);
          }
        });
      }
    });
  }, []);

  return (
    <section id="about" className="bg-[#111111] py-[100px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 items-center">
        {/* Left: Text */}
        <div ref={textRef}>
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Hakkımızda
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-5 max-w-[440px]">
            BerberOS, geleneksel berber ustalığını modern bir konseptle birleştiren Şehrin premium erkek kuaför salonudur. Amacımız sadece saç kesmek değil, rahat ve lüks bir ortamda kendinizi özel hissedeceğiniz bir deneyim sunmaktır.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
            <div className="border-t border-[#333333] pt-6">
              <h4 className="text-[18px] font-medium leading-[1.4] text-white">
                İnce İşçilik
              </h4>
              <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mt-2">
                Her saç kesimi ve sakal tasarımı, özenle ve profesyonel tekniklerle uygulanır. Yüz tipinize en uygun modern ve klasik tarzları özenle belirliyoruz.
              </p>
            </div>
            <div className="border-t border-[#333333] pt-6">
              <h4 className="text-[18px] font-medium leading-[1.4] text-white">
                Bir Saç Kesiminden Fazlası
              </h4>
              <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mt-2">
                Salonumuzu ziyaretiniz, sıradan bir tıraştan çok daha fazlasıdır. Günlük koşturmacaya ara verip, kendinize zaman ayıracağınız VIP bir deneyimdir.
              </p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 border-t border-[#333333] pt-8">
            <div className="stat-item text-center">
              <div className="text-[32px] font-light text-[#c9a84c] mb-1">
                <span className="stat-num" data-target="2500">0</span><span className="stat-suffix">+</span>
              </div>
              <p className="text-[12px] text-[#a0a0a0] uppercase tracking-widest">Mutlu Müşteri</p>
            </div>
            <div className="stat-item text-center">
              <div className="text-[32px] font-light text-[#c9a84c] mb-1">
                <span className="stat-num" data-target="8">0</span>
              </div>
              <p className="text-[12px] text-[#a0a0a0] uppercase tracking-widest">Yıllık Deneyim</p>
            </div>
            <div className="stat-item text-center">
              <div className="text-[32px] font-light text-[#c9a84c] mb-1">
                <span className="stat-num" data-target="12">0</span>
              </div>
              <p className="text-[12px] text-[#a0a0a0] uppercase tracking-widest">Usta Berber</p>
            </div>
            <div className="stat-item text-center">
              <div className="text-[32px] font-light text-[#c9a84c] mb-1">
                <span className="stat-num" data-target="4.9">0</span>
              </div>
              <p className="text-[12px] text-[#a0a0a0] uppercase tracking-widest">Google Puanı ⭐</p>
            </div>
          </div>
        </div>

        {/* Right: Embla Carousel */}
        <div ref={carouselRef} className="relative w-full max-w-[500px] mx-auto lg:ml-auto">
          <div className="overflow-hidden rounded shadow-card" ref={emblaRef}>
            <div className="flex">
              {images.map((src, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[450px] md:h-[550px]" key={index}>
                  <img loading="lazy" decoding="async"
                    src={src}
                    alt={`İstanbul Barber VIP Style ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
