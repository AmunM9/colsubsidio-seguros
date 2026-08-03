export type Canal = 'whatsapp' | 'llamada' | 'correo'
export type Franja = 'manana' | 'tarde' | 'noche'
export type EstadoLead = 'nuevo' | 'en-contacto' | 'cotizado'
export type Origen = 'chat' | 'voz'

export type Lead = {
  id: string
  creado: string
  actualizado: string
  categoria: string | null
  afiliado: string | null
  documento: string | null
  respuestas: Record<string, string>
  productoRecomendado: string | null
  precioMostrado: number | null
  duda: string | null
  nombre: string | null
  celular: string | null
  email: string | null
  canalPreferido: Canal | null
  franjaHoraria: Franja | null
  ciudad: string | null
  consentimiento: boolean
  completitud: number
  origen: Origen
  estado: EstadoLead
}

export type LeadPatch = Partial<Omit<Lead, 'id' | 'creado'>> & { id: string }

export interface LeadStore {
  upsert(patch: LeadPatch): Promise<Lead>
  listar(): Promise<Lead[]>
  suscribir(cb: (lead: Lead) => void): () => void
}
