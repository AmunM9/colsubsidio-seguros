import { leadStore } from '@/lib/leads/store'

export const dynamic = 'force-dynamic'

/** SSE con ReadableStream. Cero dependencias, cero WebSocket, cero polling. */
export async function GET(req: Request) {
  const enc = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const enviar = (evento: string, data: unknown) => {
        try {
          controller.enqueue(enc.encode(`event: ${evento}\ndata: ${JSON.stringify(data)}\n\n`))
        } catch {
          // Cliente ya cerrado.
        }
      }

      enviar('inicial', await leadStore.listar())
      const desuscribir = leadStore.suscribir((lead) => enviar('lead', lead))
      const latido = setInterval(() => enviar('ping', Date.now()), 25_000)

      req.signal.addEventListener('abort', () => {
        clearInterval(latido)
        desuscribir()
        try {
          controller.close()
        } catch {
          /* ya cerrado */
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
