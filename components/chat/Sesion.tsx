'use client'

import { useConversation, useConversationClientTool } from '@elevenlabs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AGENT_ID,
  TOOLS,
  configSesion,
  contextoInicial,
  variablesDinamicas,
  type ArgsContacto,
} from '@/lib/voice/elevenlabs'
import { mensajeDeError } from '@/lib/voice/errores'
import { extraerCanalFranja, extraerContacto } from '@/lib/leads/extraer'
import { parseArgsContacto, parseArgsReserva } from '@/lib/leads/mapeo'
import { AvisoSesion } from './AvisoSesion'
import { EntradaChat } from './EntradaChat'
import { PanelVoz } from './PanelVoz'
import { Transcripcion, type Turno } from './Transcripcion'
import type { DatosCierre, PropsSesion } from './SesionAgente'

/** El agente a veces se despide sin tool ni End Call; con esto no dejamos la sesión colgada. */
const esDespedida = (texto: string) =>
  /qued[oó]\s+registrada|qued[oó]\s+reservado|que est[eé]s muy bien|en breve se comunicar/i.test(
    texto,
  )

export function Sesion({
  modo,
  categoria,
  afiliado,
  onCampo,
  onReservado,
  onSeguirEnChat,
}: PropsSesion) {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const turnosRef = useRef<Turno[]>([])
  const [fallo, setFallo] = useState<string | null>(null)
  const cierre = useRef<Partial<DatosCierre>>({})
  const contextoEnviado = useRef(false)
  const yaCerro = useRef(false)
  const huboConversacion = useRef(false)
  const despedidaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endSessionRef = useRef<() => Promise<void> | void>(() => {})
  const cerrarRef = useRef<(extra?: Partial<DatosCierre>) => void>(() => {})

  const cerrar = useCallback(
    (extra: Partial<DatosCierre> = {}) => {
      if (yaCerro.current) return
      yaCerro.current = true
      if (despedidaTimer.current) {
        clearTimeout(despedidaTimer.current)
        despedidaTimer.current = null
      }
      const delHilo = {
        ...extraerContacto(turnosRef.current),
        ...extraerCanalFranja(turnosRef.current),
      }
      // Cuelga WebRTC/WebSocket antes de desmontar; si no, la "llamada" sigue viva.
      try {
        void endSessionRef.current()
      } catch {
        /* ya cerrada */
      }
      onReservado({ ...delHilo, ...cierre.current, ...extra }, turnosRef.current)
    },
    [onReservado],
  )

  useEffect(() => {
    cerrarRef.current = cerrar
  }, [cerrar])

  const agregarTurno = useCallback((turno: Turno) => {
    turnosRef.current = [...turnosRef.current, turno]
    setTurnos(turnosRef.current)
  }, [])

  const conv = useConversation({
    onMessage: ({ message, source }) => {
      huboConversacion.current = true
      setFallo(null)
      if (source === 'ai') {
        agregarTurno({ de: 'agente', texto: message })
        // Fallback: el workflow a veces no llama confirmar_reserva ni End Call.
        if (!yaCerro.current && esDespedida(message)) {
          if (despedidaTimer.current) clearTimeout(despedidaTimer.current)
          despedidaTimer.current = setTimeout(() => cerrarRef.current(), 1200)
        }
        return
      }
      if (modo === 'voz') agregarTurno({ de: 'yo', texto: message })
    },
    onError: (e) => setFallo(mensajeDeError(e)),
    onUnhandledClientToolCall: (llamada) => {
      console.warn('[voz] tool no registrada en la app:', llamada)
      // Si el agente intenta cerrar con otro nombre, no dejamos la llamada abierta.
      const nombre = String((llamada as { tool_name?: string }).tool_name ?? '').toLowerCase()
      if (nombre.includes('reserva') || nombre.includes('confirm') || nombre.includes('end')) {
        setTimeout(() => cerrarRef.current(), 0)
      }
    },
    onDisconnect: (detalle) => {
      if (detalle.reason === 'error') {
        setFallo(mensajeDeError(detalle.message))
        return
      }
      if (huboConversacion.current) cerrarRef.current()
    },
  })

  const { endSession } = conv
  useEffect(() => {
    endSessionRef.current = () => endSession()
  }, [endSession])

  useConversationClientTool(TOOLS.contacto, (p) => {
    try {
      const args = parseArgsContacto(p) ?? (p as unknown as ArgsContacto)
      const campo = String(args?.campo ?? '').trim()
      const valor = String(args?.valor ?? '').trim()
      console.info('[voz] capturar_contacto', { raw: p, campo, valor })
      if (!campo || !valor) return 'ok: sin campo/valor reconocible'
      // poliza/producto → clave `poliza` en el cierre (pantalla de pago + lead).
      const claveCierre =
        /^(poliza|producto|product|seguro)$/i.test(campo) ? 'poliza' : campo
      cierre.current = { ...cierre.current, [claveCierre]: valor }
      onCampo(campo, valor)
      return 'ok'
    } catch (e) {
      console.error('[voz] capturar_contacto falló', e)
      return 'error controlado'
    }
  })
  useConversationClientTool(TOOLS.reserva, (p) => {
    try {
      const { canal, franja } = parseArgsReserva(p)
      console.info('[voz] confirmar_reserva', { raw: p, canal, franja })
      const extra = {
        ...(canal && { canal }),
        ...(franja && { franja }),
      }
      // Responder la tool YA; colgar/cerrar en el siguiente tick.
      setTimeout(() => cerrarRef.current(extra), 50)
      return 'reservado'
    } catch (e) {
      console.error('[voz] confirmar_reserva falló', e)
      setTimeout(() => cerrarRef.current(), 50)
      return 'reservado'
    }
  })
  useConversationClientTool(TOOLS.humano, () => {
    setTimeout(() => cerrarRef.current({ canal: 'llamada' }), 50)
    return 'ok'
  })

  const { startSession } = conv
  const arrancar = useCallback(() => {
    if (!AGENT_ID) return
    yaCerro.current = false
    huboConversacion.current = false
    contextoEnviado.current = false
    startSession(configSesion(modo, variablesDinamicas(categoria, afiliado)))
  }, [startSession, modo, categoria, afiliado])

  useEffect(() => {
    if (modo === 'chat') arrancar()
  }, [modo, arrancar])

  useEffect(
    () => () => {
      if (despedidaTimer.current) clearTimeout(despedidaTimer.current)
    },
    [],
  )

  const conectado = conv.status === 'connected'

  const { sendContextualUpdate } = conv
  useEffect(() => {
    if (modo !== 'voz' || !conectado || contextoEnviado.current) return
    contextoEnviado.current = true
    sendContextualUpdate(contextoInicial(categoria, afiliado))
  }, [modo, conectado, sendContextualUpdate, categoria, afiliado])

  const leerVolumen = useCallback(
    () => (conv.isSpeaking ? conv.getOutputVolume() : conv.getInputVolume()),
    [conv],
  )

  if (!AGENT_ID) {
    return (
      <p role="alert" className="rounded-[var(--radio)] border border-[var(--borde-fuerte)] bg-[var(--superficie)] p-6 font-medium text-[var(--error)]">
        Falta NEXT_PUBLIC_ELEVENLABS_AGENT_ID en .env.local.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {fallo && (
        <AvisoSesion
          texto={fallo}
          conectado={conectado}
          puedePasarAChat={modo === 'voz'}
          onReintentar={() => {
            setFallo(null)
            arrancar()
          }}
          onSeguirEnChat={() => {
            setFallo(null)
            onSeguirEnChat()
          }}
          onCerrar={() => setFallo(null)}
        />
      )}

      {modo === 'voz' && (
        <PanelVoz conectado={conectado} hablando={conv.isSpeaking} leerVolumen={leerVolumen} onEmpezar={arrancar} />
      )}

      <Transcripcion turnos={turnos} cargando={!conectado && modo === 'chat'} />

      {modo === 'chat' && (
        <EntradaChat
          habilitada={conectado}
          onEnviar={(mio) => {
            conv.sendUserMessage(mio)
            agregarTurno({ de: 'yo', texto: mio })
          }}
        />
      )}

      {conectado && (
        <button
          type="button"
          onClick={() => {
            void conv.endSession()
            cerrar()
          }}
          className="text-sm text-[var(--grafito-60)] underline hover:text-[var(--azul)]"
        >
          Terminar la conversación
        </button>
      )}
    </div>
  )
}
