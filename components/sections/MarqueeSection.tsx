export default function MarqueeSection() {
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        <span>SAÇ KESİM &nbsp;·&nbsp; SAKAL TASARIM &nbsp;·&nbsp; VIP DENEYİM &nbsp;·&nbsp; ESKISEHIR &nbsp;·&nbsp; BERBER SANAT &nbsp;·&nbsp; MODERN TARZ &nbsp;·&nbsp;</span>
        <span>SAÇ KESİM &nbsp;·&nbsp; SAKAL TASARIM &nbsp;·&nbsp; VIP DENEYİM &nbsp;·&nbsp; ESKISEHIR &nbsp;·&nbsp; BERBER SANAT &nbsp;·&nbsp; MODERN TARZ &nbsp;·&nbsp;</span>
        {/* Kesintisiz akış için kopyaları artırıyoruz */}
        <span>SAÇ KESİM &nbsp;·&nbsp; SAKAL TASARIM &nbsp;·&nbsp; VIP DENEYİM &nbsp;·&nbsp; ESKISEHIR &nbsp;·&nbsp; BERBER SANAT &nbsp;·&nbsp; MODERN TARZ &nbsp;·&nbsp;</span>
        <span>SAÇ KESİM &nbsp;·&nbsp; SAKAL TASARIM &nbsp;·&nbsp; VIP DENEYİM &nbsp;·&nbsp; ESKISEHIR &nbsp;·&nbsp; BERBER SANAT &nbsp;·&nbsp; MODERN TARZ &nbsp;·&nbsp;</span>
      </div>
      <style>{`
        .marquee-wrapper {
          overflow: hidden;
          padding: 16px 0;
          border-top: 1px solid rgba(201,168,76,0.2);
          border-bottom: 1px solid rgba(201,168,76,0.2);
          margin: 0; /* Sayfa arasına tam oturması için */
          background-color: #111111;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marqueeScroll 18s linear infinite;
          color: rgba(201, 168, 76, 0.5);
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 500;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
