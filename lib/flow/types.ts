export type Categoria = 'familia' | 'vehiculo' | 'hogar' | 'mascota'

export type Respuestas = Record<string, string>

export type Opcion = {
  valor: string
  etiqueta: string
  nota?: string
  icono?: Categoria
}

/**
 * `choice` es el default. Los demás son pantallas con lógica propia:
 * - `afiliacion` — sí/no con la cédula en la misma pantalla
 * - `sesion`     — la conversación con el agente de ElevenLabs (voz o chat)
 * - `reservado`  — el cierre
 */
export type TipoPaso = 'choice' | 'afiliacion' | 'sesion' | 'reservado'

export type Paso = {
  id: string
  tipo: TipoPaso
  titulo: string
  subtitulo?: string
  opciones?: Opcion[]
  /** Si devuelve false, el paso se salta. Es todo el ramificado que necesitamos. */
  mostrarSi?: (r: Respuestas) => boolean
}

export type EstadoFlujo = {
  pasoId: string
  respuestas: Respuestas
  historial: string[]
  terminado: boolean
}

export type AccionFlujo =
  | { tipo: 'responder'; pasoId: string; valor: string }
  | { tipo: 'responder-multiple'; valores: Respuestas }
  | { tipo: 'atras' }
  | { tipo: 'reiniciar'; respuestasIniciales?: Respuestas }
