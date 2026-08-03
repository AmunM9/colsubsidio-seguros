/**
 * DEMO TEMPORAL — perfilamiento de leads para la demo del hackathon.
 *
 * - Oculta / elimina leads incompletos del panel.
 * - Al completar una sesión, rellena al azar solo los campos que falten.
 *
 * Pon `DEMO_PERFIL_LEADS = false` para desactivar sin tocar el resto del flujo.
 */

import { PRODUCTOS } from '@/lib/catalog/products'
import type { Canal, Franja, Lead } from './types'

export const DEMO_PERFIL_LEADS = true

const NOMBRES = [
  'Valentina Rojas',
  'Carlos Méndez',
  'Juliana Castro',
  'Andrés Vargas',
  'Camila Restrepo',
  'Santiago López',
  'Mariana Gómez',
  'Diego Ramírez',
  'Laura Fernández',
  'Sebastián Morales',
]

const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Pereira']
const CANALES: Canal[] = ['whatsapp', 'llamada', 'correo']
const FRANJAS: Franja[] = ['manana', 'tarde', 'noche']

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!

const celularDemo = () => {
  const n = `3${Math.floor(100000000 + Math.random() * 899999999)}`
  return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`
}

const emailDemo = (nombre: string) => {
  const base = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join('.')
  const dominio = pick(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'])
  return `${base || 'contacto'}${Math.floor(Math.random() * 90 + 10)}@${dominio}`
}

/** Basura típica de STT / agente que no es un nombre real. */
const nombreUsable = (n: string | null | undefined): n is string => {
  if (!n?.trim()) return false
  const t = n.trim()
  if (t.length < 3 || t.length > 60) return false
  if (/\d/.test(t)) return false
  if (/veo que|interesad|hola[, ]|perfecto|claro|gracias|buen[oa]/i.test(t)) return false
  return t.split(/\s+/).length <= 4
}

const productoPara = (categoria: string | null): string | null => {
  const deCat = PRODUCTOS.filter((p) => !categoria || p.categoria === categoria)
  if (!deCat.length) return pick(PRODUCTOS).nombre
  return pick(deCat).nombre
}

/** Sesión cerrada (flujo terminó). */
export const sesionCompleta = (l: Lead): boolean =>
  l.respuestas?.sesion === 'ok' || l.completitud >= 100 || l.estado === 'en-contacto'

/** Listo para el panel: sesión cerrada + datos de perfil visibles (nada de filas con —). */
export const listoParaPanel = (l: Lead): boolean => {
  if (!sesionCompleta(l)) return false
  if (!nombreUsable(l.nombre)) return false
  const cel = l.celular?.replace(/\D/g, '') ?? ''
  if (cel.length < 10 && !l.email?.includes('@')) return false
  if (!l.productoRecomendado?.trim()) return false
  if (!l.canalPreferido || !l.franjaHoraria) return false
  return true
}

/**
 * Rellena solo huecos. No pisa lo que ya vino de la conversación.
 */
export const completarHuecosDemo = (lead: Lead): Lead => {
  if (!DEMO_PERFIL_LEADS) return lead

  const nombre = nombreUsable(lead.nombre) ? lead.nombre.trim() : pick(NOMBRES)
  const email = lead.email?.includes('@') ? lead.email : emailDemo(nombre)
  const digitosCel = lead.celular?.replace(/\D/g, '') ?? ''
  const celular = digitosCel.length >= 10 && lead.celular ? lead.celular : celularDemo()

  return {
    ...lead,
    nombre,
    email,
    celular,
    canalPreferido: lead.canalPreferido ?? pick(CANALES),
    franjaHoraria: lead.franjaHoraria ?? pick(FRANJAS),
    ciudad: lead.ciudad?.trim() || pick(CIUDADES),
    productoRecomendado: lead.productoRecomendado?.trim() || productoPara(lead.categoria),
    afiliado: lead.afiliado === 'si' || lead.afiliado === 'no' ? lead.afiliado : pick(['si', 'no'] as const),
    consentimiento: true,
    completitud: 100,
    estado: lead.estado === 'nuevo' ? 'en-contacto' : lead.estado,
  }
}
