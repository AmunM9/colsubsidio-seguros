'use client'

import Link from 'next/link'
import { Lock, ShieldCheck } from '@phosphor-icons/react'
import type { DatosCierre } from './SesionAgente'

/**
 * Simulación de pasarela previa al pago con la aseguradora.
 * El CTA vuelve al inicio: no procesa dinero real.
 */
export function Reservado({ datos }: { datos: Partial<DatosCierre> }) {
  const primerNombre = datos.nombre?.trim().split(/\s+/)[0]
  const poliza = datos.poliza?.trim() || null

  return (
    <div className="relative mx-auto flex min-h-[58vh] max-w-lg flex-col justify-center px-1 py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-8 h-40 rounded-full bg-[radial-gradient(circle_at_center,rgb(31_122_77/0.12),transparent_70%)]"
      />

      <p className="relative text-center text-xs font-bold tracking-[0.2em] text-[var(--exito)] uppercase">
        Paso final · Aseguradora
      </p>

      <article className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-[var(--borde)] bg-white shadow-[0_24px_60px_-36px_rgb(26_26_25/0.55)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--borde)] bg-[#f4faf6] px-6 py-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--exito)]">
            <ShieldCheck aria-hidden="true" size={20} weight="fill" />
            Checkout seguro
          </span>
          <span className="text-xs font-medium text-[var(--grafito-60)]">Simulación</span>
        </div>

        <div className="px-6 pt-7 pb-6 text-center sm:px-8">
          <span
            aria-hidden="true"
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--amarillo)] text-[var(--tinta)]"
          >
            <Lock size={28} weight="duotone" />
          </span>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.35rem)] font-extrabold text-[var(--tinta)]">
            {primerNombre ? `${primerNombre}, ` : ''}listo para pagar
          </h2>

          <p className="mx-auto mt-3 max-w-[34ch] text-[var(--grafito)]">
            Vas a continuar en el portal de la aseguradora para finalizar la contratación de tu
            póliza.
          </p>

          <dl className="mt-7 space-y-3 rounded-2xl bg-[#f8fafb] px-4 py-4 text-left text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[var(--grafito-60)]">Seguro</dt>
              <dd className="max-w-[18ch] text-right font-semibold text-[var(--tinta)]">
                {poliza ?? 'Por confirmar'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--borde)] pt-3">
              <dt className="text-[var(--grafito-60)]">Estado</dt>
              <dd className="font-semibold text-[var(--exito)]">Pendiente de pago</dd>
            </div>
          </dl>

          <Link
            href="/"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--exito)] px-7 py-4 text-base font-bold text-white shadow-[0_14px_28px_-14px_rgb(31_122_77/0.85)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-[#17633e] hover:shadow-[0_18px_32px_-14px_rgb(23_99_62/0.9)] active:scale-[0.98] motion-reduce:active:scale-100"
          >
            Proceder al pago
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-4 text-xs text-[var(--grafito-60)]">
            Demo: no se cobra ni se emite póliza. El botón vuelve al inicio.
          </p>
        </div>
      </article>
    </div>
  )
}
