'use client'

import type { Opcion } from '@/lib/flow/types'

/** Botón grande tipo tarjeta. Nada de radio buttons. Un toque, cero teclado. */
export function OptionButton({ opcion, onSelect }: { opcion: Opcion; onSelect: (v: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(opcion.valor)}
      className="group w-full rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[var(--superficie)] px-6 py-5 text-left transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--azul)] hover:bg-[color-mix(in_oklab,var(--azul)_5%,white)] active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-lg font-semibold text-[var(--tinta)]">{opcion.etiqueta}</span>
          {opcion.nota && <span className="mt-0.5 block text-sm text-[var(--grafito-60)]">{opcion.nota}</span>}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-[var(--grafito-20)] transition-colors group-hover:text-[var(--azul)]"
        >
          →
        </span>
      </span>
    </button>
  )
}
