export default function MapSection() {
  return (
    <section className="bg-[#111111] py-10 px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="reveal-title section-title text-[32px] font-normal text-white mb-8 text-center md:text-left">
          Konumumuz
        </h2>
        <div className="w-full h-[400px] md:h-[500px] rounded overflow-hidden shadow-card relative border border-[#333333]">
          <iframe
            src="https://maps.google.com/maps?q=39.764024395045184,30.521873111957245&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BerberOS Google Maps"
          ></iframe>
          <div className="absolute top-4 left-4 bg-[#111111]/90 backdrop-blur border border-[#333333] p-4 rounded max-w-[280px]">
            <h4 className="text-white font-medium mb-1">BerberOS</h4>
            <p className="text-[#a0a0a0] text-[13px]">Merkez, İstanbul</p>
            <a 
              href="https://share.google/22hQ1RUsFYY9RBSIO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#d4a853] text-[13px] hover:underline mt-2 inline-block"
            >
              Yol Tarifi Al →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
