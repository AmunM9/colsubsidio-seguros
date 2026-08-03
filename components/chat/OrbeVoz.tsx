'use client'

import { useEffect, useRef } from 'react'
import { escalaOrbe, lerp } from '@/lib/voice/elevenlabs'
import { gsap, initGsap, sinMovimiento } from '@/lib/motion/gsap'

type Props = {
  activo: boolean
  hablando: boolean
  /** Amplitud 0–1 del SDK, ya filtrada al rango de voz humana. */
  leerVolumen: () => number
}

/**
 * Orbe original en SVG, sin assets externos. La escala la escribe `gsap.quickSetter`,
 * nunca estado de React: serían 60 renders por segundo.
 *
 * Tres estados y ni uno más: quieto · pulso lento (escuchando) · escala por volumen (hablando).
 */
export function OrbeVoz({ activo, hablando, leerVolumen }: Props) {
  const nucleo = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!activo || sinMovimiento() || !nucleo.current) return
    initGsap()
    const nodo = nucleo.current
    const set = gsap.quickSetter(nodo, 'scale')
    let suavizado = 0
    let raf = 0
    const tick = () => {
      suavizado = lerp(suavizado, leerVolumen())
      set(escalaOrbe(suavizado))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      gsap.set(nodo, { scale: 1 })
    }
  }, [activo, leerVolumen])

  const estado = !activo ? 'quieto' : hablando ? 'hablando' : 'escuchando'

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 200 200"
        className="h-44 w-44"
        role="img"
        aria-label={
          estado === 'hablando'
            ? 'El asesor está hablando'
            : estado === 'escuchando'
              ? 'El asesor te está escuchando'
              : 'Asesor en pausa'
        }
      >
        <circle cx="100" cy="100" r="92" fill="var(--amarillo-40)" opacity={activo ? 1 : 0.35} />
        <g ref={nucleo} style={{ transformOrigin: '100px 100px' }}>
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="var(--azul)"
            opacity={activo ? 0.95 : 0.3}
            className={estado === 'escuchando' ? 'animate-pulse' : undefined}
          />
          <circle cx="100" cy="100" r="66" fill="none" stroke="var(--amarillo)" strokeWidth="5" />
          {/* La onda: el gesto que dice "esto habla". */}
          <path
            d="M58 108c14-16 28-16 42 0s28 16 42 0"
            fill="none"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            opacity={activo ? 1 : 0.5}
          />
        </g>
      </svg>
      <p className="text-sm font-medium text-[var(--grafito-60)]">
        {estado === 'hablando' ? 'Hablando…' : estado === 'escuchando' ? 'Te escucho' : 'Conectando…'}
      </p>
    </div>
  )
}
