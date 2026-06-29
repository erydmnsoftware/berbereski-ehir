import type { Metadata } from 'next'
import './globals.css'
// Leaflet CSS is required for the map
import 'leaflet/dist/leaflet.css'
import ScrollObserver from '@/components/ScrollObserver'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'BerberEskişehir VIP | Premium Erkek Kuaförü',
  description: 'Eskişehir\'in en prestijli erkek kuaförü. Modern saç kesimi, sakal tasarımı ve VIP cilt bakım hizmetleri.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <div id="page-loader" style={{ position: 'fixed', inset: 0, backgroundColor: '#111', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <img loading="lazy" decoding="async" src="/logo.png" alt="Logo" style={{ width: '120px', animation: 'pulse 1.5s infinite' }} />
        </div>
        <div id="scroll-progress" style={{ position: 'fixed', top: 0, left: 0, height: '3px', background: 'linear-gradient(90deg,#c9a84c,#f0d080)', zIndex: 10000, width: '0%' }}></div>
        <CustomCursor />
        <SmoothScrollProvider>
          <ScrollObserver />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
