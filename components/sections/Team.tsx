import { useScrollReveal } from '@/hooks/useScrollReveal';

const teamMembers = [
  {
    name: 'Mehmet Usta',
    role: 'Baş Berber',
    bio: '15 yıllık deneyimiyle modern ve klasik stillerin ustası. Temiz kesimler, mükemmel geçişler (fade) ve ince detaylarda uzmanlaşmıştır.',
    image: '/images/team-alex.jpg',
  },
  {
    name: 'Ali Kaya',
    role: 'VIP Uzmanı',
    bio: 'VIP hizmetleri ve cilt bakımı konusunda uzman. Kişiliğinizi ve yaşam tarzınızı yansıtan, hem modern hem de rahat tarzlar yaratmaya odaklanır.',
    image: '/images/team-jordan.jpg',
  },
  {
    name: 'Can Demir',
    role: 'Sakal Ustası',
    bio: 'Sakal şekillendirme ve bakımının aranan ismi. Temiz çizgilere ve yüz hatlarınızı en iyi şekilde ortaya çıkaran tasarımlara tutkuyla bağlıdır.',
    image: '/images/team-ryan.jpg',
  },
];

export default function Team() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>({ stagger: 0.12, delay: 0.2 });

  return (
    <section id="team" className="bg-[#111111] py-[120px] px-5 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headerRef}>
          <h2 className="reveal-title section-title text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
            Ekibimiz
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#a0a0a0] mt-4 max-w-[600px]">
            Ekibimiz, hassasiyet, stil ve kaliteli hizmet tutkusunu paylaşan yetenekli profesyonellerden oluşur. Her berberimiz, size özel tecrübe, yaratıcılık ve özenli bir yaklaşım sunar.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16"
        >
          {teamMembers.map((member) => (
            <div key={member.name} className="reveal-item group">
              <div className="overflow-hidden rounded shadow-card">
                <img loading="lazy" decoding="async"
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                />
              </div>
              <h3 className="text-[24px] font-medium leading-[1.3] text-white mt-5">
                {member.name}
              </h3>
              <span className="text-[12px] text-[#6b6b6b] tracking-[0.02em] mt-1 block">
                {member.role}
              </span>
              <p className="text-[14px] leading-[1.6] text-[#a0a0a0] mt-3">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
