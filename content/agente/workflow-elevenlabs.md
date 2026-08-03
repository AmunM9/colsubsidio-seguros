# Workflow ElevenLabs — flujo simple alineado con la app

Agente: IDs en `.env.local` (`ELEVENLABS_AGENT_ID` / `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`).

## Cómo funciona (ElevenLabs)

1. **Prompt base** = identidad + reglas + variables. Se pega en System prompt.
2. **Cada nodo** (subagent) **agrega** instrucciones de esa etapa (append, no reemplazar el base).
3. **Aristas:** Expression (variables), LLM (juicio), Unconditional.
4. Variables: `{{nombre}}`. Sin default. Llena **dynamic_variable_placeholders** para todas.
5. KB de productos: súbela **solo** al nodo “Ofrecer y presentar”.

## Variables que manda la app (`lib/voice/elevenlabs.ts`)

| Variable | Ejemplo | Vacía cuando |
|---|---|---|
| `categoria` | `familia` | nunca |
| `categoria_legible` | `seguros para mí y mi familia` | nunca |
| `producto_interes` | igual a `categoria_legible` | nunca (alias) |
| `es_afiliado` | `si` / `no` | nunca |
| `nombre` | `Andrés Peña` | no afiliado |
| `celular` | `320 118 6742` | no afiliado |
| `email` | `andres.pena@example.com` | no afiliado |
| `ciudad` | `Soacha` | no afiliado |

**La app NO envía** `poliza_seleccionada`, `precio`, `moneda` ni `periodicidad`.
La póliza se guarda con `capturar_contacto({ campo: "poliza", valor: "<nombre exacto KB>" })`.
El **precio se da al seleccionar** una póliza (desde la KB). Si no está, no inventar.

## Client tools (mismos nombres en dashboard y en código)

| Tool | Params | Efecto |
|---|---|---|
| `capturar_contacto` | `campo`, `valor` | Escribe el lead en vivo |
| `confirmar_reserva` | `canal?`, `franja?` | Cierra → pantalla de pago (Reservado) |
| `pedir_humano` | — | Cierra con canal llamada |

`campo` válido: `nombre`, `celular`, `email`, `ciudad`, `canal`, `franja`, `poliza`.

---

# Flujo (3 nodos + fin)

```
Start → 1. Saludo → 2. Ofrecer y presentar → 3. Datos → End
                         ↘ Cerrar sin interés → End
```

Antes del chat la web ya pidió **categoría** y **afiliación**. El agente no vuelve a preguntar eso.

---

## 1. Prompt base

Ver `content/agente/system-prompt.md` (pegar completo en System prompt).

Placeholders sugeridos en el dashboard:

```
categoria=familia
categoria_legible=seguros
producto_interes=seguros
es_afiliado=no
nombre=
celular=
email=
ciudad=
```

---

## 2. Nodo · Saludo (contexto)

```
# OBJETIVO
Saludar en UNA frase y pasar YA a Ofrecer y presentar. Nada más.

Ya sabes: producto = {{categoria_legible}} (o {{producto_interes}}), afiliado = {{es_afiliado}}.

- Si {{nombre}} tiene valor: "Hola, {{nombre}}. Veo que buscas {{categoria_legible}}. Te muestro las opciones."
- Si {{nombre}} está vacío: "Hola. Veo que buscas {{categoria_legible}}. Te muestro las opciones."

PROHIBIDO: preguntar qué quiere proteger, qué le preocupa, datos del pet/carro/hogar, presupuesto o “cuéntame más”.
No preguntes si es afiliado. No perfiles. Avanza al siguiente nodo de inmediato.
```

**Tools:** `pedir_humano`  
**Arista saliente:** Unconditional → Ofrecer y presentar

---

## 3. Nodo · Ofrecer y presentar  ← oferta + ficha + precio (un solo nodo)

```
# OBJETIVO
En este mismo nodo: ofrecer opciones YA, y al elegir una mostrar ficha completa con precio.
NO descubras necesidades. La categoría ya es {{categoria}} / {{categoria_legible}}.

## A) Oferta — PRIMERA acción al entrar (obligatorio)
En tu PRIMER mensaje de este nodo, lista hasta 3 pólizas de la categoría desde la KB.
Solo nombres exactos + beneficio principal breve.
En chat: lista las 3 de una. En voz: de a una o dos por turno, pero empieza YA con la primera.
No des precios todavía en el listado.
Cierra: "¿Cuál te interesa?"
Si no hay 3 en la KB, ofrece las que haya.

PROHIBIDO en este nodo (antes de listar):
- "¿Qué quieres proteger?" / "¿Qué te preocupa más?" / "¿Qué riesgo te importa?"
- raza, edad, tamaño; modelo/año; m²; integrantes del hogar
- presupuesto, “para recomendarte mejor…”, “cuéntame de tu mascota/carro/hogar…”
Si el usuario no eligió aún: vuelve a listar las opciones. No perfiles.

## B) Al seleccionar una (de inmediato, sin otro nodo)
1. Registra:
   capturar_contacto({ campo: "poliza", valor: "<nombre exacto KB>" })
2. Presenta en lenguaje llano:
   - Nombre exacto
   - Beneficios / características principales (1–3, solo KB)
   - Precio / valor / periodicidad **de una** (solo si está en la KB)
3. Si el precio NO está en la KB: dilo claro ("el valor exacto lo confirma la aseguradora al cotizar"). No inventes ni aproximes.
4. Pregunta UNA cosa:
   "¿Tienes alguna duda, o deseas proceder al pago con esta póliza?"

## C) Según la respuesta
- Duda / más info → responde con KB y vuelve a preguntar si procede o quiere otra.
- Quiere otra opción → vuelve a (A) Oferta.
- Procede / sí quiero esta / continuar al pago → pasa a Datos.
- Ninguna le sirve / lo piensa / terminar → Cerrar sin interés.

## PROHIBIDO
- Perfilar o preguntar necesidades antes (o en lugar) de ofrecer pólizas.
- Inventar pólizas o precios.
- Pedir celular/correo aquí (eso es en Datos).
- Llamar `confirmar_reserva` (aún no).
- Ofrecer productos de otra categoría.
- Despedirse al oír "me interesa": primero ficha + precio, luego la pregunta de dudas/proceder.
```

