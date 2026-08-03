# 05 · Contraste WCAG 2.2

Tokens de color de la demo y ratios calculados con la fórmula de luminancia relativa de WCAG 2.x.

Hex usados: `#FFD000`, `#0067B1`, `#575756`.

| Texto | Fondo | Ratio | AA normal (4.5) | AA grande (3.0) | AAA (7.0) |
|---|---|---|:--:|:--:|:--:|
| grafito `#575756` | blanco `#FFFFFF` | **7.23** | ✅ | ✅ | ✅ |
| grafito `#575756` | fondo `#FAFAF8` | **6.92** | ✅ | ✅ | ❌ |
| azul `#0067B1` | blanco `#FFFFFF` | **5.87** | ✅ | ✅ | ❌ |
| azul `#0067B1` | fondo `#FAFAF8` | **5.62** | ✅ | ✅ | ❌ |
| blanco `#FFFFFF` | azul `#0067B1` | **5.87** | ✅ | ✅ | ❌ |
| blanco `#FFFFFF` | grafito `#575756` | **7.23** | ✅ | ✅ | ✅ |
| grafito `#575756` | amarillo `#FFD000` | **4.92** | ✅ | ✅ | ❌ |
| tinta `#1A1A19` | amarillo `#FFD000` | **11.84** | ✅ | ✅ | ✅ |
| azul `#0067B1` | amarillo `#FFD000` | **3.99** | ❌ | ✅ | ❌ |
| **amarillo `#FFD000`** | **blanco `#FFFFFF`** | **1.47** | ❌ | ❌ | ❌ |
| **amarillo `#FFD000`** | **fondo `#FAFAF8`** | **1.41** | ❌ | ❌ | ❌ |
| amarillo `#FFD000` | azul `#0067B1` | 3.99 | ❌ | ✅ | ❌ |

## Reglas que se derivan y se aplican en el código

1. **El amarillo nunca es texto sobre blanco ni sobre `--fondo`.** 1.4:1 es invisible. Es superficie,
   subrayado, o forma en el SVG. Nada más.
2. **Sobre amarillo, el texto va en `--tinta` (`#1A1A19`)**, no en grafito. 11.84 vs 4.92: grafito
   pasa, pero justo, y el amarillo es tan luminoso que el gris medio se lee turbio. Se usa tinta.
3. **Azul sobre amarillo (3.99) solo en texto grande** (≥24px, o ≥19px en 700). Nunca en cuerpo.
   Regla activa: los badges amarillos con texto pequeño llevan tinta.
4. **Anillo de foco: azul `#0067B1`, 2px, offset 2px.** 5.62:1 contra el fondo — supera holgadamente
   el 3:1 que WCAG 2.2 (1.4.11 y 2.4.13) exige para indicadores no textuales.
5. **Estados deshabilitados** no dependen solo de opacidad: llevan también `cursor: not-allowed` y
   `aria-disabled`, porque la opacidad baja rompe el contraste por definición.
