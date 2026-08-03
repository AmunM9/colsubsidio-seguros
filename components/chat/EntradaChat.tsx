'use client'

import { useState } from 'react'

/** Caja de texto del chat. El envío queda deshabilitado si no hay sesión viva. */
export function EntradaChat({
  habilitada,
  onEnviar,
}: {
  habilitada: boolean
  onEnviar: (texto: string) => void
}) {
  const [texto, setTexto] = useState('')
  const listo = habilitada && texto.trim().length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!listo) return
        onEnviar(texto.trim())
        setTexto('')
      }}
      className="flex gap-3"
    >
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escríbele al asesor…"
        aria-label="Mensaje para el asesor"
        className="w-full rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[var(--superficie)] px-5 py-4 text-lg text-[var(--tinta)] placeholder:text-[var(--grafito-20)] focus:border-[var(--azul)]"
      />
      <button
        type="submit"
        disabled={!listo}
        aria-disabled={!listo}
        className="shrink-0 rounded-full bg-[var(--azul)] px-7 py-4 font-semibold text-white transition-colors hover:bg-[var(--tinta)] disabled:opacity-45"
      >
        Enviar
      </button>
    </form>
  )
}
