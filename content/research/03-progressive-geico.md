# 03 · Progressive y GEICO — por qué convierten

> **Alcance:** research ligero por decisión tuya. Esto **no** es un scrape verificado; son patrones
> conocidos del mercado US, listados aquí porque gobiernan decisiones de diseño concretas. Marcados
> como hipótesis, no como hecho medido.

## GEICO — hipótesis

- El punto de entrada es **un solo campo**: código postal. Micro-compromiso mínimo, sin cuenta,
  sin email.
- Promesa **cuantificada y memorizable** ("15 minutos, 15%"). Un número se recuerda; "ahorra dinero" no.
- Teléfono visible siempre. La salida a humano no es una derrota, es un canal.
- Todo el diseño está subordinado a una métrica: reducir pasos hasta la cotización.

## Progressive — hipótesis

- *Name Your Price* **invierte el embudo**: primero el presupuesto, después la cobertura. El usuario
  llega con un número en la cabeza, no con una lista de amparos.
- Comparación de precios dentro del propio sitio (aunque la competencia gane a veces). Genera
  confianza a costa de conversión inmediata.
- Mascota consistente como ancla de reconocimiento.
- Cotización **guardada y recuperable** por número. El abandono no es pérdida total.

## Los 6 principios accionables

Estos son los que gobiernan el diseño de esta demo. Cada uno tiene una consecuencia concreta:

1. **Micro-compromiso primero, datos personales al final.**
   → P1 es un toque en una tarjeta. El celular no aparece hasta P6.
2. **Una sola acción primaria por pantalla, repetida.**
   → La landing tiene un único CTA (`Cotiza en 2 minutos`), repetido en hero y cierre. La secundaria
   (`Habla con un asesor`) es visualmente subordinada, no un segundo botón del mismo peso.
3. **Promesa cuantificada.**
   → "6 preguntas · 2 minutos · sin llamadas". Números, no adjetivos.
4. **Salida a humano siempre disponible.**
   → El teléfono real (+57 601 745 79 00) está en el footer y en el CTA secundario. Y `pedir_humano`
   es una de las tres client tools del agente de voz.
5. **El abandono es un lead, no un cero.**
   → El lead se persiste en la **primera** respuesta, con `completitud` en %. Quien llama ve a alguien
   que se fue en P4 con categoría "mascota" ya identificada.
6. **Ancla visual constante.**
   → La escena SVG del hero reaparece como los cuatro íconos de las tarjetas P1. Mismo lenguaje
   gráfico en landing y flujo.

## Uno que descartamos a propósito

**Comparar precios con la competencia** (Progressive). No aplica: Subsidio no publica precios y no
es la aseguradora. Prometer comparación sería mentir. Va a `ideas-descartadas.md`.
