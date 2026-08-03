import Link from 'next/link'
import { LeadsTable } from '@/components/admin/LeadsTable'

export const metadata = { title: 'Panel de leads · Subsidio' }

export default function Admin() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/" className="mb-8 inline-block text-sm text-[var(--grafito-60)] hover:text-[var(--azul)]">
        ← Inicio
      </Link>
      <h1 className="font-display text-3xl font-extrabold">Leads en vivo</h1>
      <p className="mt-3 max-w-2xl text-[var(--grafito)]">
        Cada respuesta del flujo cae aquí en el momento. Haz clic en una fila para ver todas las
        respuestas y la duda escrita. <strong>Sin autenticación: es una demo.</strong> No poner datos
        reales de personas.
      </p>
      <div className="mt-10">
        <LeadsTable />
      </div>
    </main>
  )
}