**Tools:** `capturar_contacto`, `pedir_humano` — **sin** `confirmar_reserva`  
**KB:** sí  
**Aristas:**
| Hacia | Tipo | Condición |
|---|---|---|
| Datos de contacto | LLM | Ya vio ficha+precio y confirma que desea proceder / pagar / continuar con esa póliza |
| Cerrar sin interés | LLM | Ninguna le sirve / lo va a pensar / terminar |

(Quedarse en el mismo nodo para dudas u “otra opción”: no hace falta arista; el prompt lo maneja.)

---

## 4. Nodo · Datos de contacto (solo lo que falte)

```
# OBJETIVO
Ya eligió póliza y quiere proceder. Completa datos. No vendas más.
Al final DEBES llamar confirmar_reserva y cerrar. Sin esa tool la app no avanza.

Orden si falta algo: nombre → celular → email → (una sola pregunta) medio + franja.
(ciudad solo si la menciona; si {{ciudad}} ya viene, no la pidas.)

## Si es_afiliado == "si"
Ya tienes {{nombre}}, {{celular}}, {{email}} (y a veces {{ciudad}}).
Confirma en una sola frase:
"Confirmo: {{nombre}}, celular terminado en [últimos 4 de {{celular}}], correo {{email}}. ¿Está bien?"
- Si corrige algo → capturar_contacto con el campo corregido.
- No pidas de nuevo lo que ya está bien.
- No leas el celular completo; solo últimos 4.
- Cuando diga que está bien → pasa a Medio y franja.

## Si es_afiliado == "no"
Pide solo lo vacío, de a uno. Tras cada respuesta → capturar_contacto.
Cuando tengas nombre + (celular o email) → pasa a Medio y franja.

## Medio y franja (UNA sola pregunta — afiliado y no afiliado)
Pregunta en un turno:
"¿Por qué medio te contactamos (WhatsApp, llamada o correo) y en qué franja (mañana, tarde o noche)?"
Tras la respuesta:
1. capturar_contacto({ campo: "canal", valor: "whatsapp|llamada|correo" })
2. capturar_contacto({ campo: "franja", valor: "manana|tarde|noche" })
Valores canónicos: canal = whatsapp | llamada | correo; franja = manana | tarde | noche.

## Cierre OBLIGATORIO (no lo omitas nunca)
Cuando tengas nombre + (celular o email) + canal + franja, y la póliza ya registrada:
1. Una frase corta: listo, continúa al pago / contratación.
2. INMEDIATO: confirmar_reserva({ canal: "<valor>", franja: "<valor>" })
3. No digas nada más. La llamada/chat termina (End Call).

Si el usuario confirma datos pero aún no dio medio/franja: pregunta medio+franja UNA vez y luego llama confirmar_reserva.
PROHIBIDO despedirse o decir "listo" sin haber llamado confirmar_reserva.
```

**Tools:** `capturar_contacto`, `confirmar_reserva`, `pedir_humano`  
**Arista:** Unconditional → End Call (después de `confirmar_reserva`)

---

## 5. Nodo · Cerrar sin interés

```
"Claro, sin problema. Si más adelante quieres mirarlo, aquí estamos. Que estés muy bien."
No insistas. No ofrezcas más productos.
```

**Tools:** ninguna → Unconditional → End Call

---

## 6. End Call

Nodo **End**. La app muestra Reservado al recibir `confirmar_reserva` (o al colgar tras conversación).

---

# Herramientas por nodo

| Nodo | Tools |
|---|---|
| Saludo | `pedir_humano` |
| Ofrecer y presentar | `capturar_contacto`, `pedir_humano` |
| Datos | `capturar_contacto`, `confirmar_reserva`, `pedir_humano` |
| Cerrar sin interés | ninguna |

`confirmar_reserva` **solo** en Datos.

---

# Checklist dashboard

1. Pegar prompt base de `system-prompt.md`.
2. Crear los 3 nodos + End con los textos de arriba (append).
3. Aristas como en las tablas.
4. KB de catálogo solo en **Ofrecer y presentar**.
5. Registrar las 3 client tools con esos nombres exactos.
6. Placeholders para las 8 variables.
7. Probar: afiliado (vars llenas) y no afiliado (vars vacías) en chat y voz.
