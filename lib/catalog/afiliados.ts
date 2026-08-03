/**
 * Base de datos local de afiliados (MOCK).
 *
 * Simula la consulta al sistema de Subsidio: con la cédula traemos nombre, celular y correo
 * para no volver a pedírselos a la persona ni al agente de voz.
 *
 * Cuando exista el endpoint real, se reemplaza el cuerpo de `buscarAfiliado`.
 * Ningún otro archivo cambia.
 */

export type Afiliado = {
  documento: string
  nombre: string
  celular: string
  email: string
  ciudad: string
  categoria: 'A' | 'B' | 'C'
}

export const AFILIADOS: Afiliado[] = [
  {
    documento: '1020304050',
    nombre: 'Manuel Torres',
    celular: '300 412 8890',
    email: 'manuel.torres@example.com',
    ciudad: 'Bogotá',
    categoria: 'B',
  },
  {
    documento: '52987412',
    nombre: 'Laura Giraldo',
    celular: '311 725 4103',
    email: 'laura.giraldo@example.com',
    ciudad: 'Bogotá',
    categoria: 'A',
  },
  {
    documento: '79654321',
    nombre: 'Andrés Peña',
    celular: '320 118 6742',
    email: 'andres.pena@example.com',
    ciudad: 'Soacha',
    categoria: 'C',
  },
]

const soloDigitos = (v: string) => v.replace(/\D/g, '')

export const buscarAfiliado = (documento: string): Afiliado | null =>
  AFILIADOS.find((a) => a.documento === soloDigitos(documento)) ?? null
