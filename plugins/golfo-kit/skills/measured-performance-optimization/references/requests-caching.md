# Requests y caching

## Detectar

- Waterfalls: requests que dependen uno del otro sin necesidad (A termina → recién arranca B) en el panel Network o en los spans de Sentry.
- Requests duplicados del mismo recurso en un mismo flujo (varios componentes pidiendo lo mismo, refetch al montar, StrictMode sin dedupe).
- Respuestas sin `Cache-Control`, `ETag` o `Last-Modified`, o assets con hash sin cache inmutable.
- Payloads más grandes de lo que la UI usa (campos sin usar, listas sin paginar), o respuestas sin compresión.
- Polling o refetch demasiado frecuente.

## Corregir

- Paralelizar requests independientes (`Promise.all`) o moverlos al server/BFF para resolverlos en una sola respuesta (ver `refactor-ssr-data-fetching`).
- Deduplicar con una capa de datos compartida (TanStack Query, SWR, cache del framework) con `staleTime` acorde a qué tan seguido cambia el dato (ver `react-data-fetching-best-practices`).
- Headers HTTP: `Cache-Control: public, max-age=31536000, immutable` para assets con hash; `max-age` corto + `stale-while-revalidate` o `ETag` para datos que cambian; `private`/`no-store` para datos de usuario sensibles.
- Cache en servidor (memoria, Redis, CDN) para lecturas caras y repetidas, con invalidación explícita. Una cache sin estrategia de invalidación es un bug de datos viejos pendiente.
- Reducir payload: paginación, proyección de campos, compresión (`br`/`gzip`).
- Cancelar requests obsoletos (ver `react-useeffect-abortcontroller`).

## Métricas antes/después

- Cantidad de requests del flujo y cuántos son duplicados.
- Tiempo total del flujo hasta datos listos (camino crítico del waterfall).
- KB transferidos y tasa de hits de cache (`304`, `Age`, `x-cache`).
- p95 del endpoint en Sentry o en un test de carga.
