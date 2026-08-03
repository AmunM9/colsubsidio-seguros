/**
 * El SDK entrega el error en formatos muy distintos: string, Error, o un objeto opaco
 * (a veces literalmente `{}`, como en los "Server error: Unknown error" de ElevenLabs).
 * Traducimos a algo accionable y, sobre todo, nunca mostramos "[object Object]".
 */
export const mensajeDeError = (e: unknown): string => {
  const crudo =
    typeof e === 'string'
      ? e
      : e instanceof Error
        ? e.message
        : typeof e === 'object' && e !== null
          ? String(
              (e as Record<string, unknown>).message ??
                (e as Record<string, unknown>).reason ??
                (e as Record<string, unknown>).error ??
                '',
            )
          : ''

  if (/permission|denied|notallowed/i.test(crudo)) {
    return 'No pudimos usar el micrófono. Dale permiso al navegador y vuelve a intentar, o sigue por chat.'
  }
  if (/notfound|no.*device/i.test(crudo)) {
    return 'No encontramos un micrófono conectado. Puedes seguir por chat.'
  }
  if (/server error|unknown error|internal/i.test(crudo)) {
    return 'El servicio del asesor tuvo un problema momentáneo. Si se interrumpió, vuelve a intentar o sigue por chat.'
  }
  // Un error vacío casi siempre es un hipo del servidor de ElevenLabs, no algo nuestro.
  return crudo.trim() || 'El asesor tuvo un problema de conexión. Puedes reintentar o seguir por chat.'
}
