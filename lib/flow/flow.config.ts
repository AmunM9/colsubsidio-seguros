import type { Paso } from './types'

/**
 * ⭐ EL ÁRBOL COMPLETO. Agregar una pregunta = agregar un objeto a este arreglo.
 * No hay que tocar el motor ni ningún componente.
 *
 * Son solo cuatro pantallas antes del agente: qué proteger → afiliación → voz o chat → agente.
 * Todo lo demás (mostrar pólizas, resolver dudas, confirmar datos) lo hace el agente de
 * ElevenLabs con su base de conocimiento, no un formulario.
 */
export const PASOS: Paso[] = [
  {
    id: 'categoria',
    tipo: 'choice',
    titulo: '¿Qué quieres proteger?',
    subtitulo: 'Elige una. Puedes cambiarla después.',
    opciones: [
      { valor: 'familia', etiqueta: 'A mí y a mi familia', nota: 'Vida, exequial, salud', icono: 'familia' },
      { valor: 'vehiculo', etiqueta: 'Mi carro o moto', nota: 'SOAT, robo, terceros', icono: 'vehiculo' },
      { valor: 'hogar', etiqueta: 'Mi hogar', nota: 'Vivienda y contenidos', icono: 'hogar' },
      { valor: 'mascota', etiqueta: 'Mi mascota', nota: 'Veterinaria y emergencias', icono: 'mascota' },
    ],
  },
  {
    id: 'afiliacion',
    tipo: 'afiliacion',
    titulo: '¿Eres afiliado a Subsidio?',
    subtitulo: 'Si lo eres, traemos tus datos y no tienes que repetirlos.',
  },
  {
    id: 'modo',
    tipo: 'choice',
    titulo: '¿Cómo prefieres seguir?',
    subtitulo: 'De aquí en adelante te atiende nuestro asesor virtual.',
    opciones: [
      { valor: 'voz', etiqueta: 'Hablando', nota: 'Le cuentas y te responde en voz' },
      { valor: 'chat', etiqueta: 'Escribiendo', nota: 'Chat de texto, sin micrófono' },
    ],
  },
  { id: 'sesion', tipo: 'sesion', titulo: 'Tu asesor' },
  { id: 'reservado', tipo: 'reservado', titulo: 'Reservado' },
]

export const PRIMER_PASO = PASOS[0].id
export const paso = (id: string) => PASOS.find((p) => p.id === id)
