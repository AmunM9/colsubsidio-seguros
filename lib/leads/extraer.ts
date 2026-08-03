import { PRODUCTOS, canonizarProducto } from '@/lib/catalog/products'
import type { Canal, Franja, LeadPatch } from './types'

/**
 * Red de seguridad: saca canal, franja, contacto y póliza de la propia conversación.
 * Lo que reporte el agente por tool SIEMPRE gana sobre lo que se extraiga aquí.
 */

export type TurnoTranscripcion = { de: 'agente' | 'yo'; texto: string }

const normalizar = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const NEGACION = /\b(no|nada|ninguno|ninguna)\b/

const detectarCanal = (t: string): Canal | null => {
  if (/whats|wasap|guasap/.test(t)) return 'whatsapp'
  if (/llamad|telefon|me llamen|marquen/.test(t)) return 'llamada'
  if (/correo|email|mail/.test(t)) return 'correo'
  return null
}

const detectarFranja = (t: string): Franja | null => {
  if (/\bmanana\b|temprano|am\b/.test(t)) return 'manana'
  if (/\btarde\b|pm\b/.test(t)) return 'tarde'
  if (/\bnoche\b/.test(t)) return 'noche'
  return null
}

const detectarEmail = (t: string): string | null => {
  const m = t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
  return m ? m[0] : null
}

const detectarCelular = (t: string): string | null => {
  const digitos = t.replace(/\D/g, '')
  // Celular CO: 10 dígitos empezando en 3, a veces con 57 delante.
  const m = digitos.match(/(?:57)?(3\d{9})/)
  if (!m) return null
  const n = m[1]
  return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`
}

/** Nombre tras confirmaciones del agente o respuestas cortas de la persona. */
const detectarNombre = (turnos: TurnoTranscripcion[]): string | null => {
  for (let i = turnos.length - 1; i >= 0; i--) {
    const t = turnos[i]
    if (t.de === 'agente') {
      const m = t.texto.match(
        /(?:te llamas|tu nombre es|nombre es|hola[, ]+)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3})/i,
      )
      if (m?.[1] && !/whatsapp|llamada|tarde|manana|noche/i.test(m[1])) return m[1].trim()
    }
  }
  // Respuesta corta del usuario tras pedir el nombre (2–4 palabras, sin dígitos).
  for (let i = 0; i < turnos.length - 1; i++) {
    const prev = normalizar(turnos[i].texto)
    const next = turnos[i + 1]
    if (turnos[i].de !== 'agente' || next.de !== 'yo') continue
    if (!/como te llamas|tu nombre|me digas tu nombre|nombre completo/.test(prev)) continue
    const candidato = next.texto.trim()
    if (
      candidato &&
      !/\d/.test(candidato) &&
      !/@/.test(candidato) &&
      candidato.split(/\s+/).length <= 4 &&
      candidato.length < 60
    ) {
      return candidato
    }
  }
  return null
}

const ultimoHallazgo = <T>(
  turnos: TurnoTranscripcion[],
  detectar: (texto: string) => T | null,
  de: TurnoTranscripcion['de'] | null,
): T | null => {
  for (let i = turnos.length - 1; i >= 0; i--) {
    if (de && turnos[i].de !== de) continue
    const texto = normalizar(turnos[i].texto)
    const hallazgo = detectar(texto)
    if (hallazgo && !NEGACION.test(texto)) return hallazgo
  }
  return null
}

const productosEnTexto = (texto: string, categoria: string): string[] => {
  const n = normalizar(texto)
  const candidatos = [...PRODUCTOS.filter((p) => !categoria || p.categoria === categoria)].sort(
    (a, b) => b.nombre.length - a.nombre.length,
  )
  const hallados: string[] = []
  let resto = n
  for (const p of candidatos) {
    const nombre = normalizar(p.nombre)
    if (resto.includes(nombre)) {
      hallados.push(p.nombre)
      resto = resto.replace(nombre, ' ') // evita que "vida" robe dentro de "vida y ahorro"
    }
  }
  if (hallados.length) return hallados
  const alias = canonizarProducto(texto, categoria)
  return alias ? [alias] : []
}

const polizaMencionada = (turnos: TurnoTranscripcion[], categoria: string): string | null => {
  // 1) Lo que eligió la persona ("el exequial") pesa más que el catálogo del agente.
  for (let i = turnos.length - 1; i >= 0; i--) {
    if (turnos[i].de !== 'yo') continue
    const hallados = productosEnTexto(turnos[i].texto, categoria)
    if (hallados.length === 1) return hallados[0]
  }

  // 2) Agente: solo turnos con UNA póliza clara (evita el listado "vida, exequial y…").
  for (let i = turnos.length - 1; i >= 0; i--) {
    if (turnos[i].de !== 'agente') continue
    const hallados = productosEnTexto(turnos[i].texto, categoria)
    if (hallados.length === 1) return hallados[0]
  }

  // 3) Último recurso: la última mención concreta del agente (aunque cite varias).
  for (let i = turnos.length - 1; i >= 0; i--) {
    if (turnos[i].de !== 'agente') continue
    const hallados = productosEnTexto(turnos[i].texto, categoria)
    if (hallados.length) return hallados[0]
  }
  return null
}

export const extraerCanalFranja = (
  turnos: TurnoTranscripcion[],
): Partial<{ canal: Canal; franja: Franja }> => {
  const canal =
    ultimoHallazgo(turnos, detectarCanal, 'yo') ?? ultimoHallazgo(turnos, detectarCanal, 'agente')
  const franja =
    ultimoHallazgo(turnos, detectarFranja, 'yo') ?? ultimoHallazgo(turnos, detectarFranja, 'agente')
  return {
    ...(canal && { canal }),
    ...(franja && { franja }),
  }
}

/** Contacto para no afiliados: tools primero; si fallan, la transcripción. */
export const extraerContacto = (
  turnos: TurnoTranscripcion[],
): Partial<{ nombre: string; celular: string; email: string }> => {
  const email =
    ultimoHallazgo(turnos, detectarEmail, 'yo') ?? ultimoHallazgo(turnos, detectarEmail, 'agente')
  const celular =
    ultimoHallazgo(turnos, detectarCelular, 'yo') ??
    ultimoHallazgo(turnos, detectarCelular, 'agente')
  const nombre = detectarNombre(turnos)
  return {
    ...(nombre && { nombre }),
    ...(celular && { celular }),
    ...(email && { email }),
  }
}

export const extraerDeTranscripcion = (
  turnos: TurnoTranscripcion[],
  categoria: string,
): Partial<LeadPatch> => {
  const { canal, franja } = extraerCanalFranja(turnos)
  const contacto = extraerContacto(turnos)
  const poliza = polizaMencionada(turnos, categoria)

  return {
    ...contacto,
    ...(canal && { canalPreferido: canal }),
    ...(franja && { franjaHoraria: franja }),
    ...(poliza && { productoRecomendado: poliza }),
  }
}
