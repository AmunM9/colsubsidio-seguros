import type { Metadata, Viewport } from 'next'
import { Figtree, Nunito } from 'next/font/google'
import './globals.css'

const display = Nunito({
  variable: '--fuente-display',
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'],
  display: 'swap',
})

const ui = Figtree({
  variable: '--fuente-ui',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Seguros, sin vueltas · Subsidio',
  description: 'Encuentra el seguro ideal para ti y recibe orientación clara de un asesor de Subsidio.',
  openGraph: {
    title: 'Seguros, sin vueltas · Subsidio',
    description: 'Encontrar el seguro ideal para ti nunca fue tan simple.',
    locale: 'es_CO',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#FAFAF8' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${ui.variable}`}>
      <body>{children}</body>
    </html>
  )
}
