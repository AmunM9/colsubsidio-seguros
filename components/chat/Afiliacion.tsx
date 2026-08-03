'use client'

import { useState } from 'react'
import { buscarAfiliado, type Afiliado } from '@/lib/catalog/afiliados'

/**
 * Una sola pantalla: "Sí" trae el campo de cédula al lado; "No" sigue de largo.
 * Si la cédula está en la base local, precargamos nombre, celular y correo para
 * que ni la persona ni el agente tengan que volver a pedirlos.
 */
export function Afiliacion({ onListo }: { onListo: (esAfiliado: boolean, a: Afiliado | null) => void }) {
  const [documento, setDocumento] = useState('')
  const [error, setError] = useState<string | null>(null)

  const confirmar = (e: React.FormEvent) => {
    e.preventDefault()
    const encontrado = buscarAfiliado(documento)
    if (!encontrado) {
      setError('No encontramos ese documento en el sistema. Revísalo o continúa como no afiliado.')
      return
    }
    onListo(true, encontrado)
  }

  return (
    <div className="grid gap-3">
      <form
        onSubmit={confirmar}
        className="rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[var(--superficie)] p-6"
      >
        <label htmlFor="documento" className="block text-lg font-semibold text-[var(--tinta)]">
          Sí, soy afiliado
        </label>
        <p className="mt-1 text-sm text-[var(--grafito-60)]">Escribe tu número de documento.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="documento"
            inputMode="numeric"
            autoComplete="off"
            value={documento}
            onChange={(e) => {
              setDocumento(e.target.value)
              setError(null)
            }}
            placeholder="1020304050"
            aria-describedby={error ? 'documento-error' : undefined}
            aria-invalid={error ? true : undefined}
            className="tabular w-full rounded-[var(--radio)] border border-[var(--borde-fuerte)] px-5 py-4 text-lg text-[var(--tinta)] placeholder:text-[var(--grafito-20)] focus:border-[var(--azul)]"
          />
          <button
            type="submit"
            disabled={documento.trim().length < 5}
            aria-disabled={documento.trim().length < 5}
            className="shrink-0 rounded-full bg-[var(--azul)] px-7 py-4 font-semibold text-white transition-colors hover:bg-[var(--tinta)] disabled:opacity-45"
          >
            Traer mis datos
          </button>
        </div>

        {error && (
          <p id="documento-error" role="alert" className="mt-3 text-sm font-medium text-[var(--error)]">
            {error}
          </p>
        )}
      </form>

      <button
        type="button"
        onClick={() => onListo(false, null)}
        className="group w-full rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[var(--superficie)] px-6 py-5 text-left transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--azul)] motion-reduce:hover:translate-y-0"
      >
        <span className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-lg font-semibold text-[var(--tinta)]">No soy afiliado</span>
            <span className="mt-0.5 block text-sm text-[var(--grafito-60)]">
              Puedes cotizar igual. El asesor te pide los datos.
            </span>
          </span>
          <span aria-hidden="true" className="text-[var(--grafito-20)] group-hover:text-[var(--azul)]">
            →
          </span>
        </span>
      </button>
    </div>
  )
}
