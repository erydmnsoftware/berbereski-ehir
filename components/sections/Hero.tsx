"use client";

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

const accordionItems = [
  {
    title: 'Hakkımızda',
    content: 'Geleneksel ustalık, modern dokunuşlar ve detaya verdiğimiz önemle kurulan premium bir erkek kuaförüyüz.',
  },
  {
    title: 'Hizmetlerimiz',
    content: 'Klasik saç kesiminden modern saç ve sakal tasarımlarına, her detayda profesyonellik ve hassasiyet sunuyoruz.',
  },
  {
    title: 'Tarzımız',
    content: 'Modern trendleri, klasik teknikleri ve bireysel karakterinizi yansıtan size özel tarzları keşfedin.',
  },
  {
    title: 'Ekibimiz',
    content: 'Ekibimiz, işine tutkuyla bağlı, stil ve kaliteye önem veren alanında uzman profesyonellerden oluşmaktadır.',
  },
  {
    title: 'Müşteri Memnuniyeti',
    content: 'Her müşterimize değer veriyor, sürekli yüksek kalite ve harika bir deneyim sunmaktan gurur duyuyoruz.',
  },
];

export default function Hero() {
  const [openIndex, setOpenIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP ScrollTrigger Kaydı
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      // 1. Hero Başlık Harf Harf Animasyonu: Premium Sinematik Blur Efekti
      const titleChars = gsap.utils.toArray('.hero-title-char');
      
      // Modern ve profesyonel bir giriş: Büyük, bulanık ve aşağıdan gelip netleşerek oturur
      gsap.fromTo(titleChars, 
        { 
          opacity: 0, 
          scale: 1.5, 
          filter: "blur(15px)", 
          y: 60 
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.04,
          duration: 1.6,
          ease: "expo.out",
          delay: 0.2
        }
      );

      // 2. Hero Görsel: Parallax Derinlik Efekti
      gsap.to(".hero-photo", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // 3. Hero Gold Çizgi: Soldan Sweep
      gsap.to(".gold-line", {
        width: "100%",
        duration: 1.2,
        ease: "power3.inOut",
        delay: 1.2
      });

      // 4. Hero Alt Metin: Fade Slide-In
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.9,
        ease: "power2.out",
        delay: 1.0
      });
    }, heroRef);

    // Particle Animation
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    let animationFrameId: number;
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    if (canvas) {
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReducedMotion) {
        canvas.style.display = 'none';
      } else {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);

          const particles = Array.from({length: 40}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.6 + 0.2
          }));

          const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
              ctx.fill();
              p.x += p.dx; p.y += p.dy;
              if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
              if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animationFrameId = requestAnimationFrame(animateParticles);
          };
          animateParticles();
        }
      }
    }

    return () => {
      ctx.revert();
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  // Metni harflere bölmek için yardımcı fonksiyon
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-title-char inline-block" style={{ transformOrigin: "0% 50% -50px" }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section id="hero" ref={heroRef} className="min-h-screen bg-[#111111] flex pt-[72px] overflow-hidden relative">
      <canvas id="particle-canvas" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',opacity:0.4,zIndex:0}}></canvas>
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left: Hero Image */}
        <div className="lg:w-[55%] h-[50vh] lg:h-auto relative overflow-hidden">
          <div className="hero-photo w-full h-[120%] -top-[10%] relative">
            <img loading="lazy" decoding="async"
              src="/images/hero-profile.jpg"
              alt="BerberOS"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-[45%] flex flex-col justify-center px-6 md:px-10 lg:pl-[60px] py-16 lg:py-0">
          <div>
            <h1 id="hero-title" className="text-[42px] sm:text-[56px] md:text-[72px] lg:text-[80px] font-light leading-[1.05] tracking-[-0.03em] text-white drop-shadow-lg [perspective:1000px]">
              {splitText("BerberOS")}
            </h1>
            
            {/* Gold Line */}
            <div className="relative mt-2 h-[2px] w-full max-w-[440px]">
              <div className="gold-line absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#c9a84c] to-[#f0d080]"></div>
            </div>

            <p className="hero-sub text-[16px] md:text-[18px] leading-[1.7] text-[#a0a0a0] max-w-[440px] mt-6 font-light">
              Şehrin premium erkek kuaföründe modern saç kesimi, uzman sakal bakımı ve eşsiz bir VIP hizmet deneyimi. Kalite, özgüven ve detaya önem veren erkekler için özel tasarlandı.
            </p>

            {/* Accordion */}
            <div className="hero-sub mt-12 max-w-[440px]">
              {accordionItems.map((item, index) => {
                const isActive = openIndex === index;
                return (
                  <div 
                    key={item.title} 
                    className={`border-b transition-colors duration-500 ${isActive ? 'border-[#d4a853]/50' : 'border-[#333333]'}`}
                  >
                    <button
                      onClick={() => handleAccordionClick(index)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className={`text-[15px] font-medium tracking-wide transition-all duration-300 ${
                        isActive ? 'text-[#d4a853] translate-x-2' : 'text-white group-hover:text-[#d4a853] group-hover:translate-x-1'
                      }`}>
                        {item.title}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive ? 'bg-[#d4a853]/10 text-[#d4a853] rotate-180' : 'bg-transparent text-[#666] group-hover:text-[#d4a853]'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isActive ? 'max-h-[150px] pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      style={{ transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s, opacity 0.5s' }}
                    >
                      <p className="text-[14px] leading-[1.7] text-[#a0a0a0] pl-2 border-l-2 border-[#d4a853]/30">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hero-sub mt-10 max-w-[440px]">
              <Link
                href="/randevu"
                className="group relative flex items-center justify-center w-full py-4 bg-transparent border border-white/20 text-white overflow-hidden transition-all duration-500 hover:border-[#d4a853] hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]"
              >
                <div className="absolute inset-0 w-0 bg-[#d4a853] transition-all duration-500 ease-out group-hover:w-full"></div>
                <span className="relative text-[14px] font-medium tracking-widest uppercase transition-colors duration-300 group-hover:text-black flex items-center gap-2">
                  Randevu Al
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </span>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="hero-sub mt-10 pt-8 border-t border-[#333333] max-w-[440px] space-y-5">
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#333] flex items-center justify-center text-[#a0a0a0] group-hover:text-[#d4a853] group-hover:border-[#d4a853]/50 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-[#d4a853]/20">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-[#6b6b6b] uppercase tracking-widest mb-1">Telefon / WhatsApp</div>
                  <a href="tel:+905551112233" className="text-[15px] font-light text-white group-hover:text-[#d4a853] transition-colors">
                    0555 000 00 00
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#333] flex items-center justify-center text-[#a0a0a0] group-hover:text-[#d4a853] group-hover:border-[#d4a853]/50 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-[#d4a853]/20">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-[#6b6b6b] uppercase tracking-widest mb-1">Adres</div>
                  <a
                    href="https://maps.google.com/maps?q=39.764024395045184,30.521873111957245"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-light text-white group-hover:text-[#d4a853] transition-colors"
                  >
                    Merkez, İstanbul
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#333] flex items-center justify-center text-[#a0a0a0] group-hover:text-[#d4a853] group-hover:border-[#d4a853]/50 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-[#d4a853]/20">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-[#6b6b6b] uppercase tracking-widest mb-1">Çalışma Saatleri</div>
                  <div className="text-[14px] text-white space-y-1 font-light mt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0F9D58] shadow-[0_0_8px_#0F9D58] animate-pulse"></span>
                      <span className="group-hover:text-white transition-colors">Pzt – Cuma: 09:00 – 19:00</span>
                    </div>
                    <div className="text-[#a0a0a0] pl-4">Cumartesi: 09:00 – 17:00</div>
                    <div className="text-[#555] pl-4">Pazar: Kapalı</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
