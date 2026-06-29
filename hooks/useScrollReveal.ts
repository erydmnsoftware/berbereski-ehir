import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scale?: number;
  rotate?: number;
  threshold?: number;
  ease?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.7,
      delay = 0,
      stagger = 0.12,
      scale,
      rotate,
      ease = 'power3.out',
    } = options;

    const children = el.children.length > 1 ? el.children : [el];

    gsap.set(children, { y, x, opacity, ...(scale && { scale }), ...(rotate && { rotate }) });

    const anim = gsap.to(children, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

export function useHeroAnimation<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 30,
      x = 0,
      opacity = 0,
      duration = 0.8,
      delay = 0,
      stagger = 0.08,
      ease = 'power3.out',
    } = options;

    const children = el.children.length > 0 ? Array.from(el.children) : [el];

    gsap.set(children, { y, x, opacity });

    const anim = gsap.to(children, {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease,
    });

    return () => {
      anim.kill();
    };
  }, []);

  return ref;
}
