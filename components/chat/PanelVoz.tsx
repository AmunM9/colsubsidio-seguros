'use client'

import { OrbeVoz } from './OrbeVoz'

/** Orbe + el botón que pide el micrófono. El permiso SOLO se pide al tocarlo. */
export function PanelVoz({
  conectado,
  hablando,
  leerVolumen,
  onEmpezar,
}: {
  conectado: boolean
  hablando: boolean
  leerVolumen: () => number
  onEmpezar: () => void
}) {
  return (
    <>
      <OrbeVoz activo={conectado} hablando={hablando} leerVolumen={leerVolumen} />
      {!conectado && (
        <div className="text-center">
          <button
            type="button"
            onClick={onEmpezar}
            className="rounded-full bg-[var(--azul)] px-7 py-4 font-semibold text-white transition-colors hover:bg-[var(--tinta)]"
          >
            Empezar a hablar
          </button>
          <p className="mt-3 text-sm text-[var(--grafito-60)]">Te pedimos el micrófono solo ahora.</p>
        </div>
      )}
    </>
  )
}
