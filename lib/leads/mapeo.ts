import { canonizarProducto } from '@/lib/catalog/products'
import type { Canal, Franja, LeadPatch } from './types'

/**
 * Traduce los campos que manda el agente de voz a los del lead.
 *
 * El agente habla en sus términos (`canal`, `franja`, `poliza`); el lead usa
 * `canalPreferido`, `franjaHoraria`, `productoRecomendado`. Sin esta traducción la API
 * los descarta por no estar en su lista de campos permitidos y nunca llegan al panel.
 */

const normalizar = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const aCanal = (v: string): Canal | null => {
  const n = normalizar(v)
  if (/whats|wasap|guasap/.test(n)) return 'whatsapp'
  if (/llamad|telefon|celular|marcar/.test(n)) return 'llamada'
  if (/correo|email|mail/.test(n)) return 'correo'
  return null
}

const aFranja = (v: string): Franja | null => {
  const n = normalizar(v)
  if (/manana|amanecer|temprano|am\b/.test(n)) return 'manana'
  if (/tarde|pm\b/.test(n)) return 'tarde'
  if (/noche/.test(n)) return 'noche'
  return null
}

/** Acepta las formas que ElevenLabs suele mandar; nunca lanza. */
export const parseArgsContacto = (
  p: unknown,
): { campo: string; valor: string } | null => {
  if (!p || typeof p !== 'object') return null
  const o = p as Record<string, unknown>
  const campo = String(o.campo ?? o.field ?? o.name ?? o.key ?? o.nombre_campo ?? '').trim()
  const valor = String(o.valor ?? o.value ?? o.data ?? o.dato ?? '').trim()
  if (!campo || !valor) return null
  return { campo, valor }
}

export const parseArgsReserva = (
  p: unknown,
): { canal?: string; franja?: string } => {
  if (!p || typeof p !== 'object') return {}
  const o = p as Record<string, unknown>
  const canal = String(o.canal ?? o.channel ?? o.canalPreferido ?? o.medio ?? '').trim()
  const franja = String(o.franja ?? o.slot ?? o.franjaHoraria ?? o.horario ?? '').trim()
  return {
    ...(canal && { canal }),
    ...(franja && { franja }),
  }
}

/** Devuelve el parche para el lead, o `null` si el campo no se reconoce. */
export const mapearCampoAgente = (campo: string, valor: string): Partial<LeadPatch> | null => {
  if (typeof campo !== 'string' || typeof valor !== 'string') return null
  const v = valor.trim()
  if (!v) return null

  switch (normalizar(campo)) {
    case 'nombre':
    case 'name':
      return { nombre: v }
    case 'celular':
    case 'telefono':
    case 'phone':
    case 'mobile':
      return { celular: v }
    case 'email':
    case 'correo':
    case 'mail':
      return { email: v }
    case 'ciudad':
    case 'city':
      return { ciudad: v }
    case 'canal':
    case 'canalpreferido':
    case 'channel':
    case 'medio': {
      const canal = aCanal(v)
      return canal ? { canalPreferido: canal } : null
    }
    case 'franja':
    case 'franjahoraria':
    case 'horario':
    case 'slot': {
      const franja = aFranja(v)
      return franja ? { franjaHoraria: franja } : null
    }
    case 'poliza':
    case 'producto':
    case 'product':
    case 'seguro': {
      // "exequial" / "vida" → nombre del catálogo; si no hay match, se guarda tal cual.
      const canonico = canonizarProducto(v)
      return { productoRecomendado: canonico ?? v }
    }
    default:
      return null
  }
}
