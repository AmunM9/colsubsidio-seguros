'use client'

import { useEffect, useRef } from 'react'

export type Turno = { de: 'agente' | 'yo'; texto: string }

/**
 * El agente emite etiquetas de audio como `[warmly]` o `[laughs]` para modular la voz.
 * En la transcripción no son texto, son dirección escénica: se quitan.
 */
const sinEtiquetasDeAudio = (t: string) =>
  t.replace(/\[[a-zA-Z\s]{1,20}\]/g, '').replace(/\s{2,}/g, ' ').trim()

/**
 * En voz es el subtítulo de lo que se está diciendo; en chat es la conversación.
 * `aria-live="polite"` para que un lector de pantalla anuncie lo que responde el asesor.
 */
export function Transcripcion({ turnos, cargando }: { turnos: Turno[]; cargando: boolean }) {
  const fin = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fin.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [turnos])

  if (turnos.length === 0) {
    return (
      <p className="text-center text-[var(--grafito-60)]">
        {cargando ? 'Conectando con tu asesor…' : 'Aquí aparece lo que se vaya conversando.'}
      </p>
    )
  }

  return (
    <div
      aria-live="polite"
      className="max-h-[46vh] space-y-3 overflow-y-auto rounded-[var(--radio)] border border-[var(--borde)] bg-[var(--superficie)] p-5"
    >
      {turnos.map((t, i) => (
        <p
          key={i}
          className={
            t.de === 'agente'
              ? 'text-[var(--tinta)]'
              : 'ml-auto w-fit max-w-[85%] rounded-[var(--radio)] bg-[color-mix(in_oklab,var(--azul)_10%,white)] px-4 py-2 text-[var(--grafito)]'
          }
        >
          {t.de === 'agente' && <span className="mr-2 font-semibold text-[var(--azul)]">Asesor</span>}
          {sinEtiquetasDeAudio(t.texto)}
        </p>
      ))}
      <div ref={fin} />
    </div>
  )
}
