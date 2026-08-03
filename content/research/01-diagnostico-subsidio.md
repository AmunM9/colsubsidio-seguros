# 01 · Diagnóstico de subsidio.com/seguros

Fecha del scrape: 2026-07-26. Método: HTML SSR de Next.js (`curl`) + navegador CDP para verificar
el render en cliente. Verificado en 8 URLs.

## El hallazgo

**Las páginas de producto de Subsidio no describen el producto.**

No es una exageración retórica. Extraje el texto completo de `/seguros/familiares/vida`,
`/seguros/vehiculos/soat`, `/seguros/hogar`, `/seguros/mascotas`, `/seguros/vehiculos` y
`/seguros/familiares/asistencias-multiples`. Cada una contiene, en este orden:

1. Migas de pan (`Inicio / Seguros y asistencias Subsidio / …`)
2. Un `<h1>` con el nombre del producto
3. Un párrafo de una frase, a veces
4. Un carrusel de **otros** productos ("Conoce más")
5. El footer corporativo

Y nada más. Concretamente, **cero** apariciones de:

- coberturas o amparos
- exclusiones
- requisitos de asegurabilidad
- precio, tarifa o "desde $"
- un botón de cotizar, comprar o "quiero este seguro"

La página de `/seguros/mascotas` es literalmente un título más tres tarjetas que apuntan a vehículos,
hogar y familia. La página de SOAT no menciona un solo dato del SOAT: te ofrece vida y ahorro.

## `clics_hasta_cotizar`

La métrica que iba a medir **no existe en el sitio público**: no hay ninguna ruta desde la home hasta
una cotización de seguros. El único punto transaccional que aparece es
`platform-prod-external.subsidio.com/seguros-admin/personal/vida-exequial`, un subdominio distinto,
sin enlace visible desde el hub. Para el resto, el camino real es *salir del sitio*: llamar al
+57 601 745 79 00 o ir a una sede.

Por eso en `catalogo-subsidio.json` el campo va como `"clics_hasta_cotizar": null` con
`"cotizacion_en_linea": false`. Poner un número inventado sería justo lo que la regla 3 prohíbe.

## Ruido de navegación

Medido en `/seguros/familiares/vida`:

- **~52 bloques de texto** en toda la página. **3** hablan de seguros; el resto es chrome corporativo.
- **6 niveles de navegación** compitiendo a la vez: barra Personas/Empresas, menú principal,
  "Subsidio Virtual" (12 accesos rápidos: citas médicas, cibercolegios, Piscilago…), migas,
  carrusel de cross-sell, footer de 40+ enlaces.
- **0 CTAs primarios** de seguros. El único botón consistente en toda la página es "Conoce más",
  que lleva a otra página igual de vacía.
- El usuario que llega buscando "¿cuánto me cuesta asegurar a mi perro?" no encuentra respuesta,
  ni precio, ni formulario, ni a quién preguntarle. Encuentra un enlace a comprar Piscilago.

## Quién asegura de verdad

Subsidio es la caja de compensación; **el riesgo lo toma un tercero**. Verificado en
`chubb.com/co-es/personas-y-familias/subsidio.html`: **Chubb Seguros Colombia S.A.** publica ahí los
clausulados del convenio con Subsidio, y sí lista productos con nombre propio y clausulado
depositado ante la **Superintendencia Financiera de Colombia**:

- Producto Oncológico
- Producto de Accidentes Personales (anual y mensual) y "AP Digital"
- Producto Protección Urbana
- Exequial ("seguros que cubren los gastos funerarios, e inclusive los trámites de inhumación o cremación")
- Vida Grupo, Hogar, Viajes, Protección de Artículos Especiales

MetLife aparece también como aliada en el material de Subsidio (`metlife.com.co/seguros-masivos/subsidio/`),
pero no logré confirmar el mapeo producto↔aseguradora por producto. Va como `aseguradora: null`
donde no está confirmado — no lo adivino.

**Implicación para el diseño:** el copy no puede prometer "compra tu seguro aquí". La promesa honesta
es *"te lo explicamos, te perfilamos y te contacta la aseguradora"*, que es exactamente el objetivo de
negocio del §0. El diagnóstico no contradice el alcance: lo justifica.

## Lo que esto significa para la demo

No estamos rediseñando un embudo lento. Estamos **construyendo el embudo que no existe**. La barra
está en el suelo: cualquier flujo que le diga a un usuario qué cubre un producto, cuánto puede costar
y quién lo va a llamar, ya es infinitamente mejor que el estado actual.

El corolario incómodo: como Subsidio no publica coberturas ni precios, la demo **no puede
inventarlos**. La tarjeta de explicación (P5) muestra lo que sí está publicado y dice con todas sus
letras "cotización personalizada — te la arma un asesor" donde no hay dato. Esa honestidad es parte
del producto, no una limitación de la demo.
