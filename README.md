# Seguros, sin vueltas

**Demo en vivo:** [https://seguros-subsidio.vercel.app](https://seguros-subsidio.vercel.app)

Demo de experiencia para Subsidio: reemplaza la compra de seguros (hoy dispersa en subpáginas
sin información de producto) por **una sola conversación con un asesor de IA**.

**No vende, no cobra, no emite pólizas.** Perfila a la persona, le muestra las pólizas, confirma
sus datos y **reserva** la llamada de un asesor humano.

```bash
npm install
npm run dev
```

- `/` — landing, un solo botón
- `/cotizar` — el flujo
- `/admin` — panel de leads en vivo (**sin autenticación: es una demo**)

## El flujo

```
1. ¿Qué quieres proteger?     4 tarjetas (familia · vehículo · hogar · mascota)
2. ¿Eres afiliado?            "Sí" trae la cédula en la misma pantalla → precarga datos
                              "No" sigue de largo
3. ¿Voz o chat?               ambos son el MISMO agente de ElevenLabs
4. Conversación               el agente muestra pólizas, resuelve dudas, confirma datos,
                              pide canal (WhatsApp/llamada) y franja horaria
5. Reservado                  "En breve se comunicará un asesor contigo"
```

Solo tres pantallas antes del agente. Todo lo demás lo hace la conversación, no un formulario.

## Afiliados de prueba

`lib/catalog/afiliados.ts` — base local que simula el sistema de Subsidio. Escribe una de
estas cédulas en el paso 2 y los datos se precargan y viajan al agente:

| Cédula | Nombre | Celular | Correo | Ciudad |
|---|---|---|---|---|
| `1020304050` | Manuel Torres | 300 412 8890 | manuel.torres@example.com | Bogotá |
| `52987412` | Laura Giraldo | 311 725 4103 | laura.giraldo@example.com | Bogotá |
| `79654321` | Andrés Peña | 320 118 6742 | andres.pena@example.com | Soacha |

Cualquier otra cédula muestra "no encontramos ese documento" y deja seguir como no afiliado.

## El agente de ElevenLabs

Copia `.env.example` a `.env.local` y pon ahí el ID del agente (no lo commitees).
Con el agente en modo público no hace falta API key en el cliente.

```bash
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
NEXT_PUBLIC_VOICE_ENABLED=true
ELEVENLABS_AGENT_ID=
```

**Falta que hagas dos cosas en el dashboard:**

1. **Pegar el system prompt** de [`content/agente/system-prompt.md`](content/agente/system-prompt.md).
2. **Registrar los tres client tools** con exactamente estos nombres:

| Tool | Parámetros | Qué hace en la app |
|---|---|---|
| `capturar_contacto` | `campo`, `valor` | Escribe el dato en el lead, en vivo |
| `confirmar_reserva` | `canal`, `franja` | Cierra el flujo y muestra "Reservado" |
| `pedir_humano` | — | Marca el lead y cierra |

**Sin `confirmar_reserva` registrada, la pantalla de "Reservado" nunca aparece** — es la única
forma que tiene el agente de decirle a la app que terminó.

### Variables dinámicas que recibe

`categoria`, `categoria_legible`, `producto_interes` (alias del anterior), `es_afiliado`,
`nombre`, `celular`, `email`, `ciudad`. Las vacías significan "no lo sabemos": el prompt le
indica al agente que las pregunte en vez de imprimirlas.

### Voz y chat

Es el mismo agente. La diferencia está en `lib/voice/elevenlabs.ts`:

- **voz** → `connectionType: 'webrtc'`, `textOnly: false`, orbe animado con la amplitud del SDK
- **chat** → `connectionType: 'websocket'`, `textOnly: true`

El micrófono **solo** se pide cuando la persona toca "Empezar a hablar".


## Dónde tocar cada cosa

| Quiero… | Edito **solo** este archivo |
|---|---|
| Agregar, quitar o reordenar una pantalla | [`lib/flow/flow.config.ts`](lib/flow/flow.config.ts) |
| Agregar o cambiar un afiliado de prueba | [`lib/catalog/afiliados.ts`](lib/catalog/afiliados.ts) |
| Agregar o cambiar un producto | [`lib/catalog/products.ts`](lib/catalog/products.ts) |
| Colores, tipografía, espaciado | [`app/globals.css`](app/globals.css) |
| Duraciones y easings | [`lib/motion/gsap.ts`](lib/motion/gsap.ts) |
| Config del agente | [`lib/voice/elevenlabs.ts`](lib/voice/elevenlabs.ts) |

## Reglas del contenido

**Ninguna cifra, cobertura ni nombre de producto está inventado.** Todo sale de
[`content/research/catalogo-subsidio.json`](content/research/catalogo-subsidio.json),
scrapeado de subsidio.com y chubb.com.

Subsidio **no publica** coberturas, exclusiones ni precios —
ver [`content/research/01-diagnostico-subsidio.md`](content/research/01-diagnostico-subsidio.md).
Por eso el system prompt le prohíbe al agente inventarlos.

## Conectar una base de datos

Los leads viven en memoria, con volcado a `data/leads.json`.

> ⚠️ **En serverless con varias instancias esto no sirve**: cada instancia tendría su propio `Map`
> y el SSE solo vería los leads de la suya.

Migrar = reimplementar una clase contra la interfaz `LeadStore` de
[`lib/leads/types.ts`](lib/leads/types.ts) y cambiar la última línea de
[`lib/leads/store.ts`](lib/leads/store.ts). Ningún otro archivo cambia.

## Nota sobre `reactStrictMode: false`

Está apagado a propósito en `next.config.ts`. StrictMode desmonta y remonta cada componente en
desarrollo; el `ConversationProvider` de ElevenLabs cierra la sesión al desmontar, así que la
conversación se caía apenas conectaba. Es un problema **solo de dev** — en producción StrictMode
no hace doble montaje.

## Verificaciones

```bash
npm run build
npx eslint app components lib
```
