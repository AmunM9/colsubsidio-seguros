'use client'

/**
 * Aviso de fallo de la sesión. NO reemplaza la pantalla: se pone encima y deja la
 * conversación y la transcripción intactas, porque un error del servidor suele ser pasajero.
 * Los botones de recuperación solo salen cuando la conexión ya está caída.
 */
export function AvisoSesion({
  texto,
  conectado,
  puedePasarAChat,
  onReintentar,
  onSeguirEnChat,
  onCerrar,
}: {
  texto: string
  conectado: boolean
  puedePasarAChat: boolean
  onReintentar: () => void
  onSeguirEnChat: () => void
  onCerrar: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[color-mix(in_oklab,var(--amarillo)_22%,white)] px-5 py-4"
    >
      <p className="text-sm font-medium text-[var(--tinta)]">{texto}</p>
      <div className="flex gap-2">
        {!conectado && (
          <button
            type="button"
            onClick={onReintentar}
            className="rounded-full bg-[var(--azul)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--tinta)]"
          >
            Reintentar
          </button>
        )}
        {puedePasarAChat && !conectado && (
          <button
            type="button"
            onClick={onSeguirEnChat}
            className="rounded-full border border-[var(--borde-fuerte)] px-5 py-2 text-sm font-semibold hover:border-[var(--azul)]"
          >
            Seguir por chat
          </button>
        )}
        <button
          type="button"
          onClick={onCerrar}
          className="rounded-full border border-[var(--borde-fuerte)] px-5 py-2 text-sm font-semibold hover:border-[var(--azul)]"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
