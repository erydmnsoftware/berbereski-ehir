import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const quickLinks = [
  { label: 'Hakkımızda', href: '#about' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Ekibimiz', href: '#team' },
  { label: 'Fiyatlar', href: '#pricing' },
];

export default function Appointment() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const leftRef = useScrollReveal<HTMLDivElement>({ delay: 0 });
  const centerRef = useScrollReveal<HTMLDivElement>({ delay: 0.15 });
  const rightRef = useScrollReveal<HTMLDivElement>({ delay: 0.3 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="appointment" className="bg-[#111111] py-[100px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[35%_30%_35%] gap-10">
        {/* Left: Image */}
        <div ref={leftRef} className="reveal-item relative">
          <div ref={imageRef} className="relative overflow-hidden rounded shadow-card opacity-0">
            <img loading="lazy" decoding="async"
              src="/images/appointment-hero.jpg"
              alt="Randevu Alın"
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111111]/80 to-transparent p-6">
              <p className="text-[14px] leading-[1.6] text-[#a0a0a0]">
                Size en iyi hizmeti sunabilmemiz ve beklememeniz için randevu almanızı tavsiye ediyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Booking Info & Quick Links */}
        <div ref={centerRef} className="reveal-item">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Randevu Alın
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
            Randevu almak için bizimle telefon veya WhatsApp üzerinden iletişime geçebilir ya da doğrudan online randevu sistemimizi kullanabilirsiniz.
          </p>

          <div className="mt-6 space-y-2">
            <div>
              <span className="text-[12px] text-[#6b6b6b]">Telefon / WhatsApp:</span>{' '}
              <a href="tel:+905551112233" className="text-[14px] text-white underline">
                0555 111 22 33
              </a>
            </div>
            <div>
              <span className="text-[12px] text-[#6b6b6b]">Online Randevu:</span>{' '}
              <Link href="/randevu" className="text-[14px] text-white underline">
                Hemen Randevu Al
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center justify-between py-4 border-b border-[#333333] text-[16px] text-white group hover:text-white transition-colors"
              >
                <span>{link.label}</span>
                <ArrowDownRight
                  size={16}
                  className="text-[#6b6b6b] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div ref={rightRef} className="reveal-item">
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Bize Ulaşın
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4">
            Hizmetlerimiz veya müsaitlik durumları hakkında sorularınız varsa, iletişim formunu kullanarak bize mesaj gönderebilirsiniz.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-[12px] text-[#6b6b6b] tracking-[0.02em] mb-1.5">
                * Adınız Soyadınız
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border border-[#333333] rounded px-4 py-3.5 text-white text-[14px] placeholder-[#6b6b6b] focus:border-[#555555] focus:outline-none transition-colors"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6b6b6b] tracking-[0.02em] mb-1.5">
                * E-posta Adresiniz
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border border-[#333333] rounded px-4 py-3.5 text-white text-[14px] placeholder-[#6b6b6b] focus:border-[#555555] focus:outline-none transition-colors"
                placeholder="E-posta"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6b6b6b] tracking-[0.02em] mb-1.5">
                * Mesajınız
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border border-[#333333] rounded px-4 py-3.5 text-white text-[14px] placeholder-[#6b6b6b] focus:border-[#555555] focus:outline-none transition-colors resize-none"
                placeholder="Mesajınız..."
              />
            </div>
            <button
              type="submit"
              className="w-full text-[14px] font-medium text-white border border-white py-4 hover:bg-white hover:text-[#111111] transition-all duration-300"
            >
              Mesajı Gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
