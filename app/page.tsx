import Link from 'next/link'
import { Hero } from '@/components/landing/Hero'
import { Secciones } from '@/components/landing/Secciones'
import { POLITICA_DATOS, TELEFONO } from '@/lib/catalog/products'

export default function Landing() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-[1.2rem] font-extrabold text-[var(--tinta)]">Seguros</span>
        <Link
          href="/admin"
          className="text-nowrap text-sm text-[var(--grafito-60)] hover:text-[var(--azul)]"
        >
          Panel interno
        </Link>
      </header>

      <main className="mx-auto max-w-6xl">
        <Hero />
        <Secciones />
      </main>

      <footer className="border-t border-[var(--borde)] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-[var(--grafito-60)]">
          <p>Demo de experiencia. No emite pólizas ni procesa pagos.</p>
          <nav aria-label="Legales" className="flex flex-wrap gap-5">
            <a href={POLITICA_DATOS} className="hover:text-[var(--azul)]">
              Tratamiento de datos personales
            </a>
            <a href={`tel:${TELEFONO.replace(/\s/g, '')}`} className="hover:text-[var(--azul)]">
              {TELEFONO}
            </a>
          </nav>
        </div>
      </footer>
    </>
  )
}
