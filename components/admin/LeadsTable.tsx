'use client'

import { useEffect, useState } from 'react'
import { DEMO_PERFIL_LEADS, listoParaPanel } from '@/lib/leads/demo-perfil'
import type { Lead } from '@/lib/leads/types'

const visibles = (lista: Lead[]) => (DEMO_PERFIL_LEADS ? lista.filter(listoParaPanel) : lista)

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const CSV_COLS: (keyof Lead)[] = [
  'creado', 'nombre', 'celular', 'email', 'canalPreferido', 'franjaHoraria',
  'categoria', 'productoRecomendado', 'afiliado', 'completitud', 'consentimiento', 'estado', 'duda',
]

const exportar = (leads: Lead[]) => {
  const filas = [
    CSV_COLS.join(','),
    ...leads.map((l) => CSV_COLS.map((c) => `"${String(l[c] ?? '').replace(/"/g, '""')}"`).join(',')),
  ]
  const url = URL.createObjectURL(new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [abierto, setAbierto] = useState<string | null>(null)
  // En estado, no en un ref: el resaltado es información que se renderiza.
  const [recientes, setRecientes] = useState<string[]>([])

  useEffect(() => {
    let vivo = true
    // Carga dura: limpia historial vacío aunque el SSE tuviera estado viejo en el cliente.
    void fetch('/api/leads')
      .then((r) => r.json())
      .then((j: { data?: Lead[] }) => {
        if (vivo && Array.isArray(j.data)) setLeads(visibles(j.data))
      })
      .catch(() => {})

    const es = new EventSource('/api/leads/stream')
    es.addEventListener('inicial', (e) => {
      setLeads(visibles(JSON.parse((e as MessageEvent).data) as Lead[]))
    })
    es.addEventListener('lead', (e) => {
      const lead: Lead = JSON.parse((e as MessageEvent).data)
      if (DEMO_PERFIL_LEADS && !listoParaPanel(lead)) {
        // DEMO: saca del historial visible si llegó vacío / a medias.
        setLeads((prev) => prev.filter((l) => l.id !== lead.id))
        return
      }
      setRecientes((prev) => [...prev, lead.id])
      setTimeout(() => setRecientes((prev) => prev.filter((id) => id !== lead.id)), 1600)
      setLeads((prev) => visibles([lead, ...prev.filter((l) => l.id !== lead.id)]))
    })
    es.onerror = () => console.error('[admin] SSE interrumpido; el navegador reintenta solo')
    return () => {
      vivo = false
      es.close()
    }
  }, [])

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="tabular text-sm text-[var(--grafito-60)]">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'} · en vivo
        </p>
        <button
          type="button"
          onClick={() => exportar(leads)}
          className="rounded-full border border-[var(--borde-fuerte)] px-4 py-2 text-sm font-semibold hover:border-[var(--azul)] hover:text-[var(--azul)]"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-[var(--radio)] border border-[var(--borde)] bg-[var(--superficie)]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[var(--borde)] text-xs uppercase tracking-wide text-[var(--grafito-60)]">
            <tr>
              {['Hora', 'Nombre', 'Contacto', 'Canal', 'Franja', 'Categoría', 'Producto', 'Afiliado', '%', 'Estado'].map(
                (h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-[var(--grafito-60)]">
                  Sin leads todavía. Abre <code>/cotizar</code> en otra pestaña y responde una pregunta.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr
                key={l.id}
                onClick={() => setAbierto(abierto === l.id ? null : l.id)}
                className={`cursor-pointer border-b border-[var(--borde)] transition-colors duration-[1200ms] last:border-0 hover:bg-[var(--fondo)] ${
                  recientes.includes(l.id) ? 'bg-[var(--amarillo)]' : ''
                }`}
              >
                <td className="tabular px-4 py-3 text-[var(--grafito-60)]">{hora(l.actualizado)}</td>
                <td className="px-4 py-3 font-semibold text-[var(--tinta)]">{l.nombre ?? '—'}</td>
                <td className="tabular px-4 py-3">{l.celular || l.email || '—'}</td>
                <td className="px-4 py-3">{l.canalPreferido ?? '—'}</td>
                <td className="px-4 py-3">{l.franjaHoraria ?? '—'}</td>
                <td className="px-4 py-3">{l.categoria ?? '—'}</td>
                <td className="px-4 py-3">{l.productoRecomendado ?? '—'}</td>
                <td className="px-4 py-3">{l.afiliado ?? '—'}</td>
                <td className="tabular px-4 py-3 font-semibold">{l.completitud}%</td>
                <td className="px-4 py-3">{l.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {abierto && (
        <pre className="mt-4 overflow-x-auto rounded-[var(--radio)] border border-[var(--borde)] bg-[var(--superficie)] p-5 text-xs text-[var(--grafito)]">
          {JSON.stringify(leads.find((l) => l.id === abierto), null, 2)}
        </pre>
      )}
    </section>
  )
}
