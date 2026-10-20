# Bundle y lazy loading

El objetivo es que la ruta inicial descargue y ejecute solo lo que necesita para el primer render útil.

## Detectar

- Analizar el bundle con la herramienta del bundler (ver [measurement-tools.md](measurement-tools.md#alternativas-sin-mcp)) y ubicar los chunks más pesados de la ruta inicial.
- Coverage de Chrome DevTools: porcentaje de JS descargado y no ejecutado.
- Dependencias pesadas importadas enteras (librerías de fechas, íconos, charts, editores, `lodash` completo) o importadas en un módulo compartido por todas las rutas.

## Corregir

- Code splitting por ruta (el router del framework suele hacerlo; verificar que no se rompa por un import compartido).
- Lazy loading de componentes que no están en el primer viewport o que aparecen tras una interacción: `React.lazy` + `Suspense`, `next/dynamic`, `import()` dinámico al abrir un modal, tab o editor.
- Importar solo lo necesario (`import debounce from 'lodash/debounce'`, íconos individuales) y reemplazar dependencias pesadas por alternativas livianas o APIs nativas (`Intl`, `fetch`, `structuredClone`).
- Prefetch del chunk diferido en hover o idle cuando el usuario probablemente lo vaya a necesitar, para no mover la espera a la interacción.
- Revisar que el lazy loading no empeore LCP: el contenido del primer viewport no se carga diferido.

## Métricas antes/después

- KB de JS inicial (comprimido y sin comprimir) de la ruta.
- Cantidad y tamaño de chunks de la ruta inicial.
- TBT/INP y LCP en el mismo throttling.
