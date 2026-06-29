'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Biraz gecikme ekliyoruz ki DOM tamamen render olsun
    const timeout = setTimeout(() => {
      // Standart Reveal itemlar
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
      });

      const hiddenElements = document.querySelectorAll('.reveal');
      hiddenElements.forEach((el) => observer.observe(el));

      // BÖLÜM BAŞLIKLARI — Clip-Path Text Reveal (SplitText alternatifi)
      const titles = document.querySelectorAll('.reveal-title:not(.revealed)');
      const titleCleanups: (() => void)[] = [];

      titles.forEach(title => {
        title.classList.add('revealed');
        
        // H2 içeriğini bir span içerisine alarak maskeleme (overflow: hidden) yapıyoruz
        const originalHTML = title.innerHTML;
        title.innerHTML = '';
        
        const outer = document.createElement("span");
        outer.style.display = "block";
        outer.style.overflow = "hidden";
        
        const inner = document.createElement("span");
        inner.style.display = "block";
        inner.innerHTML = originalHTML;
        
        outer.appendChild(inner);
        title.appendChild(outer);

        const anim = gsap.from(inner, {
          y: "100%",
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: title,
            start: "top 88%",
            once: true
          }
        });

        titleCleanups.push(() => {
          anim.kill();
          title.classList.remove('revealed');
          title.innerHTML = originalHTML;
        });
      });

      return () => {
        observer.disconnect();
        titleCleanups.forEach(cleanup => cleanup());
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
