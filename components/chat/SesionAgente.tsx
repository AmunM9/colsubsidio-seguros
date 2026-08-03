'use client'

import { ConversationProvider } from '@elevenlabs/react'
import type { Afiliado } from '@/lib/catalog/afiliados'
import type { TurnoTranscripcion } from '@/lib/leads/extraer'
import { Sesion } from './Sesion'

export type DatosCierre = {
  nombre: string
  celular: string
  email: string
  canal: string
  franja: string
  /** Nombre canónico de la póliza elegida (p. ej. "Seguro exequial"). */
  poliza: string
}

export type PropsSesion = {
  modo: 'voz' | 'chat'
  categoria: string
  afiliado: Afiliado | null
  onCampo: (campo: string, valor: string) => void
  /** `turnos` va para poder rescatar de la conversación lo que el agente no reportó. */
  onReservado: (d: Partial<DatosCierre>, turnos: TurnoTranscripcion[]) => void
  /** Salida de emergencia cuando la voz se cae: pasa la misma sesión a texto. */
  onSeguirEnChat: () => void
}

/** `useConversation` exige un ConversationProvider como ancestro (v1). */
export function SesionAgente(props: PropsSesion) {
  return (
    <ConversationProvider>
      <Sesion {...props} />
    </ConversationProvider>
  )
}
