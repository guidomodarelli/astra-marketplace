# Herramientas de medición

Usar la herramienta que mida la métrica del flujo crítico con menos fricción. Verificar qué MCPs están conectados en la sesión antes de planificar; si uno no está, usar la alternativa y decirlo en el reporte.

## Chrome DevTools MCP — laboratorio de frontend

Sirve para medir carga e interacción en un browser real:

- **Performance trace** con throttling de CPU y red: LCP, CLS, INP/TBT, long tasks y qué script o render las causa.
- **Network**: tamaño transferido y descomprimido, waterfall, requests duplicados, headers de cache (`Cache-Control`, `ETag`, `Age`), prioridad de recursos.
- **Coverage** (si está disponible): JS y CSS que se descarga pero no se ejecuta en la ruta.
- **Console**: warnings de hydration, errores y logs de timing.

Fijar siempre las mismas condiciones antes y después (por ejemplo, CPU 4x y red "Fast 4G", cache deshabilitada para carga fría).

## Playwright MCP — flujos reales y regresiones

Sirve para recorrer el flujo como lo haría un usuario y repetirlo de forma idéntica:

- Navegar, tipear, filtrar, paginar y medir tiempos con `performance.now()`, `PerformanceObserver` o `page.evaluate(() => performance.getEntriesByType('navigation'))`.
- Contar requests del flujo escuchando eventos de red, útil para detectar requests duplicados o en cascada.
- Confirmar que la optimización no rompió el flujo (el paso 5 del flujo principal).

## Sentry MCP — producción

Sirve para encontrar qué vale la pena optimizar y confirmar el efecto con usuarios reales:

- Transacciones más lentas por p75/p95 y su desglose de spans.
- Issues de performance (N+1 queries, consultas lentas, render-blocking, assets grandes) que Sentry detecta automáticamente.
- Web Vitals de campo por página.
- Después del deploy, comparar el mismo período/tráfico antes y después.

Los datos de producción complementan al laboratorio: el laboratorio atribuye un cambio, producción confirma que importa.

## Alternativas sin MCP

| Necesidad | Alternativa |
|---|---|
| Web Vitals de laboratorio | `npx lighthouse <url> --output=json` (correr 3 veces, usar la mediana) |
| Tamaño de bundle | Output del build del framework, `source-map-explorer`, `@next/bundle-analyzer`, `rollup-plugin-visualizer`, `webpack-bundle-analyzer` |
| Renders | React DevTools Profiler, `<Profiler onRender>` temporal |
| Queries | Log de queries del ORM, `EXPLAIN ANALYZE` (en escrituras, ver [advertencia](database-queries-n-plus-one.md#queries-lentas-que-no-son-n1)), `pg_stat_statements`, contador de queries en un test de integración |
| Tiempos de endpoint | `autocannon`, `k6`, `hey`, o `curl -w '%{time_total}'` repetido |
