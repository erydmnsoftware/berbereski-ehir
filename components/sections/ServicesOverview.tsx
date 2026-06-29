import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function ServicesOverview() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.15 });

  return (
    <section className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div ref={ref} className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="reveal-item">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Saç Kesim
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
            Yüz hatlarınıza ve tarzınıza uygun, klasik veya modern kesimler. Her kesimde ince işçilik ve profesyonellik ön plandadır.
          </p>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-white text-[14px] underline mt-8 hover:gap-3 transition-all duration-300"
          >
            Hizmeti Keşfet <ArrowRight size={14} />
          </a>
        </div>
        <div className="reveal-item">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Sakal Kesim & Düzeltme
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
            Keskin ve bakımlı bir görünüm için profesyonel sakal şekillendirme. Doğal düzeltmelerden cesur tarzlara kadar, sakalınızı en iyi halinde tutuyoruz.
          </p>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-white text-[14px] underline mt-8 hover:gap-3 transition-all duration-300"
          >
            Hizmeti Keşfet <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
