import Link from 'next/link'

type Variante = 'primaria' | 'secundaria'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.98] motion-reduce:active:scale-100'

const estilos: Record<Variante, string> = {
  // Azul sobre blanco 5.87:1, blanco sobre azul 5.87:1. Ambos pasan AA.
  primaria:
    'bg-[var(--azul)] text-white shadow-[0_10px_24px_-12px_rgb(0_103_177/0.7)] hover:bg-[var(--tinta)] hover:shadow-[0_14px_30px_-12px_rgb(26_26_25/0.55)]',
  secundaria:
    'border border-[var(--borde-fuerte)] bg-transparent text-[var(--grafito)] hover:border-[var(--azul)] hover:text-[var(--azul)]',
}

export function BotonLink({
  href,
  variante = 'primaria',
  className = '',
  children,
}: {
  href: string
  variante?: Variante
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={`${base} ${estilos[variante]} ${className}`}>
      {children}
    </Link>
  )
}

export function Boton({
  variante = 'primaria',
  className = '',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button type={type} className={`${base} ${estilos[variante]} ${className}`} {...props} />
}
