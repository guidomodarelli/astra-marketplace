---
name: measured-performance-optimization
description: 'Mide y optimiza rendimiento web: app web lenta, Core Web Vitals, bundle, renders, caching o queries N+1.'
license: MIT
metadata:
  version: "1.0.0"
  author: "Guido Modarelli"
  category: "performance"
  tags: "performance, web-vitals, bundle, caching, n+1, lazy-loading, chrome-devtools, playwright, sentry"
  command: "/measured-performance-optimization"
---

# Measured Performance Optimization

Optimiza una aplicación web de punta a punta (frontend, red, backend y base de datos) con una sola regla central: **toda optimización se mide antes y después**. Un cambio sin medición previa no se puede atribuir, y uno sin medición posterior puede empeorar las cosas sin que nadie lo note: optimizaciones razonables en teoría (memoizar, cachear, partir chunks) a veces suman costo o rompen el flujo.

## Cuándo usar otra skill

- Revisar un diff buscando riesgos de performance sin optimizar ni medir: `review-performance`.
- Detalle de patrones de render en React (`startTransition`, `useMemo`, `React.memo`, equality guards): `react-render-performance-patterns`. Esta skill decide *si* el render es el cuello de botella y mide; esa define *cómo* arreglarlo.
- Arquitectura de fetching SSR/BFF: `refactor-ssr-data-fetching`.

## Flujo obligatorio

Seguir los pasos en orden. Si el usuario pidió solo un área (por ejemplo, "arreglá el N+1"), aplicar el mismo flujo acotado a esa área.

### 1. Definir alcance y flujo crítico

Identificar qué flujo real importa (página, interacción, endpoint, job) y qué métrica lo representa. Sin un flujo concreto, se termina optimizando código frío. Si el usuario no lo dijo, inferirlo del código y de los errores/transacciones lentas de producción, y declararlo como supuesto.

### 2. Elegir herramientas de medición

Detectar qué MCPs y herramientas hay disponibles y usar la más directa para cada área. Leer [references/measurement-tools.md](references/measurement-tools.md) para saber qué mide cada una (Chrome DevTools MCP, Playwright MCP, Sentry MCP) y sus alternativas sin MCP. Si no hay forma de medir algo, decirlo explícitamente: no inventar números ni presentar estimaciones como mediciones.

### 3. Medir la línea base

Antes de tocar el código que se va a optimizar, registrar la línea base del flujo con las mismas condiciones que se usarán después (mismo modo de build de producción y mismos flags, mismo entorno, mismo throttling de CPU/red, misma data, cache fría o caliente declarada), rebuildeando cada revisión del código antes de medirla. Repetir al menos 3 veces las mediciones ruidosas (tiempos de carga, LCP, INP) y reportar la mediana.

Única excepción: se permite agregar antes de la línea base instrumentación solo de medición que no cambie el comportamiento (por ejemplo, un `<Profiler onRender>` cuando no hay React DevTools). Esa instrumentación tiene que ser idéntica en las mediciones de antes y después, y se quita al terminar; no habilita adelantar ningún cambio de la optimización.

Si no se puede medir la línea base (sin runtime, entorno, datos o herramienta) y el usuario pidió optimizar de verdad, detenerse antes de editar código: reportar qué falta para medir y cómo conseguirlo, y no avanzar al paso 5 hasta capturarla.

### 4. Diagnosticar y priorizar

Ordenar los hallazgos por impacto medido en el flujo crítico, no por facilidad. Leer solo la referencia del área que corresponda; las señales de detección viven en la sección «Detectar» de cada referencia (o en los bullets «Detectar:» de cada subsección):

| Área | Alcance | Referencia |
|---|---|---|
| Renders innecesarios | Trabajo de render y commits de componentes en el cliente | [references/unnecessary-renders.md](references/unnecessary-renders.md) |
| Bundle y lazy loading | Tamaño y división del JavaScript que se descarga y ejecuta | [references/bundle-lazy-loading.md](references/bundle-lazy-loading.md) |
| Requests y caching | Orden, cantidad y cacheo de requests entre cliente, red y servidor | [references/requests-caching.md](references/requests-caching.md) |
| Queries lentas y N+1 | Acceso a base de datos desde el backend | [references/database-queries-n-plus-one.md](references/database-queries-n-plus-one.md) |
| Imágenes, fuentes y scripts | Carga de imágenes, fuentes web y scripts de terceros | [references/images-fonts-scripts.md](references/images-fonts-scripts.md) |

### 5. Aplicar una optimización a la vez

Hacer un cambio por iteración para poder atribuir el resultado. Mantener el comportamiento: correr los tests relevantes y, si el flujo tiene UI, recorrerlo con la automatización de navegador disponible (por ejemplo, Playwright o Chrome DevTools MCP) o con el runner UI/E2E del proyecto para confirmar que sigue funcionando.

### 6. Medir después y decidir

Rebuildear la revisión modificada con el mismo modo de build y flags, y repetir exactamente la medición del paso 3. Si la mejora no es significativa (dentro del ruido) o algo empeoró, revertir o replantear el cambio en lugar de dejarlo "por las dudas". Volver al paso 4 con el siguiente hallazgo.

### 7. Reportar

Cerrar con este formato:

```markdown
## Resultado de optimización

**Flujo medido:** <página/interacción/endpoint> · **Condiciones:** <build, throttling, data, cache>

| # | Optimización | Métrica | Antes | Después | Delta | Herramienta |
|---|---|---|---|---|---|---|
| 1 | <cambio> | <LCP / INP / KB JS / queries por request / p95 ms> | <valor> | <valor> | <%> | <MCP o comando> |

**Descartadas:** <cambios probados que no mejoraron y se revirtieron, con su medición>
**Sin medir:** <qué no se pudo medir y por qué>
**Próximos pasos:** <hallazgos pendientes ordenados por impacto>
```

Los valores de "Antes" y "Después" tienen que venir de mediciones reales hechas en la sesión. Solo cuando el usuario pidió un plan o diagnóstico sin editar código y el entorno no permite medir, dejar la tabla con la métrica y la herramienta planeadas, y "Antes/Después" como pendientes; si pidió una optimización real, aplica la detención del paso 3.
