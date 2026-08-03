'use client'

import { useGSAP } from '@gsap/react'
import {
  Buildings,
  CarProfile,
  ChatCircleDots,
  Dog,
  FileText,
  HouseLine,
  PhoneCall,
  PhoneOutgoing,
  ShieldCheck,
  UsersThree,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useRef } from 'react'
import { D, ScrollTrigger, gsap, initGsap } from '@/lib/motion/gsap'
import { BotonLink } from '@/components/ui/Boton'
import { TELEFONO, VIGILANCIA } from '@/lib/catalog/products'
import { MUNDOS, type MundoId } from './hero-scene/scene'

const PRESENTACION: Record<
  MundoId,
  {
    icono: Icon
    descripcion: string
    fondo: string
  }
> = {
  familia: {
    icono: UsersThree,
    descripcion: 'Respaldo para ti y quienes más quieres.',
    fondo: 'bg-[#fff0ad]',
  },
  vehiculo: {
    icono: CarProfile,
    descripcion: 'Protección para moverte con tranquilidad.',
    fondo: 'bg-[#dceefa]',
  },
  hogar: {
    icono: HouseLine,
    descripcion: 'Tu casa y lo que has construido, protegidos.',
    fondo: 'bg-[#ffe16a]',
  },
  mascota: {
    icono: Dog,
    descripcion: 'Cuidado para ese miembro especial de la familia.',
    fondo: 'bg-[#e7f3fb]',
  },
}

const PASOS_COMO = [
  {
    n: '01',
    icono: ChatCircleDots,
    t: 'Nos cuentas qué quieres proteger',
    d: 'Una conversación corta, sin formularios ni cuentas.',
    fondo: 'bg-[#fff0ad]',
  },
  {
    n: '02',
    icono: FileText,
    t: 'Te explicamos el producto',
    d: 'Qué cubre, qué no cubre y quién es la aseguradora.',
    fondo: 'bg-[#dceefa]',
  },
  {
    n: '03',
    icono: PhoneOutgoing,
    t: 'Te contacta un asesor',
    d: 'Por WhatsApp o llamada, en la franja que tú elijas.',
    fondo: 'bg-[#ffe16a]',
  },
]

const CONFIANZA = [
  {
    icono: ShieldCheck,
    t: 'Protección con respaldo',
    d: 'Subsidio es la caja de compensación. El seguro lo emite una aseguradora aliada.',
    fondo: 'bg-[#fff0ad]',
  },
  {
    icono: Buildings,
    t: 'Entidades que vigilan',
    d: VIGILANCIA.join(' y ') + '.',
    fondo: 'bg-[#dceefa]',
  },
  {
    icono: PhoneCall,
    t: 'Estamos para ayudarte',
    d: TELEFONO,
    fondo: 'bg-[#e7f3fb]',
    esTelefono: true,
  },
]

/** Entrada anclada al scroll. Sin pin, sin parallax, sin scroll-jacking. */
function useRevelarAlScroll(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      initGsap()
      const mm = gsap.matchMedia()
      mm.add(
        { reducido: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' },
        (ctx) => {
          if (!scope.current) return
          const nodos = gsap.utils.toArray<HTMLElement>('.revelar', scope.current)
          if ((ctx.conditions as { reducido: boolean }).reducido) {
            gsap.set(nodos, { y: 0 })
            return
          }
          nodos.forEach((n) =>
            gsap.from(n, {
              y: 24,
              duration: D.base,
              ease: 'soft',
              scrollTrigger: { trigger: n, start: 'top 88%', once: true },
            }),
          )
          ScrollTrigger.refresh()
        },
      )
      return () => mm.revert()
    },
    { scope },
  )
}

function EncabezadoSeccion({
  eyebrow,
  id,
  titulo,
  descripcion,
}: {
  eyebrow: string
  id: string
  titulo: string
  descripcion?: string
}) {
  return (
    <div className="revelar mx-auto max-w-2xl text-center">
      <p className="mx-auto text-sm font-bold tracking-[0.18em] text-[var(--azul)] uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[var(--tinta)]"
      >
        {titulo}
      </h2>
      {descripcion && <p className="mx-auto mt-4 text-[var(--grafito)]">{descripcion}</p>}
    </div>
  )
}

