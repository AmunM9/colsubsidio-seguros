# 02 · Lemonade — qué copiar y qué no

> **Alcance:** por decisión tuya (research ligero) esto **no** es un scrape. Se basa en las dos capturas
> que adjuntaste (`chat.lemonade.com` y `lemonade.com`) y en conocimiento verificado del producto.
> Todo lo que aquí se afirma como *observado* sale de esas capturas. Lo demás va marcado como *sabido*.

## Lo observado en `chat.lemonade.com`

La captura del flujo es, en pantalla completa, esto y nada más:

- Logo arriba a la izquierda. Un `···` arriba a la derecha. Cero navegación.
- Dos líneas de texto: `Hey there!` y la pregunta.
- Dos botones enormes, ancho completo, `Yes` / `No`. Borde de 1px, radio grande, sin relleno.
- **El resto de la pantalla está vacío.** Literalmente ~70% de aire.

Tres decisiones que valen más que todo el resto del análisis:

1. **Una pregunta por pantalla.** No hay historial acumulado, no hay burbujas de chat apiladas.
2. **No hay barra de progreso.** Porque el árbol es ramificado y un "3 de 7" mentiría.
3. **La primera pregunta no pide nada.** `¿Ya cotizaste con nosotros?` es un sí/no sin costo
   psicológico. El compromiso empieza en cero.

## Lo observado en `lemonade.com` (landing)

- Hero: ilustración lineal muy grande, monocroma, con el titular *encima* del dibujo, no al lado.
- Un solo CTA repetido (`Check our prices`) en cada sección. Nunca dos acciones primarias compitiendo.
- Los productos son cinco tarjetas con la **misma** estructura: ícono, nombre, una línea, un botón.
- La prueba social es cuantificada (`31% de otra aseguradora`, `19%`, …), no testimonios genéricos.
- Sección "How Lemonade Works" con dibujos, no con iconos de stock.

## Lo sabido (no verificado en este scrape)

- Maya, el bot, cierra una póliza en ~90 segundos y vende la gran mayoría de las pólizas.
- El flujo conversacional recoge señales de comportamiento (tiempo de respuesta, correcciones) que
  alimentan el pricing y el antifraude.

## La tesis que importa

**El chat no es una capa encima del formulario. El chat *es* el producto.** Lemonade no tomó un
formulario de 40 campos y le puso burbujas. Rediseñó el embudo para que la unidad mínima fuera una
decisión, no un campo. Por eso funciona y por eso los chatbots pegados a un formulario existente no.

## Los SVG del hero — el método, no los archivos

No se descargó ni se reutilizó ningún activo de Lemonade (regla 4). Lo que se adopta es el **método**,
que es observable a simple vista en la captura:

| Rasgo | Lemonade | Nuestra escena |
|---|---|---|
| Estilo | Trazo lineal uniforme, monocromo | Trazo uniforme, **a color** (tokens de la demo) |
| Composición | Escena única, no íconos sueltos | Escena única con 4 mundos |
| Relleno | Sin degradados realistas, sin sombras | Igual |
| Animación | Sutil, no roba atención del CTA | `DrawSVG` en entrada + idle de respiración |

**Diferencia deliberada:** el amarillo y el azul Subsidio son la identidad; una escena monocroma
sería copiar a Lemonade en vez de traducirlo. Nuestro SVG es original, a color, y hace algo que el de
Lemonade no hace: **cada mundo es clicable y entra al flujo con la categoría preseleccionada.**
