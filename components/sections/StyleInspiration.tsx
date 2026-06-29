import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const styles = [
  {
    id: 'classic-cut',
    label: 'Klasik Kesim',
    title: 'Zamansız ve Temiz',
    description:
      'Modası asla geçmeyen, dengeli ve özenli bir saç kesimi. Sadelik, düzen ve klasik bir görünüm arayanlar için mükemmel.',
    image: '/galeri_5.jpg',
  },
  {
    id: 'modern-fade',
    label: 'Modern Fade',
    title: 'Cesur ve Belirgin',
    description:
      'Ciltten başlayarak kusursuz bir şekilde uzayan keskin ve çağdaş bir kesim. Özgüvenli ve modern erkekler için özel olarak tasarlandı.',
    image: '/galeri_6.jpg',
  },
  {
    id: 'textured-crop',
    label: 'Dokulu Kesim',
    title: 'Zahmetsiz Tarz',
    description:
      'Doğal hareket ve hacim sağlayan katmanlı, dokulu kesim. Hem günlük bakımı kolay hem de karakterinizi ön plana çıkarır.',
    image: '/images/service-haircut-2.jpg',
  },
  {
    id: 'beard-styling',
    label: 'Sakal Şekillendirme',
    title: 'Keskin ve Bakımlı',
    description:
      'Yüz hatlarınızı belirginleştiren ve çene yapınızı güçlendiren uzman sakal şekillendirmesi. İyi bakılmış bir sakal, her tarzı tamamlar.',
    image: '/images/service-beard-2.jpg',
  },
  {
    id: 'full-grooming',
    label: 'VIP Bakım Görünümü',
    title: 'Tam Kapsamlı Paket',
    description:
      'Hassas bir saç kesimini detaylı sakal bakımı ve cilt temizliğiyle birleştiren VIP bir deneyim. Her açıdan kusursuz görünüm.',
    image: '/images/service-grooming-1.jpg',
  },
];

export default function StyleInspiration() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRef = useScrollReveal<HTMLDivElement>({ stagger: 0.1 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  return (
    <section className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10">
        {/* Left: Accordion */}
        <div ref={textRef}>
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Tarz İlhamı
          </h2>
          <p className="reveal-item text-[16px] leading-[1.65] text-[#a0a0a0] mt-4 mb-10">
            Modern trendleri, klasik teknikleri ve bireysel karakterinizi yansıtan size özel tarzları keşfedin. Her görünüm, özgüveninizi artırmak ve kişisel stilinizi vurgulamak için tasarlandı.
          </p>

          <div className="reveal-item">
            {styles.map((style, index) => (
              <button
                key={style.id}
                onClick={() => setActiveIndex(index)}
                className={`w-full flex items-center justify-between py-5 border-b border-[#333333] text-left transition-all duration-300 group ${
                  activeIndex === index ? 'pl-3 border-l-2 border-l-white' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <span className="text-[16px] text-white">{style.label}</span>
                <ArrowRight
                  size={16}
                  className={`text-[#a0a0a0] transition-transform duration-300 ${
                    activeIndex === index ? 'translate-x-1' : 'group-hover:translate-x-1'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Image Display */}
        <div className="flex flex-col justify-center">
          <div ref={imageRef} className="overflow-hidden rounded shadow-card">
            <img loading="lazy" decoding="async"
              src={styles[activeIndex].image}
              alt={styles[activeIndex].title}
              className="w-full aspect-[3/4] object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
            />
          </div>
          <h3 className="text-[24px] font-medium leading-[1.3] text-white mt-6">
            {styles[activeIndex].title}
          </h3>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-2">
            {styles[activeIndex].description}
          </p>
        </div>
      </div>
    </section>
  );
}