export function Secciones() {
  const scope = useRef<HTMLDivElement>(null)
  useRevelarAlScroll(scope)

  return (
    <div ref={scope}>
      <section
        aria-labelledby="mundos-titulo"
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f1f6f9] px-6 py-[var(--espacio-seccion)]"
      >
        <span
          aria-hidden="true"
          className="absolute -top-32 -right-28 h-72 w-72 rounded-full border-[48px] border-white/55"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[var(--amarillo)]/20"
        />

        <div className="relative mx-auto max-w-6xl">
          <EncabezadoSeccion
            eyebrow="Seguros para tu día a día"
            id="mundos-titulo"
            titulo="Empieza por lo que te importa"
            descripcion="Elige una categoría y descubre una protección pensada para ti."
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MUNDOS.map((m, indice) => {
              const presentacion = PRESENTACION[m.id]
              const Icono = presentacion.icono

              return (
                <li key={m.id} className="revelar min-w-0">
                  <Link
                    href={`/cotizar?c=${m.categoria}`}
                    className="group flex h-full min-h-[330px] flex-col rounded-[2rem] border border-white/80 bg-white p-3 shadow-[0_18px_50px_-34px_rgb(26_26_25/0.45)] transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_28px_55px_-30px_rgb(0_103_177/0.4)] motion-reduce:hover:translate-y-0"
                  >
                    <span
                      className={`relative flex h-36 items-center justify-center overflow-hidden rounded-[1.4rem] text-[var(--tinta)] ${presentacion.fondo}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-4 left-4 font-display text-xs font-bold tracking-[0.16em] text-[var(--tinta)]/70"
                      >
                        0{indice + 1}
                      </span>
                      <Icono
                        aria-hidden="true"
                        size={78}
                        weight="duotone"
                        className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
                      />
                    </span>

                    <span className="flex flex-1 flex-col px-3 pt-6 pb-3">
                      <h3 className="font-display text-xl font-extrabold text-[var(--tinta)]">{m.nombre}</h3>
                      <span className="mt-2 text-sm leading-relaxed text-[var(--grafito)]">
                        {presentacion.descripcion}
                      </span>
                      <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-[var(--azul)]">
                        Explorar opciones
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--azul)] text-base text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                        >
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="como-titulo"
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--amarillo)] px-6 py-[var(--espacio-seccion)]"
      >
        <span
          aria-hidden="true"
          className="absolute -top-28 -left-20 h-64 w-64 rounded-full border-[42px] border-white/35"
        />
        <span
          aria-hidden="true"
          className="absolute -right-16 -bottom-20 h-52 w-52 rounded-full bg-white/25"
        />

        <div className="relative mx-auto max-w-6xl">
          <EncabezadoSeccion
            eyebrow="Fácil y sin vueltas"
            id="como-titulo"
            titulo="Cómo funciona"
            descripcion="Tres pasos. Sin letra menuda y sin perder tiempo."
          />

          <ol className="mt-12 grid gap-5 sm:grid-cols-3">
            {PASOS_COMO.map((p) => {
              const Icono = p.icono
              return (
                <li key={p.n} className="revelar min-w-0">
                  <article className="flex h-full min-h-[300px] flex-col rounded-[2rem] border border-white/70 bg-white p-3 shadow-[0_18px_50px_-34px_rgb(26_26_25/0.45)]">
                    <span
                      className={`relative flex h-36 items-center justify-center overflow-hidden rounded-[1.4rem] text-[var(--tinta)] ${p.fondo}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-4 left-4 font-display text-xs font-bold tracking-[0.16em] text-[var(--tinta)]/70"
                      >
                        {p.n}
                      </span>
                      <Icono aria-hidden="true" size={72} weight="duotone" />
                    </span>
                    <span className="flex flex-1 flex-col px-3 pt-6 pb-3">
                      <h3 className="font-display text-xl font-extrabold text-[var(--tinta)]">{p.t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--grafito)]">{p.d}</p>
                    </span>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section
        id="confianza"
        aria-labelledby="confianza-titulo"
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f8fafb] px-6 pt-[var(--espacio-seccion)] pb-10"
      >
        <span
          aria-hidden="true"
          className="absolute top-10 -right-24 h-64 w-64 rounded-full border-[40px] border-[var(--azul)]/10"
        />

        <div className="relative mx-auto max-w-6xl">
          <EncabezadoSeccion
            eyebrow="Confianza clara"
            id="confianza-titulo"
            titulo="Quién responde de verdad"
            descripcion="Siempre sabes quién te acompaña y dónde resolver cualquier duda."
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {CONFIANZA.map((c) => {
              const Icono = c.icono
              return (
                <li key={c.t} className="revelar min-w-0">
                  <article className="flex h-full min-h-[280px] flex-col rounded-[2rem] border border-white bg-white p-3 shadow-[0_18px_50px_-34px_rgb(26_26_25/0.45)]">
                    <span
                      className={`relative flex h-32 items-center justify-center overflow-hidden rounded-[1.4rem] text-[var(--tinta)] ${c.fondo}`}
                    >
                      <Icono aria-hidden="true" size={68} weight="duotone" />
                    </span>
                    <span className="flex flex-1 flex-col px-3 pt-6 pb-3">
                      <h3 className="font-display text-xl font-extrabold text-[var(--tinta)]">{c.t}</h3>
                      {c.esTelefono ? (
                        <a
                          href={`tel:${TELEFONO.replace(/\s/g, '')}`}
                          className="mt-3 inline-block text-sm font-bold text-[var(--azul)] underline underline-offset-4"
                        >
                          {TELEFONO}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--grafito)]">{c.d}</p>
                      )}
                    </span>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cierre-titulo" className="px-6 pt-10 pb-[var(--espacio-seccion)] text-center">
        <h2
          id="cierre-titulo"
          className="revelar text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[var(--tinta)]"
        >
          Dos minutos y sabes qué te sirve
        </h2>
        <div className="revelar mt-8">
          <BotonLink href="/cotizar" className="px-6 py-[1.125rem] text-base sm:px-9 sm:text-lg">
            COTIZAR MI SEGURO <span aria-hidden="true">→</span>
          </BotonLink>
        </div>
      </section>
    </div>
  )
}
