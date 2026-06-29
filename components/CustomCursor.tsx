"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobil cihazlarda cursor'u devre dışı bırak
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX - 5, y: mouseY - 5, duration: 0.1 });
    };

    document.addEventListener("mousemove", onMouseMove);

    // Follower gecikmeli takip
    const ticker = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX - 18, y: followerY - 18 });
    };
    gsap.ticker.add(ticker);

    // Event delegation ile dinamik link/buton takibi (Next.js SPA için en doğrusu)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select")) {
        gsap.to(follower, { width: 60, height: 60, borderColor: "#c9a84c", x: followerX - 30, y: followerY - 30, duration: 0.3 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select")) {
        gsap.to(follower, { width: 36, height: 36, borderColor: "rgba(201,168,76,0.6)", x: followerX - 18, y: followerY - 18, duration: 0.3 });
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} className="hidden md:block"></div>
      <div id="cursor-follower" ref={followerRef} className="hidden md:block"></div>
      <style jsx global>{`
        #cursor {
          width: 10px; height: 10px;
          background: #c9a84c;
          border-radius: 50%;
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: transform 0.1s;
        }
        #cursor-follower {
          width: 36px; height: 36px;
          border: 1.5px solid rgba(201, 168, 76, 0.6);
          border-radius: 50%;
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 9998;
          transition: transform 0.12s ease, width 0.3s ease, height 0.3s ease;
        }
      `}</style>
    </>
  );
}
