---
name: measured-performance-optimization
description: 'Optimiza rendimiento web midiendo antes y después: renders, bundle/lazy loading, requests/caching, queries N+1, imágenes/fuentes/scripts. Usar al pedir "optimizar", "está lento", Core Web Vitals o N+1.'
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

Antes de tocar código, registrar la línea base del flujo con las mismas condiciones que se usarán después (mismo build, mismo throttling de CPU/red, misma data, cache fría o caliente declarada). Repetir al menos 3 veces las mediciones ruidosas (tiempos de carga, LCP, INP) y reportar la mediana.

### 4. Diagnosticar y priorizar

Ordenar los hallazgos por impacto medido en el flujo crítico, no por facilidad. Leer solo la referencia del área que corresponda:

| Área | Señal típica | Referencia |
|---|---|---|
| Renders innecesarios | INP alto, lag al tipear, Profiler con commits largos o componentes que re-renderizan sin cambio visible | [references/unnecessary-renders.md](references/unnecessary-renders.md) |
| Bundle y lazy loading | JS inicial grande, TBT/LCP altos, dependencias pesadas en la ruta inicial | [references/bundle-lazy-loading.md](references/bundle-lazy-loading.md) |
| Requests y caching | Waterfalls, requests duplicados, falta de `Cache-Control`/ETag, refetch innecesario | [references/requests-caching.md](references/requests-caching.md) |
| Queries lentas y N+1 | Muchas queries casi iguales por request, endpoints cuyo tiempo crece con la cantidad de items, spans de DB repetidos en Sentry | [references/database-queries-n-plus-one.md](references/database-queries-n-plus-one.md) |
| Imágenes, fuentes y scripts | LCP por imagen, CLS por fuentes o imágenes sin dimensiones, scripts de terceros bloqueantes | [references/images-fonts-scripts.md](references/images-fonts-scripts.md) |

### 5. Aplicar una optimización a la vez

Hacer un cambio por iteración para poder atribuir el resultado. Mantener el comportamiento: correr los tests relevantes y, si el flujo tiene UI, recorrerlo con Playwright para confirmar que sigue funcionando.

### 6. Medir después y decidir

Repetir exactamente la medición del paso 3. Si la mejora no es significativa (dentro del ruido) o algo empeoró, revertir o replantear el cambio en lugar de dejarlo "por las dudas". Volver al paso 4 con el siguiente hallazgo.

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

Los valores de "Antes" y "Después" tienen que venir de mediciones reales hechas en la sesión. Si el entorno no permite medir (por ejemplo, el usuario pidió solo un plan), dejar la tabla con la métrica y la herramienta planeadas, y "Antes/Después" como pendientes.
