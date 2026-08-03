import type { Categoria, Respuestas } from '@/lib/flow/types'

/**
 * ⭐ EL CATÁLOGO. Tipado desde content/research/catalogo-subsidio.json.
 * Agregar un producto = agregar un objeto aquí. Nada más.
 *
 * REGLA 3 — No inventes datos. `coberturas: []` y `precio: null` son literales:
 * Subsidio no publica esa información. Ver content/research/01-diagnostico-subsidio.md.
 * No rellenes un campo sin una fuente citable en `fuente`.
 */

export type Producto = {
  id: string
  categoria: Categoria | 'credito'
  nombre: string
  /** Verbatim de Subsidio. No parafrasear. */
  promesa: string
  coberturas: string[]
  /** De dónde salieron las coberturas. Vacío si no hay ninguna. */
  fuente?: string
  exclusiones: string[]
  requisitos: string[]
  precioDesde: number | null
  aseguradora: string | null
  cotizacionEnLinea: boolean
  url: string
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'familia-vida',
    categoria: 'familia',
    nombre: 'Seguro de vida',
    promesa: 'Accede a coberturas en salud, vida, viajes, accidente y mucho más para ti y tu familia.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/familiares/vida',
  },
  {
    id: 'familia-vida-ahorro',
    categoria: 'familia',
    nombre: 'Seguro de vida y ahorro',
    promesa: 'Protege a tu familia ante fallecimiento accidental mientras incrementas tu capital automáticamente.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/familiares/vida-ahorro',
  },
  {
    id: 'familia-exequial',
    categoria: 'familia',
    nombre: 'Seguro exequial',
    promesa: 'Honra con dignidad a quienes parten. Este seguro cubre los gastos funerarios, y te respalda cuando más lo necesitas.',
    coberturas: ['Gastos funerarios', 'Trámites de inhumación o cremación'],
    fuente: 'Chubb Seguros Colombia S.A. — página del convenio Subsidio',
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: 'Chubb Seguros Colombia S.A.',
    cotizacionEnLinea: true,
    url: 'https://platform-prod-external.subsidio.com/seguros-admin/personal/vida-exequial',
  },
  {
    id: 'familia-accidentes',
    categoria: 'familia',
    nombre: 'Seguro de accidentes personales y servicio exequial',
    promesa: 'Garantiza seguridad para tu familia ante imprevistos como lesiones, auxilio funerario y otros gastos.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: 'Chubb Seguros Colombia S.A.',
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/personal/accidentes',
  },
  {
    id: 'familia-asistencias',
    categoria: 'familia',
    nombre: 'Asistencias médicas familiares',
    promesa: 'Garantiza la salud de tu familia: medicina especializada, médicos a domicilio en Bogotá y atención inmediata 24/7.',
    coberturas: [],
    exclusiones: [],
    requisitos: ['Médicos a domicilio disponibles únicamente en Bogotá'],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/familiares/asistencias-multiples',
  },
  {
    id: 'vehiculo-soat',
    categoria: 'vehiculo',
    nombre: 'SOAT — Seguro obligatorio de accidentes de tránsito',
    promesa: 'Tu seguridad vial es primero. Activa tu SOAT con Subsidio y aseguradoras aliadas. Recibe asistencia al instante, cubre accidentes personales, daños materiales y acompañamiento.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/vehiculos/soat',
  },
  {
    id: 'vehiculo-todo-riesgo',
    categoria: 'vehiculo',
    nombre: 'Seguros para tu vehículo',
    promesa: 'Circula por la ciudad con soluciones a tu medida. Cobertura contra robos, accidentes y daños a terceros para tu carro, moto, bici o patineta.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/vehiculos',
  },
  {
    id: 'hogar',
    categoria: 'hogar',
    nombre: 'Seguros para el hogar',
    promesa: 'Cuidamos tu vivienda, sus contenidos y hasta tu contrato de arrendamiento con nuestras soluciones financieras.',
    coberturas: [],
    exclusiones: [],
    requisitos: [],
    precioDesde: null,
    aseguradora: 'Chubb Seguros Colombia S.A.',
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/hogar',
  },
  {
    id: 'mascotas',
    categoria: 'mascota',
    nombre: 'Seguros y asistencias para mascotas',
    promesa: 'Accede a este seguro para perros o gatos que incluye asistencia médica veterinaria y protección ante daños.',
    coberturas: ['Asistencia médica veterinaria', 'Emergencias', 'Protección exequial'],
    fuente: 'Subsidio — texto propio de /seguros/mascotas',
    exclusiones: [],
    requisitos: ['Perros o gatos'],
    precioDesde: null,
    aseguradora: null,
    cotizacionEnLinea: false,
    url: 'https://www.subsidio.com/seguros/mascotas',
  },
]

