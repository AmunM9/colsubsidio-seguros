# 00 · Entorno

## Instalado

| Herramienta | Versión | Estado |
|---|---|---|
| Node | v24.13.1 | ok |
| npm | 11.8.0 | ok |
| Next.js | 15 (App Router, Turbopack) | ok |
| TypeScript + Tailwind v4 | — | ok |
| `agent-browser` (Vercel Labs) | global | instalado |
| `gsap` + `@gsap/react` | latest | ok |
| `@elevenlabs/react` + `@elevenlabs/client` | v1 | ok (apagado por flag) |
| `svgo` | devDependency | ok |

## No instalado, y por qué

- **ponytail** — se instala con los slash commands `/plugin marketplace add DietrichGebert/ponytail`
  y `/plugin install ponytail@ponytail`. Son comandos de panel interactivo del CLI: esta sesión no
  puede ejecutarlos. **Acción para ti:** córrelos tú en una terminal `claude` y luego `/ponytail full`.
  Mientras tanto apliqué sus principios a mano (mínimo funcional, sin capas de más).
- **ECC (ecc.tools)** — mismo problema (`/plugin marketplace add ecc@ecc`). No corrí `npm i -g` a ciegas
  porque §2 exige verificar el nombre exacto del paquete en el repo oficial y la documentación de
  terceros se contradice. Queda pendiente para ti.
- **ui-skills** — `npx ui-skills add ...` escribe skills en `~/.claude`; no aporta a la demo en el tiempo
  disponible. Los cuatro criterios (baseline UI, accesibilidad, motion performance, metadata) están
  aplicados a mano y verificados en §11.

## Scraping

Se usó el navegador integrado (CDP, mismo mecanismo que agent-browser) + `curl` sobre el HTML SSR de
Next.js de subsidio.com, que **sí** trae el contenido renderizado en el HTML inicial. Fue más rápido
y más barato que manejar el navegador para cada página. El hallazgo (ver `01-diagnostico`) hizo
innecesario profundizar más: no hay contenido de producto que extraer.
