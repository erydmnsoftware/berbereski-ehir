import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#333333] py-20 px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo & Info */}
        <div>
          <span className="text-white font-medium text-[20px] tracking-[-0.02em] flex items-center gap-3">
            <img loading="lazy" decoding="async" src="/logo.png" alt="BerberEskişehir Logo" className="h-16 object-contain" />
            BerberEskişehir VIP
          </span>
          <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mt-4 max-w-[280px]">
            Size en iyi hizmeti sunabilmemiz ve beklememeniz için randevu almanızı tavsiye ediyoruz.
          </p>
          <p className="text-[12px] text-[#6b6b6b] tracking-[0.02em] mt-8">
            &copy; 2026 BerberEskişehir VIP. Tüm Hakları Saklıdır.
          </p>
        </div>

        {/* Center: Follow Us */}
        <div>
          <h4 className="text-[18px] font-medium leading-[1.4] text-white mb-4">Bizi Takip Edin</h4>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="text-[14px] text-[#a0a0a0] underline hover:text-white transition-colors w-fit"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[14px] text-[#a0a0a0] underline hover:text-white transition-colors w-fit"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Right: Utility Pages */}
        <div>
          <h4 className="text-[18px] font-medium leading-[1.4] text-white mb-4">Site Haritası</h4>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-[14px] text-[#a0a0a0] underline hover:text-white transition-colors w-fit"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/randevu"
              className="text-[14px] text-[#a0a0a0] underline hover:text-white transition-colors w-fit"
            >
              Randevu Al
            </Link>
            <Link
              href="/admin/login"
              className="text-[14px] text-[#a0a0a0] underline hover:text-white transition-colors w-fit"
            >
              Yönetim Paneli
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
