import { PASOS, PRIMER_PASO } from './flow.config'
import type { AccionFlujo, EstadoFlujo, Respuestas } from './types'

/** Reducer puro. Sin React, sin efectos: se testea llamándolo. */

const visible = (id: string, r: Respuestas) => {
  const p = PASOS.find((x) => x.id === id)
  return !!p && (!p.mostrarSi || p.mostrarSi(r))
}

const siguienteVisible = (desde: string, r: Respuestas): string | null => {
  const i = PASOS.findIndex((p) => p.id === desde)
  for (let j = i + 1; j < PASOS.length; j++) {
    if (visible(PASOS[j].id, r)) return PASOS[j].id
  }
  return null
}

export const estadoInicial = (respuestasIniciales: Respuestas = {}): EstadoFlujo => {
  const respuestas = { ...respuestasIniciales }
  let pasoId = PRIMER_PASO
  const historial: string[] = []
  // Salta lo que ya venga respondido (ej. categoría elegida en el hero).
  while (respuestas[pasoId] !== undefined || !visible(pasoId, respuestas)) {
    if (visible(pasoId, respuestas)) historial.push(pasoId)
    const sig = siguienteVisible(pasoId, respuestas)
    if (!sig) break
    pasoId = sig
  }
  return { pasoId, respuestas, historial, terminado: false }
}

export const reducer = (estado: EstadoFlujo, accion: AccionFlujo): EstadoFlujo => {
  switch (accion.tipo) {
    case 'responder': {
      const respuestas = { ...estado.respuestas, [accion.pasoId]: accion.valor }
      const sig = siguienteVisible(accion.pasoId, respuestas)
      return {
        respuestas,
        pasoId: sig ?? estado.pasoId,
        historial: [...estado.historial, accion.pasoId],
        terminado: sig === null,
      }
    }
    case 'responder-multiple': {
      const respuestas = { ...estado.respuestas, ...accion.valores }
      const sig = siguienteVisible(estado.pasoId, respuestas)
      return {
        respuestas,
        pasoId: sig ?? estado.pasoId,
        historial: [...estado.historial, estado.pasoId],
        terminado: sig === null,
      }
    }
    case 'atras': {
      const historial = [...estado.historial]
      const anterior = historial.pop()
      if (!anterior) return estado
      const respuestas = { ...estado.respuestas }
      delete respuestas[anterior]
      return { respuestas, pasoId: anterior, historial, terminado: false }
    }
    case 'reiniciar':
      return estadoInicial(accion.respuestasIniciales)
  }
}

/** % de los pasos visibles que ya tienen respuesta. Alimenta `completitud` del lead. */
export const completitud = (r: Respuestas): number => {
  const visibles = PASOS.filter((p) => p.tipo !== 'reservado' && (!p.mostrarSi || p.mostrarSi(r)))
  const hechos = visibles.filter((p) => r[p.id] !== undefined)
  return Math.round((hechos.length / Math.max(visibles.length, 1)) * 100)
}
