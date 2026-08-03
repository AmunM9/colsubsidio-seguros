import { Suspense } from 'react'
import { ChatShell } from '@/components/chat/ChatShell'

export const metadata = { title: 'Cotiza en 2 minutos · Subsidio' }

export default function Cotizar() {
  return (
    <main className="min-h-dvh">
      <Suspense fallback={null}>
        <ChatShell />
      </Suspense>
    </main>
  )
}
