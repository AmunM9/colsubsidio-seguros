import { promises as fs } from 'node:fs'
import path from 'node:path'
import {
  DEMO_PERFIL_LEADS,
  completarHuecosDemo,
  listoParaPanel,
  sesionCompleta,
} from './demo-perfil'
import type { Lead, LeadPatch, LeadStore } from './types'

/**
 * Store en memoria + volcado a data/leads.json para sobrevivir un reinicio en dev.
 *
 * ⚠️ NO SIRVE EN SERVERLESS CON VARIAS INSTANCIAS: cada instancia tendría su propio Map
 * y el SSE solo vería los leads de la suya. Migrar a Postgres/Supabase = reimplementar
 * esta clase contra la interfaz `LeadStore`. Ningún otro archivo cambia. Ver README.
 */

/** En Vercel el FS de `/var/task` es de solo lectura: usamos /tmp o solo memoria. */
const EN_SERVERLESS = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME != null
const ARCHIVO = EN_SERVERLESS
  ? path.join('/tmp', 'subsidio-leads.json')
  : path.join(process.cwd(), 'data', 'leads.json')

const vacio = (id: string): Lead => ({
  id,
  creado: new Date().toISOString(),
  actualizado: new Date().toISOString(),
  categoria: null,
  afiliado: null,
  documento: null,
  respuestas: {},
  productoRecomendado: null,
  precioMostrado: null,
  duda: null,
  nombre: null,
  celular: null,
  email: null,
  canalPreferido: null,
  franjaHoraria: null,
  ciudad: null,
  consentimiento: false,
  completitud: 0,
  origen: 'chat',
  estado: 'nuevo',
})

class MemoryLeadStore implements LeadStore {
  private leads = new Map<string, Lead>()
  private subs = new Set<(l: Lead) => void>()
  private cargado = false

  /** DEMO: saca del Map (y del disco) todo lo que no debe verse en el panel. */
  private purgarIncompletos() {
    if (!DEMO_PERFIL_LEADS) return false
    let hubo = false
    for (const [id, l] of this.leads) {
      if (sesionCompleta(l)) {
        const lleno = completarHuecosDemo(l)
        if (!listoParaPanel(lleno)) {
          this.leads.delete(id)
          hubo = true
          continue
        }
        this.leads.set(id, lleno)
        continue
      }
      // Incompletos: se quedan en memoria solo mientras la sesión está viva
      // (mismo id sigue haciendo upsert). No van al panel ni al JSON.
    }
    return hubo
  }

  private async cargar() {
    if (this.cargado) return
    this.cargado = true
    try {
      const crudo = await fs.readFile(ARCHIVO, 'utf8')
      const todos = JSON.parse(crudo) as Lead[]
      for (const l of todos) {
        if (!DEMO_PERFIL_LEADS) {
          this.leads.set(l.id, l)
          continue
        }
        if (!sesionCompleta(l)) continue
        const lead = completarHuecosDemo(l)
        if (listoParaPanel(lead)) this.leads.set(lead.id, lead)
      }
      // Reescribe el JSON sin vacíos, aunque el Map en memoria tuviera basura previa.
      void this.volcar()
    } catch {
      // Sin archivo previo: arrancamos vacíos. No es un error.
    }
  }

  private async volcar() {
    try {
      await fs.mkdir(path.dirname(ARCHIVO), { recursive: true })
      const aDisco = DEMO_PERFIL_LEADS
        ? [...this.leads.values()].filter(listoParaPanel)
        : [...this.leads.values()]
      await fs.writeFile(ARCHIVO, JSON.stringify(aDisco, null, 2))
    } catch (e) {
      console.error('[leads] no se pudo volcar a disco:', e)
    }
  }

  async upsert(patch: LeadPatch): Promise<Lead> {
    await this.cargar()
    const previo = this.leads.get(patch.id) ?? vacio(patch.id)
    let lead: Lead = {
      ...previo,
      ...patch,
      respuestas: { ...previo.respuestas, ...(patch.respuestas ?? {}) },
      actualizado: new Date().toISOString(),
    }

    if (DEMO_PERFIL_LEADS && sesionCompleta(lead)) {
      lead = completarHuecosDemo(lead)
    }

    this.leads.set(lead.id, lead)
    this.purgarIncompletos()

    if (!DEMO_PERFIL_LEADS || listoParaPanel(lead)) {
      for (const cb of this.subs) cb(lead)
    }

    void this.volcar()
    return lead
  }

  async listar(): Promise<Lead[]> {
    await this.cargar()
    this.purgarIncompletos()
    void this.volcar()
    const visibles = DEMO_PERFIL_LEADS
      ? [...this.leads.values()].filter(listoParaPanel)
      : [...this.leads.values()]
    return visibles.sort((a, b) => b.actualizado.localeCompare(a.actualizado))
  }

  suscribir(cb: (l: Lead) => void) {
    this.subs.add(cb)
    return () => this.subs.delete(cb)
  }
}

/** v3: invalida el singleton viejo de HMR que seguía mostrando leads vacíos. */
const g = globalThis as unknown as { __leadStore?: LeadStore; __leadStoreV?: string }
const STORE_VER = 'demo-perfil-v3'
if (g.__leadStoreV !== STORE_VER) {
  g.__leadStore = undefined
  g.__leadStoreV = STORE_VER
}
export const leadStore: LeadStore = (g.__leadStore ??= new MemoryLeadStore())
