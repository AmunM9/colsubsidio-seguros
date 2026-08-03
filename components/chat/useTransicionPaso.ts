'use client'

import { useGSAP } from '@gsap/react'
import { useRef, type RefObject } from 'react'
import { D, Flip, gsap, initGsap, sinMovimiento } from '@/lib/motion/gsap'

/**
 * Principio de mínimo ruido: al responder, la pantalla anterior DESAPARECE y la siguiente
 * sube a ocupar su lugar. En pantalla vive una sola pregunta, sin historial acumulado.
 *
 * Devuelve `transicionar(fn)`: anima la salida y luego ejecuta `fn` (el cambio de estado).
 */
export function useTransicionPaso(
  scope: RefObject<HTMLDivElement | null>,
  tarjeta: RefObject<HTMLDivElement | null>,
  pasoId: string,
) {
  const flip = useRef<Flip.FlipState | null>(null)

  useGSAP(
    () => {
      initGsap()
      if (sinMovimiento()) {
        gsap.set(tarjeta.current, { autoAlpha: 1, y: 0, filter: 'none' })
        return
      }
      if (flip.current) Flip.from(flip.current, { duration: D.base, ease: 'crisp', absolute: false })
      // La salida dejó blur(4px) en este mismo nodo: hay que limpiarlo o la pantalla
      // nueva entra desenfocada.
      gsap.set(tarjeta.current, { filter: 'none' })
      const entrada = gsap.fromTo(
        tarjeta.current,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: D.base, ease: 'soft' },
      )
      // Red de seguridad: `autoAlpha` pone visibility:hidden de entrada. Si el ticker se
      // estrangula (pestaña en segundo plano), quedaría una pantalla en blanco.
      const red = setTimeout(() => {
        if (entrada.progress() < 1) entrada.progress(1)
      }, 700)
      return () => clearTimeout(red)
    },
    { scope, dependencies: [pasoId] },
  )

  /** El avance nunca queda a merced del ticker: temporizador de respaldo. */
  return (fn: () => void) => {
    if (sinMovimiento() || !tarjeta.current || !scope.current) {
      fn()
      return
    }
    let hecho = false
    const avanzar = () => {
      if (hecho) return
      hecho = true
      fn()
    }
    try {
      flip.current = Flip.getState(scope.current)
      gsap.to(tarjeta.current, {
        y: -24,
        autoAlpha: 0,
        filter: 'blur(4px)',
        duration: D.micro + 0.08,
        ease: 'crisp',
        onComplete: avanzar,
      })
      setTimeout(avanzar, 450)
    } catch {
      // "Invalid scope" u otros fallos de GSAP no deben romper el flujo.
      avanzar()
    }
  }
}
