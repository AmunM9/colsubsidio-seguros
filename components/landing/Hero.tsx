'use client'

import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { D, STAGGER, SplitText, gsap, initGsap } from '@/lib/motion/gsap'
import { BotonLink } from '@/components/ui/Boton'
import { HeroScene } from './hero-scene/HeroScene'

export function Hero() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      initGsap()
      if (!scope.current) return
      const root = scope.current
      const titulo = root.querySelector<HTMLElement>('#hero-titulo')
      if (!titulo) return
      const resto = gsap.utils.toArray<HTMLElement>('.revelar', root)
      const nubes = root.querySelector<HTMLElement>('.lemonade-scene__nubes')
      // Solo imágenes visibles en el viewport actual (las demás están display:none).
      const escena = gsap.utils
        .toArray<HTMLElement>('.lemonade-scene__imagenes img', root)
        .filter((img) => getComputedStyle(img).display !== 'none')
      const elementosEscena = [...(nubes ? [nubes] : []), ...escena]

      const mm = gsap.matchMedia()
      mm.add(
        { reducido: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' },
        (ctx) => {
          const { reducido } = ctx.conditions as { reducido: boolean }
          if (reducido) {
            gsap.set([titulo, ...resto, ...elementosEscena], { autoAlpha: 1, y: 0 })
            root.classList.add('hero-lemonade--escena-lista')
            return
          }

          gsap.set(elementosEscena, { autoAlpha: 0, y: 18 })
          const split = SplitText.create(titulo, { type: 'words', tag: 'span' })

          // Una sola frase visual: el copy y la escena se solapan, sin pausa entre ambos.
          gsap
            .timeline({ defaults: { ease: 'soft' } })
            .from(split.words, { yPercent: 110, autoAlpha: 0, duration: D.base, stagger: STAGGER / 2 })
            .from(resto, { y: 14, autoAlpha: 0, duration: D.base, stagger: STAGGER }, '-=0.3')
            .add('escena', '-=0.42')
            .add(() => root.classList.add('hero-lemonade--escena-lista'), 'escena')
            .to(nubes, { autoAlpha: 1, duration: D.hero }, 'escena')
            .to(escena, { y: 0, autoAlpha: 1, duration: D.hero, stagger: 0.05 }, 'escena+=0.06')
        },
      )
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} aria-labelledby="hero-titulo" className="hero-lemonade">
      <div className="hero-lemonade__contenido">
        <h1
          id="hero-titulo"
          className="mx-auto max-w-3xl text-[clamp(2.45rem,4.8vw,4.7rem)] font-extrabold"
          style={{ overflow: 'clip' }}
        >
          El seguro que necesitas, explicado en dos minutos
        </h1>

        <p className="revelar mx-auto mt-6 max-w-2xl text-balance text-lg text-[var(--grafito)] sm:text-xl">
          Encontrar el seguro ideal para ti nunca fue tan simple.
        </p>

        <div className="revelar mt-9 flex justify-center">
          <BotonLink href="/cotizar" className="px-9 py-[1.125rem] text-lg">
            COTIZAR MI SEGURO
            <span aria-hidden="true">→</span>
          </BotonLink>
        </div>
      </div>

      <div className="hero-lemonade__escena">
        <HeroScene />
      </div>
    </section>
  )
}
