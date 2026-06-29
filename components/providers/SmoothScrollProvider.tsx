"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // GSAP Eklentilerini kaydet
    // CDN üzerinden yükleneceği için GSAP window altında olacak ama güvenlik amaçlı
    // burada da register edebiliriz.
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger, TextPlugin);
      // SplitText eklentisini CDN'den bekleyeceğiz, o yüzden burada register etmiyoruz.
      // Eklenti yüklendiyse otomatik algılar.
    }

    // Lenis Smooth Scroll Başlat
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // Scroll Progress Bar Update
    const onScroll = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const prog = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = prog + '%';
      }
    };
    window.addEventListener('scroll', onScroll);

    // Page Loader Fade Out
    const loader = document.getElementById('page-loader');
    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 1.5,
        onComplete: () => loader.style.display = 'none'
      });
    }

    // GSAP ScrollTrigger ile senkronize et
    lenis.on("scroll", ScrollTrigger.update);
    
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', onScroll);
      // Temizleme işlemi
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  return <>{children}</>;
}
