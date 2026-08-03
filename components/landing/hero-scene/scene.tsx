/**
 * Escena original del hero. Cuatro mundos, un solo archivo, SVG inline (hay que animar
 * los nodos internos, así que no puede ser un <img>).
 *
 * Reglas que cumple (§4.4): viewBox fijo sin width/height, un <g id="mundo-*"> por mundo,
 * colores por variables CSS, sin <filter>, sin gradientes, sin raster, sin <style> interno.
 * Trazo uniforme de 7. Todo geométrico y plano.
 */

const T = 'var(--tinta)'
const AM = 'var(--amarillo)'
const AZ = 'var(--azul)'
const AZ40 = 'var(--azul-40)'
const AM40 = 'var(--amarillo-40)'

const trazo = { stroke: T, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export type MundoId = 'hogar' | 'familia' | 'mascota' | 'vehiculo'

export const MUNDOS: { id: MundoId; categoria: string; nombre: string }[] = [
  { id: 'familia', categoria: 'familia', nombre: 'A mí y a mi familia' },
  { id: 'vehiculo', categoria: 'vehiculo', nombre: 'Mi carro o moto' },
  { id: 'hogar', categoria: 'hogar', nombre: 'Mi hogar' },
  { id: 'mascota', categoria: 'mascota', nombre: 'Mi mascota' },
]

export function Scene() {
  return (
    <svg
      viewBox="0 0 960 640"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="escena-titulo"
      fill="none"
      className="w-full h-auto"
    >
      <title id="escena-titulo">
        Una casa, una familia, un perro y un carro, protegidos bajo un mismo círculo.
      </title>

      {/* Atmósfera: superficie amarilla, no texto. */}
      <g id="atmosfera" data-fondo>
        <circle cx="480" cy="286" r="228" fill={AM40} />
        <circle cx="480" cy="286" r="228" stroke={AM} strokeWidth="7" strokeDasharray="2 22" strokeLinecap="round" />
        <path d="M64 524H896" {...trazo} />
      </g>

      <g id="mundo-hogar" data-mundo="hogar">
        <path d="M118 524V336l96-72 96 72v188" fill="var(--superficie)" {...trazo} />
        <path d="M96 348 214 258l118 90" {...trazo} stroke={AZ} />
        <rect x="186" y="424" width="58" height="100" rx="6" fill={AM} {...trazo} />
        <rect x="146" y="366" width="50" height="44" rx="8" fill={AZ40} {...trazo} />
        <rect x="240" y="366" width="50" height="44" rx="8" fill={AZ40} {...trazo} />
        <path d="M272 296v-46h34v66" fill="var(--superficie)" {...trazo} />
      </g>

      <g id="mundo-familia" data-mundo="familia">
        <circle cx="404" cy="330" r="38" fill={AM} {...trazo} />
        <path d="M356 524v-92a48 48 0 0 1 96 0v92" fill={AZ} {...trazo} />
        <circle cx="494" cy="352" r="30" fill="var(--superficie)" {...trazo} />
        <path d="M458 524v-72a36 36 0 0 1 72 0v72" fill={AZ40} {...trazo} />
        <circle cx="562" cy="404" r="22" fill={AM} {...trazo} />
        <path d="M536 524v-50a26 26 0 0 1 52 0v50" fill="var(--superficie)" {...trazo} />
      </g>

      <g id="mundo-mascota" data-mundo="mascota">
        <path d="M624 524v-54a34 34 0 0 1 34-34h44a34 34 0 0 1 34 34v54" fill="var(--superficie)" {...trazo} />
        <circle cx="706" cy="418" r="34" fill={AM} {...trazo} />
        <path d="M680 396l-12-34 30 12M732 396l12-34-30 12" {...trazo} />
        <circle cx="706" cy="428" r="7" fill={T} />
        <path d="M740 470c26-6 34-28 26-48" {...trazo} stroke={AZ} />
      </g>

      <g id="mundo-vehiculo" data-mundo="vehiculo">
        <path d="M772 500v-52l30-56h84l34 56v52" fill={AZ} {...trazo} />
        <path d="M806 400h62l20 44h-82z" fill={AZ40} {...trazo} />
        <circle cx="812" cy="504" r="24" fill="var(--superficie)" {...trazo} />
        <circle cx="884" cy="504" r="24" fill="var(--superficie)" {...trazo} />
        <path d="M762 462h18M912 462h-18" {...trazo} stroke={AM} />
      </g>
    </svg>
  )
}
