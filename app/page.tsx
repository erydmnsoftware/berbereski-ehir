"use client";

import Navigation from '@/components/sections/Navigation';
import Hero from '@/components/sections/Hero';
import MarqueeSection from '@/components/sections/MarqueeSection';
import ServicesOverview from '@/components/sections/ServicesOverview';
import About from '@/components/sections/About';
import ServicesDetail from '@/components/sections/ServicesDetail';
import Space from '@/components/sections/Space';
import StyleInspiration from '@/components/sections/StyleInspiration';
import LookMatters from '@/components/sections/LookMatters';
import Team from '@/components/sections/Team';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import MapSection from '@/components/sections/MapSection';
import Appointment from '@/components/sections/Appointment';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="bg-[#111111] min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navigation />
      <Hero />
      <MarqueeSection />
      <ServicesOverview />
      <About />
      <ServicesDetail />
      <Space />
      <MarqueeSection />
      <StyleInspiration />
      <LookMatters />
      <Team />
      <Testimonials />
      <Pricing />
      <MapSection />
      <Appointment />
      <Footer />
    </div>
  );
}
