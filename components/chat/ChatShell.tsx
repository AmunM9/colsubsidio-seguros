'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useReducer, useRef, useState } from 'react'
import { estadoInicial, reducer } from '@/lib/flow/engine'
import { paso as buscarPaso } from '@/lib/flow/flow.config'
import { useLead } from '@/lib/leads/useLead'
import { mapearCampoAgente } from '@/lib/leads/mapeo'
import { extraerDeTranscripcion, type TurnoTranscripcion } from '@/lib/leads/extraer'
import type { LeadPatch } from '@/lib/leads/types'
import type { Afiliado } from '@/lib/catalog/afiliados'
import { useTransicionPaso } from './useTransicionPaso'
import { Afiliacion } from './Afiliacion'
import { OptionButton } from './OptionButton'
import { Reservado } from './Reservado'
import { SesionAgente, type DatosCierre } from './SesionAgente'

/**
 * Principio de mínimo ruido: al responder, la pregunta anterior DESAPARECE y la
 * siguiente sube a ocupar su lugar. En pantalla vive una sola pregunta.
 */
export function ChatShell() {
  const params = useSearchParams()
  const router = useRouter()
  const categoriaInicial = params.get('c')
  const [estado, dispatch] = useReducer(
    reducer,
    categoriaInicial ? { categoria: categoriaInicial } : {},
    estadoInicial,
  )
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null)
  const [cierre, setCierre] = useState<Partial<DatosCierre>>({})
  /** Sobrescribe el modo elegido cuando la voz se cae y la persona decide seguir por chat. */
  const [modoForzado, setModoForzado] = useState<'chat' | null>(null)
  const { guardar } = useLead()
  const scope = useRef<HTMLDivElement>(null)
  const tarjeta = useRef<HTMLDivElement>(null)

  const pasoActual = buscarPaso(estado.pasoId)

  // Persiste en CADA respuesta, no al final: un abandono a mitad sigue siendo un lead.
  useEffect(() => {
    if (Object.keys(estado.respuestas).length > 0) void guardar(estado.respuestas)
  }, [estado.respuestas, guardar])

  const transicionar = useTransicionPaso(scope, tarjeta, estado.pasoId)

  const responder = (pasoId: string, valor: string) =>
    transicionar(() => dispatch({ tipo: 'responder', pasoId, valor }))

  const resolverAfiliacion = (esAfiliado: boolean, datos: Afiliado | null) => {
    setAfiliado(datos)
    void guardar(
      { ...estado.respuestas, afiliacion: esAfiliado ? 'si' : 'no' },
      {
        afiliado: esAfiliado ? 'si' : 'no',
        documento: datos?.documento ?? null,
        nombre: datos?.nombre ?? null,
        celular: datos?.celular ?? null,
        email: datos?.email ?? null,
        ciudad: datos?.ciudad ?? null,
      },
    )
    responder('afiliacion', esAfiliado ? 'si' : 'no')
  }

  /** Cada dato que suelta el agente cae en el lead al instante, no al final. */
  const registrarCampo = (campo: string, valor: string) => {
    try {
      const patch = mapearCampoAgente(campo, valor)
      if (!patch) {
        console.warn('[lead] campo no mapeado', { campo, valor })
        return
      }
      void guardar(estado.respuestas, patch)
    } catch (e) {
      console.error('[lead] registrarCampo falló', e)
    }
  }

  const terminar = (d: Partial<DatosCierre>, turnos: TurnoTranscripcion[]) => {
    // Afiliado: precarga. No afiliado: lo que vino de tools + transcripción (nombre/cel/mail).
    // Misma ruta para voz y texto: tools → transcripción → cierre.
    const base: Partial<DatosCierre> = afiliado
      ? { nombre: afiliado.nombre, celular: afiliado.celular, email: afiliado.email }
      : {}
    const porTranscripcion = extraerDeTranscripcion(turnos, estado.respuestas.categoria ?? '')
    const crudo = d as Partial<DatosCierre> & { producto?: string; product?: string }
    const polizaDeTool = crudo.poliza || crudo.producto || crudo.product || null
    const poliza =
      (polizaDeTool && mapearCampoAgente('poliza', polizaDeTool)?.productoRecomendado) ||
      porTranscripcion.productoRecomendado ||
      null

    const completo: Partial<DatosCierre> = {
      ...base,
      ...(porTranscripcion.nombre && { nombre: porTranscripcion.nombre }),
      ...(porTranscripcion.celular && { celular: porTranscripcion.celular }),
      ...(porTranscripcion.email && { email: porTranscripcion.email }),
      ...(porTranscripcion.canalPreferido && { canal: porTranscripcion.canalPreferido }),
      ...(porTranscripcion.franjaHoraria && { franja: porTranscripcion.franjaHoraria }),
      ...d,
      ...(poliza && { poliza }),
    }
    setCierre(completo)

    const porTool = Object.entries(completo).reduce<Partial<LeadPatch>>(
      (acc, [campo, valor]) =>
        typeof valor === 'string' ? { ...acc, ...mapearCampoAgente(campo, valor) } : acc,
      {},
    )

    const origen = estado.respuestas.modo === 'voz' ? 'voz' : 'chat'

    void guardar(
      { ...estado.respuestas, sesion: 'ok' },
      {
        ...porTranscripcion,
        ...porTool, // lo reportado por el agente / cierre siempre gana
        ...(poliza && { productoRecomendado: poliza }),
        afiliado: afiliado ? 'si' : 'no',
        origen,
        completitud: 100,
        estado: 'en-contacto',
      },
    )
    responder('sesion', 'ok')
  }

  if (!pasoActual) return null

  return (
    <div ref={scope} className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        {/* En el cierre no hay a dónde volver: la única salida es el botón de la pantalla. */}
        {pasoActual.tipo === 'reservado' ? (
          <span />
        ) : (
          <button
            type="button"
            onClick={() =>
              estado.historial.length
                ? transicionar(() => dispatch({ tipo: 'atras' }))
                : router.push('/')
            }
            className="rounded-full px-3 py-2 text-sm text-[var(--grafito-60)] transition-colors hover:text-[var(--azul)]"
          >
            <span aria-hidden="true">←</span> {estado.historial.length ? 'Atrás' : 'Salir'}
          </button>
        )}
        <Link href="/" className="text-sm font-semibold text-[var(--tinta)]">
          Seguros
        </Link>
      </div>

      <div ref={tarjeta}>
        {pasoActual.tipo !== 'reservado' && (
          <header className="mb-7">
            <h1 className="font-display text-3xl font-extrabold text-[var(--tinta)]">
              {pasoActual.tipo === 'sesion' && afiliado
                ? `Hola, ${afiliado.nombre.split(' ')[0]}`
                : pasoActual.titulo}
            </h1>
            {pasoActual.subtitulo && <p className="mt-3 text-[var(--grafito)]">{pasoActual.subtitulo}</p>}
          </header>
        )}

        {pasoActual.tipo === 'choice' && (
          <div className="grid gap-3">
            {pasoActual.opciones?.map((o) => (
              <OptionButton key={o.valor} opcion={o} onSelect={(v) => responder(pasoActual.id, v)} />
            ))}
          </div>
        )}

        {pasoActual.tipo === 'afiliacion' && <Afiliacion onListo={resolverAfiliacion} />}

        {pasoActual.tipo === 'sesion' && (
          <SesionAgente
            modo={modoForzado ?? (estado.respuestas.modo === 'voz' ? 'voz' : 'chat')}
            categoria={estado.respuestas.categoria ?? ''}
            afiliado={afiliado}
            onCampo={registrarCampo}
            onReservado={terminar}
            onSeguirEnChat={() => setModoForzado('chat')}
          />
        )}

        {pasoActual.tipo === 'reservado' && <Reservado datos={cierre} />}
      </div>
    </div>
  )
}
