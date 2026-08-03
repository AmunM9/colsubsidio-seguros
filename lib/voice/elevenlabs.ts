/**
 * Configuración del agente de pólizas. Único archivo con lógica de voz
 * (más SesionAgente.tsx y OrbeVoz.tsx para el render).
 */
import type { Afiliado } from '@/lib/catalog/afiliados'

export const VOZ_ACTIVA = process.env.NEXT_PUBLIC_VOICE_ENABLED === 'true'
export const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? ''

/** Client tools. Los MISMOS nombres deben estar registrados en el dashboard del agente. */
export const TOOLS = {
  contacto: 'capturar_contacto',
  reserva: 'confirmar_reserva',
  humano: 'pedir_humano',
} as const

export type ArgsContacto = { campo: string; valor: string }
export type ArgsReserva = { canal?: string; franja?: string }

const CATEGORIA_LEGIBLE: Record<string, string> = {
  familia: 'seguros para mí y mi familia',
  vehiculo: 'seguros para mi carro o moto',
  hogar: 'seguros para mi hogar',
  mascota: 'seguros para mi mascota',
}

/**
 * Todo lo que la persona ya respondió viaja como dynamic variables, para que el agente
 * NO vuelva a preguntar lo que ya sabemos. Los nombres coinciden con `{{llaves}}` del prompt.
 */
export const variablesDinamicas = (categoria: string, afiliado: Afiliado | null) => ({
  categoria,
  categoria_legible: CATEGORIA_LEGIBLE[categoria] ?? 'seguros',
  // Alias: el prompt que hoy tiene el agente usa {{producto_interes}}. Mandamos ambos
  // nombres para que funcione con el prompt viejo y con el nuevo. Cuando el dashboard
  // quede con un solo nombre, se puede borrar el que sobre.
  producto_interes: CATEGORIA_LEGIBLE[categoria] ?? 'seguros',
  es_afiliado: afiliado ? 'si' : 'no',
  nombre: afiliado?.nombre ?? '',
  celular: afiliado?.celular ?? '',
  email: afiliado?.email ?? '',
  ciudad: afiliado?.ciudad ?? '',
})

/**
 * Contexto que se inyecta al conectar por voz.
 *
 * Por qué existe: en WebSocket (chat) el SDK manda `conversation_initiation_client_data`
 * con las dynamic variables apenas abre el socket, antes de que el agente hable. En WebRTC
 * (voz) las manda DESPUÉS de entrar a la sala de LiveKit, así que el agente ya generó su
 * saludo sin conocerlas y no reconoce a la persona. Un contextual update cierra esa carrera:
 * es texto que el agente lee como contexto, no como algo dicho por el usuario.
 */
export const contextoInicial = (categoria: string, afiliado: Afiliado | null): string => {
  const producto = CATEGORIA_LEGIBLE[categoria] ?? 'seguros'
  if (!afiliado) {
    return [
      `[Contexto] La persona eligió en la web: ${producto}.`,
      'No es afiliada a Subsidio; nombre y contacto aún vacíos.',
      'Saluda y OFRECE YA hasta 3 pólizas de esa categoría (nombres + beneficio). No perfiles.',
      'PROHIBIDO preguntar qué quiere proteger, qué le preocupa, raza/edad u otros datos.',
      'Al elegir una: beneficios + precio desde la KB; luego si tiene dudas o desea proceder al pago.',
      'Solo entonces pide nombre/celular/correo. No preguntes si es afiliada.',
    ].join(' ')
  }
  return [
    `[Contexto] La persona eligió en la web: ${producto}.`,
    `Es afiliada a Subsidio. Se llama ${afiliado.nombre},`,
    `su celular es ${afiliado.celular}, su correo es ${afiliado.email} y vive en ${afiliado.ciudad}.`,
    'Salúdala por su nombre y OFRECE YA hasta 3 pólizas. No perfiles ni preguntes qué proteger.',
    'Al elegir una: beneficios + precio. Luego dudas o proceder. No preguntes si es afiliada ni datos hasta el final.',
  ].join(' ')
}

export type ConfigSesion = {
  agentId: string
  connectionType: 'webrtc' | 'websocket'
  textOnly: boolean
  dynamicVariables: Record<string, string>
}

/**
 * El transporte depende del modo: `textOnly` levanta una TextConversation, que va por
 * WebSocket. WebRTC es solo para la de voz — pedir webrtc en modo texto no conecta.
 */
export const configSesion = (
  modo: 'voz' | 'chat',
  variables: Record<string, string>,
): ConfigSesion => ({
  agentId: AGENT_ID,
  connectionType: modo === 'chat' ? 'websocket' : 'webrtc',
  textOnly: modo === 'chat',
  dynamicVariables: variables,
})

/** Suavizado del volumen para el orbe. lerp simple, sin AudioContext propio. */
export const lerp = (actual: number, objetivo: number, factor = 0.15) =>
  actual + (objetivo - actual) * factor

export const escalaOrbe = (volumenSuavizado: number) => 1 + volumenSuavizado * 0.18
