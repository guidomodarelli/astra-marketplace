# Imágenes, fuentes y scripts

## Imágenes

- Detectar: el elemento LCP del trace es una imagen, imágenes servidas más grandes que su tamaño renderizado, formatos JPEG/PNG pesados, CLS por imágenes sin dimensiones.
- Corregir:
  - Formatos modernos (AVIF/WebP) y `srcset`/`sizes` para servir el tamaño adecuado; usar el componente del framework si existe (`next/image`).
  - `width`/`height` o `aspect-ratio` para reservar espacio y evitar CLS.
  - `loading="lazy"` solo debajo del primer viewport; la imagen LCP va sin lazy y con `fetchpriority="high"`. Si además se precarga, un `<link rel="preload" as="image">` de una imagen responsive lleva `imagesrcset` e `imagesizes` idénticos al `srcset`/`sizes` del `<img>` (o se usa el preload del framework, como `priority` de `next/image`); un preload con solo `href` puede bajar el fallback mientras el `<img>` elige otro candidato y descargar la imagen dos veces. Sin eso, usar solo `fetchpriority="high"`.
- Medir: KB de imágenes de la página, LCP, CLS.

## Fuentes

- Detectar: texto invisible mientras carga la fuente (FOIT), saltos de layout al cambiar de fuente, muchas variantes o pesos cargados.
- Corregir:
  - `font-display: swap` (u `optional`) y `preload` de la fuente del texto principal; un `<link rel="preload" as="font">` manual lleva siempre `crossorigin` (y `type="font/woff2"`) para coincidir con el modo CORS del pedido de `@font-face`, o el navegador descarta el preload y descarga la fuente dos veces.
  - Formato WOFF2, subset de caracteres, menos pesos; fuentes variables cuando reemplazan varias variantes.
  - Self-hosting o el optimizador del framework (`next/font`) para evitar conexiones extra a terceros.
  - Fallback con métricas ajustadas (`size-adjust`, `ascent-override`) para reducir CLS.
- Medir: KB de fuentes, CLS, tiempo hasta texto visible.

## Scripts

- Detectar: scripts render-blocking en `<head>`, scripts de terceros (analytics, chat, tags, A/B testing) con long tasks en el trace, scripts que se cargan en páginas que no los usan.
- Corregir:
  - `defer` o `async` según si importa el orden; estrategias del framework (`next/script` con `lazyOnload`/`afterInteractive`).
  - Cargar terceros en idle o tras interacción (facade para chats y videos embebidos).
  - Eliminar scripts sin uso y revisar tags duplicados.
- Medir: TBT/INP, cantidad de long tasks atribuidas a terceros, KB de JS de terceros.
