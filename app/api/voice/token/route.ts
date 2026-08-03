import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Token de conversación de ElevenLabs Agents.
 *
 * Solo hace falta si el agente es PRIVADO. Si es público, el cliente pasa `agentId`
 * directamente y esta ruta no se usa. La API key nunca sale del servidor.
 */
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID

  if (!apiKey || !agentId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Faltan ELEVENLABS_API_KEY y/o ELEVENLABS_AGENT_ID. Ver .env.example y la sección "Encender la voz" del README.',
      },
      { status: 501 },
    )
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    )
    if (!r.ok) {
      console.error('[voice/token] ElevenLabs respondió', r.status)
      return NextResponse.json({ ok: false, error: 'ElevenLabs rechazó la solicitud' }, { status: 502 })
    }
    const data = (await r.json()) as { token?: string }
    return NextResponse.json({ ok: true, data, error: null })
  } catch (e) {
    console.error('[voice/token] fallo de red:', e)
    return NextResponse.json({ ok: false, error: 'No se pudo contactar a ElevenLabs' }, { status: 502 })
  }
}
