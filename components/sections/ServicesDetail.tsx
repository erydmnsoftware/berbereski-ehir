import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'Saç Kesim',
    description:
      'Tarzınıza, yüz hatlarınıza ve günlük rutininize uygun, size özel tasarlanmış profesyonel saç kesimi.',
    texts: [
      'Klasik kesimlerden modern geçişlere (fade), her detay hassasiyetle ve profesyonel tekniklerle şekillendirilir.',
      'Koltuğumuzdan kalktıktan çok sonra bile tarzınızı korumanızı sağlayacak şekillendirme ve bakım önerileriyle tamamlanır.',
    ],
    images: ['/images/service-haircut-1.jpg', '/images/service-haircut-2.jpg'],
  },
  {
    number: '02',
    title: 'Sakal Kesimi',
    description:
      'Doğal yüz hatlarınızı ve kişisel tarzınızı ön plana çıkarmak için tasarlanmış profesyonel sakal düzeltme.',
    texts: [
      'Keskin ve bakımlı bir bitiş için temiz çizgilere, dengeli şekillendirmeye ve doğru uzunluğa odaklanıyoruz.',
      'Günlük bakım ve koruma için uzman tavsiyeleri ve sakal nemlendirme işlemlerini içerir.',
    ],
    images: ['/images/service-beard-1.jpg', '/images/service-beard-2.jpg'],
  },
  {
    number: '03',
    title: 'VIP Kombo Paket',
    description:
      'Saç ve sakal bakımını kusursuz bir seansta birleştiren, tam kapsamlı premium bir bakım deneyimi.',
    texts: [
      'Konfora, sürekliliğe ve her bir detaya önem verenler için mükemmel bir seçim.',
      'Günün yorgunluğunu atın, yenilenin ve özgüveninizi yansıtan şık bir görünümle ayrılın.',
    ],
    images: ['/images/service-grooming-1.jpg', '/images/service-grooming-2.jpg'],
  },
];

export default function ServicesDetail() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const items = sectionRef.current!.querySelectorAll('.service-card');
      
      // GSAP ScrollTrigger for cards
      gsap.from(items, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      // Inner element animations for cards (Numbers, texts, images)
      items.forEach((item, i) => {
        const num = item.querySelector('.service-num');
        const imgs = item.querySelectorAll('.service-img');
        const txts = item.querySelectorAll('.service-txt');

        gsap.fromTo(num, { x: -30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, delay: i * 0.2,
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
        });
        gsap.fromTo(imgs, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, delay: i * 0.2 + 0.15, stagger: 0.1,
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
        });
        gsap.fromTo(txts, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, delay: i * 0.2 + 0.1, stagger: 0.08,
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    }, sectionRef);

    // VanillaTilt Initialization (Desktop Only)
    let tiltNodes: HTMLElement[] = [];
    if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tiltNodes = Array.from(sectionRef.current.querySelectorAll('.tilt-card'));
      VanillaTilt.init(tiltNodes, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        perspective: 1000,
      });
    }

    return () => {
      ctx.revert();
      tiltNodes.forEach(node => {
        if ((node as any).vanillaTilt) {
          (node as any).vanillaTilt.destroy();
        }
      });
    };
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-20">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Hizmetlerimiz
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4 max-w-[600px]">
            Tüm hizmetlerimiz detaya gösterilen özen, profesyonel teknikler ve bireysel stile odaklanarak sunulur. Her müşteri için tutarlı ve yüksek kaliteli sonuçlar sağlamak adına modern yöntemleri zamansız berberlik gelenekleriyle birleştiriyoruz.
          </p>
        </div>

        <div className="space-y-10">
          {services.map((service) => (
            <div key={service.number} className="service-card tilt-card border border-[#333333] p-10 lg:p-16 rounded-xl bg-[#161616]">
              <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10">
                {/* Left: Text */}
                <div>
                  <div className="service-num text-[96px] font-light leading-[1] tracking-[-0.04em] text-white opacity-0">
                    {service.number}
                  </div>
                  <div className="mt-6 space-y-4">
                    {service.texts.map((text, i) => (
                      <p key={i} className="service-txt text-[14px] leading-[1.6] text-[#a0a0a0] opacity-0">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right: Images + Title */}
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {service.images.map((img, i) => (
                      <div
                        key={i}
                        className="service-img overflow-hidden rounded shadow-card opacity-0"
                      >
                        <img loading="lazy" decoding="async"
                          src={img}
                          alt={service.title}
                          className="w-full aspect-[3/4] object-cover hover:scale-105 hover:brightness-110 transition-all duration-500"
                        />
                      </div>
                    ))}
                  </div>
                  <h3 className="service-txt text-[24px] font-medium leading-[1.3] text-white mt-6 opacity-0">
                    {service.title}
                  </h3>
                  <p className="service-txt text-[16px] leading-[1.65] text-[#a0a0a0] mt-2 max-w-[400px] opacity-0">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .service-card {
          transform-style: preserve-3d;
          will-change: transform;
          transition: box-shadow 0.3s ease;
        }
        .service-card:hover {
          box-shadow: 0 20px 60px rgba(201, 168, 76, 0.15);
        }
      `}</style>
    </section>
  );
}
