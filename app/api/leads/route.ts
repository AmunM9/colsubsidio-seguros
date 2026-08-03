import { NextResponse } from 'next/server'
import { leadStore } from '@/lib/leads/store'
import type { LeadPatch } from '@/lib/leads/types'

export const dynamic = 'force-dynamic'

const CAMPOS = new Set([
  'categoria', 'afiliado', 'documento', 'respuestas', 'productoRecomendado',
  'precioMostrado', 'duda', 'nombre', 'celular', 'email', 'canalPreferido',
  'franjaHoraria', 'ciudad', 'consentimiento', 'completitud', 'origen', 'estado',
])

/** Validación en el borde: solo pasan campos conocidos. Nada de spread ciego del body. */
const sanear = (body: unknown): LeadPatch | null => {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>
  if (typeof b.id !== 'string' || b.id.length < 6 || b.id.length > 64) return null
  const patch: Record<string, unknown> = { id: b.id }
  for (const [k, v] of Object.entries(b)) {
    if (CAMPOS.has(k) && v !== undefined) patch[k] = v
  }
  return patch as LeadPatch
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }
  const patch = sanear(body)
  if (!patch) return NextResponse.json({ ok: false, error: 'Payload inválido' }, { status: 400 })

  try {
    const lead = await leadStore.upsert(patch)
    return NextResponse.json({ ok: true, data: lead, error: null })
  } catch (e) {
    console.error('[api/leads] upsert falló:', e)
    return NextResponse.json({ ok: false, error: 'No se pudo guardar el lead' }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: await leadStore.listar(), error: null })
  } catch (e) {
    console.error('[api/leads] listar falló:', e)
    return NextResponse.json({ ok: false, error: 'No se pudieron leer los leads' }, { status: 500 })
  }
}