export const VIGILANCIA = [
  'Superintendencia Financiera de Colombia',
  'Superintendencia del Subsidio Familiar',
]
export const TELEFONO = '+57 601 745 79 00'
export const POLITICA_DATOS = 'https://www.subsidio.com/tratamiento-de-datos-personales'

const porId = (id: string) => PRODUCTOS.find((p) => p.id === id)!

const normalizarTexto = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

/**
 * Convierte lo que diga el agente/usuario ("exequial", "el de vida y ahorro")
 * al nombre canónico del catálogo. Sin inventar: si no hay señal clara, null.
 */
export const canonizarProducto = (
  valor: string,
  categoria?: string,
): string | null => {
  const n = normalizarTexto(valor)
  if (!n) return null

  const candidatos = PRODUCTOS.filter((p) => !categoria || p.categoria === categoria)
  // Nombre completo más largo primero: "seguro de vida y ahorro" gana a "seguro de vida".
  // No usamos `nombre.includes(n)`: "exequial" matchearía el de accidentes por "servicio exequial".
  const porNombre = [...candidatos]
    .sort((a, b) => b.nombre.length - a.nombre.length)
    .find((p) => {
      const nombre = normalizarTexto(p.nombre)
      return n === nombre || n.includes(nombre)
    })
  if (porNombre) return porNombre.nombre

  // Alias cortos (voz/chat informal).
  const alias: { re: RegExp; id: string; cats?: string[] }[] = [
    { re: /\bexequial\b|\bfunerari/, id: 'familia-exequial', cats: ['familia'] },
    { re: /\bvida\s*y\s*ahorro\b|\bahorro\b/, id: 'familia-vida-ahorro', cats: ['familia'] },
    { re: /\basistencias?\b|\bmedicas?\b/, id: 'familia-asistencias', cats: ['familia'] },
    { re: /\baccidentes?\b/, id: 'familia-accidentes', cats: ['familia'] },
    { re: /\bvida\b/, id: 'familia-vida', cats: ['familia'] },
    { re: /\bsoat\b/, id: 'vehiculo-soat', cats: ['vehiculo'] },
    { re: /\btodo\s*riesgo\b|\bvehiculo\b|\bcarro\b|\bmoto\b/, id: 'vehiculo-todo-riesgo', cats: ['vehiculo'] },
    { re: /\bhogar\b|\bvivienda\b/, id: 'hogar', cats: ['hogar'] },
    { re: /\bmascota/, id: 'mascotas', cats: ['mascota'] },
  ]
  for (const a of alias) {
    if (a.cats && categoria && !a.cats.includes(categoria)) continue
    if (a.re.test(n)) return porId(a.id).nombre
  }
  return null
}

/**
 * Reglas de recomendación. Explícitas y auditables: sin scoring opaco.
 * En familia sin señal concreta no inventamos "Seguro de vida".
 */
export const recomendar = (r: Respuestas): Producto | null => {
  if (r.categoria === 'mascota') return porId('mascotas')
  if (r.categoria === 'hogar') return porId('hogar')
  if (r.categoria === 'vehiculo') {
    return porId(r.vehiculo_soat === 'vencido' ? 'vehiculo-soat' : 'vehiculo-todo-riesgo')
  }
  if (r.categoria !== 'familia') return null
  if (r.familia_objetivo === 'exequial') return porId('familia-exequial')
  if (r.familia_objetivo === 'ahorro') return porId('familia-vida-ahorro')
  if (r.familia_objetivo === 'salud') return porId('familia-asistencias')
  if (r.familia_dependientes === 'no') return porId('familia-accidentes')
  if (r.familia_objetivo === 'vida') return porId('familia-vida')
  return null
}
