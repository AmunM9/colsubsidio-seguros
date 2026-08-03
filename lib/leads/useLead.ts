'use client'

import { useCallback, useRef, useState } from 'react'
import { completitud } from '@/lib/flow/engine'
import { recomendar } from '@/lib/catalog/products'
import type { Respuestas } from '@/lib/flow/types'
import type { LeadPatch, Origen } from './types'

/** Quita las claves nulas: el store hace merge, así que enviar `null` PISA lo ya guardado. */
const sinNulos = <T extends Record<string, unknown>>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>

/**
 * El lead se crea y se persiste en la PRIMERA respuesta, no al final.
 * Un abandono a mitad sigue siendo un lead con categoría y % de completitud.
 */
export function useLead(origenInicial: Origen = 'chat') {
  // Inicialización perezosa: un solo id por sesión de flujo, sin tocar refs en render.
  const [leadId] = useState(() => crypto.randomUUID())
  /** La póliza específica (exequial, etc.) no se puede pisar con el default de categoría. */
  const productoFijo = useRef<string | null>(null)

  const guardar = useCallback(
    async (respuestas: Respuestas, extra: Partial<LeadPatch> = {}) => {
      if (typeof extra.productoRecomendado === 'string' && extra.productoRecomendado.trim()) {
        productoFijo.current = extra.productoRecomendado.trim()
      }

      const sugerido = respuestas.categoria ? recomendar(respuestas) : null
      const productoNombre =
        (typeof extra.productoRecomendado === 'string' && extra.productoRecomendado.trim()) ||
        productoFijo.current ||
        sugerido?.nombre ||
        null

      const origen: Origen =
        extra.origen ??
        (respuestas.modo === 'voz' ? 'voz' : respuestas.modo === 'chat' ? 'chat' : origenInicial)

      const patch: LeadPatch = {
        id: leadId,
        origen,
        respuestas,
        completitud: completitud(respuestas),
        // Solo lo que tenga valor. Un guardado posterior no puede borrar los datos
        // del afiliado que trajo la pantalla anterior.
        ...sinNulos({
          categoria: respuestas.categoria,
          productoRecomendado: productoNombre,
          precioMostrado: sugerido?.precioDesde,
        }),
        ...sinNulos(extra),
        // Tras el merge de extra, reafirmamos el producto fijo para que un
        // `guardar(respuestas)` sin extra (p. ej. al cerrar la sesión) no lo borre.
        ...(productoNombre ? { productoRecomendado: productoNombre } : {}),
      }
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
      } catch (e) {
        // El flujo no se bloquea porque falle la red; el usuario no tiene por qué pagarlo.
        console.error('[lead] no se pudo guardar:', e)
      }
    },
    [origenInicial, leadId],
  )

  return { leadId, guardar }
}
