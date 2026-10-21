---
name: nextjs-route-ui-boundaries
description: 'Next.js App Router: decide loading.tsx con skeleton, error.tsx, layouts compartidos, Suspense, server vs client (sidebar, header, tablas) y las APIs de Next.js que conviene usar. Usar siempre, sin pedido explícito, al crear o modificar código de un proyecto Next.js con App Router (app/, page, layout, componentes que monta una ruta, next.config); no en Pages Router ni en repos sin Next.js.'
license: MIT
metadata:
  version: "1.0.0"
  author: "Guido Modarelli"
  category: "frontend"
  tags: "nextjs, app-router, loading, error-boundary, layout, suspense, skeleton, server-components"
  command: "/nextjs-route-ui-boundaries"
---

# Next.js: boundaries de UI por ruta

Esta skill decide **qué archivo especial o boundary corresponde a cada segmento** del árbol `app/` y **qué parte de cada pantalla se renderiza en server**. El objetivo es que cada navegación muestre algo útil al instante (shell + skeleton), que un error quede contenido en la porción más chica posible y que el JavaScript enviado al browser sea solo el de las piezas interactivas.

## Invocación automática en cada cambio de Next.js

Usar esta skill por iniciativa propia cada vez que se crea o modifica código de un proyecto Next.js con App Router, aunque el pedido no hable de rutas ni de loading: un componente nuevo puede ser la razón de que una página entera pase a `"use client"`, un `await` nuevo en un layout puede congelar todas las navegaciones, y es mucho más barato decidir el boundary al escribir el código que descubrirlo después.

Detectar el proyecto: `next` en `package.json` y un directorio `app/` (o `src/app/`). Con solo `pages/`, la skill no aplica.

Elegir el modo según el alcance del cambio:

- **Modo liviano** (cambio puntual: un componente, una página, un fix, estilos o copy dentro de una ruta). No re-auditar todo el árbol. Revisar solo los segmentos que el cambio toca contra este checklist y corregir en el mismo trabajo lo que el cambio introduzca:
  1. ¿El cambio agrega `"use client"`? Que quede en la hoja interactiva, no en la página, el layout o el contenedor (sección 3).
  2. ¿Agrega un `await`, `cookies()`, `headers()`, `params` o `searchParams`? Que haya un `loading.tsx` en ese segmento o un `<Suspense>` con skeleton alrededor, y que no viva en un `layout.tsx` sin su propio `<Suspense>` (sección 2).
  3. ¿Agrega I/O que puede fallar? Que un `error.tsx` por debajo del layout o un `catchError` lo contenga sin tumbar la chrome.
  4. ¿Agrega un estado de carga? Skeleton con la forma del contenido, no texto ni spinner (sección 4).
  5. ¿Hay una API de Next.js que resuelva mejor lo que el cambio hace a mano? Por ejemplo `useEffect` + `fetch` para datos iniciales, `<a>` en lugar de `Link`, `<img>` sin tamaño, `router.push` para un formulario de búsqueda, `try/catch` alrededor de `notFound()`. Consultar [nextjs-apis.md](references/nextjs-apis.md).
  
  Si nada del checklist aplica, seguir con la tarea sin reportar nada extra. Si algo aplica, sumar una línea por hallazgo al reporte de la tarea.
- **Modo completo** (pedido explícito sobre rutas, loading, errores, layouts o rendimiento de navegación; ruta o sección nueva; reestructura de `app/`). Seguir los pasos 0 a 5 completos.

No cambiar boundaries de rutas que el cambio no toca: si se detectan problemas fuera del alcance, listarlos como sugerencia al final en vez de corregirlos.

## 0. Verificar la versión antes de escribir código

Las convenciones cambian entre versiones de Next.js (por ejemplo, `error.tsx` recibe `retry` además de `reset` desde 16.x, y con Cache Components un layout que lee datos runtime exige su propio `<Suspense>`). Antes de proponer código:

1. Leer la versión de `next` en `package.json` y si `next.config.*` activa `cacheComponents` o `partialPrefetching`.
2. Si existe `node_modules/next/dist/docs/`, leer ahí `loading.md`, `error.md`, `layout.md` y, si aplica, `instant-navigation.md` de esa versión. La doc instalada manda sobre lo que recuerdes.
3. Leer las instrucciones del proyecto (`AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, convenciones de `docs/`): librería de componentes, primitivo de skeleton existente, estilos (CSS Modules, SCSS, Tailwind) y copy (idioma de los textos visibles). Reutilizar lo que ya exista antes de crear algo nuevo.

Ver [version-notes.md](references/version-notes.md) para las diferencias que más afectan estas decisiones y [nextjs-apis.md](references/nextjs-apis.md) para el catálogo de APIs (archivos especiales, prefetch e instant navigation, hooks de navegación, `notFound`/`forbidden`/`catchError`, Cache Components, invalidación, metadata, componentes optimizados y configuración) con el caso en que cada una aporta valor. Proponer una API solo cuando resuelve un problema concreto del código analizado, y avisar si es experimental y requiere un flag.

## 1. Mapear el árbol de rutas

Listar `app/` con sus archivos especiales y armar una tabla por segmento:

```text
segmento | layout | template | loading | error | not-found | page | ¿qué datos espera? | ¿qué UI comparte con hermanos?
```

Marcar en cada `page.tsx` y `layout.tsx`: `await` de datos, lectura de `params` / `searchParams` / `cookies()` / `headers()`, `"use client"` en el archivo raíz y componentes cliente grandes.

## 2. Decidir cada archivo especial

Usar las reglas de [decision-rules.md](references/decision-rules.md). Resumen:

| Archivo | Ponerlo cuando | No ponerlo cuando |
|---|---|---|
| `layout.tsx` compartido | Dos o más rutas hermanas repiten la misma chrome (sidebar, header, tabs, breadcrumbs base) o el mismo provider. Agruparlas con un route group `(nombre)` si no comparten prefijo de URL. | La UI "compartida" cambia por página o necesita resetear estado al navegar (usar `template.tsx`). Nunca para leer `searchParams`: el layout no se re-renderiza y quedarían stale. |
| `loading.tsx` | El segmento espera datos (o lee datos runtime) antes de pintar. Con navegaciones instantáneas, **cada segmento que espera** necesita su propio `loading.tsx`: el de un segmento padre no cubre la navegación entre hermanos. | La página es estática o cacheada y renderiza sin esperar. No sirve para datos que espera el `layout.tsx` del mismo segmento. |
| `<Suspense>` dentro de la página | Hay partes con latencias distintas: el título y los filtros pueden salir ya, la tabla espera. Un boundary por bloque independiente, con su skeleton. | El bloque es barato o no tiene sentido mostrarlo a medias. |
| `error.tsx` | El segmento hace I/O que puede fallar y conviene que el resto de la app (sidebar, header) siga usable. Ubicarlo en el nivel más bajo que todavía muestre contexto útil. | Repetirlo idéntico en cada hoja: un `error.tsx` en el segmento padre cubre a los hijos. Recordar que **no** captura errores del `layout.tsx` del mismo segmento. |
| `global-error.tsx` | Siempre, una vez en la raíz: es lo único que cubre errores del root layout. Lleva su propio `<html>`/`<body>`. | — |
| `not-found.tsx` | El segmento recibe un id/slug que puede no existir y la página llama a `notFound()`. Llamar `notFound()` antes de cualquier `await` que suspenda para poder devolver 404. | Para errores de permisos: usar `forbidden()` / `unauthorized()` si la versión lo soporta, o un estado vacío explícito. |
| `template.tsx` | Hay que resetear estado de hijos cliente o re-disparar un efecto en cada navegación, o mostrar el fallback de Suspense en cada navegación. | Por defecto: un template remonta en cada navegación y pierde las ventajas del layout. |

Errores de un componente puntual (un widget de terceros, un gráfico) se contienen con un error boundary de componente (`catchError` o el patrón del proyecto), no con un `error.tsx` de ruta.

## 3. Decidir qué renderiza el server

Por defecto todo es Server Component. Bajar a cliente **solo la hoja interactiva**, nunca el contenedor entero. Ver el catálogo por elemento en [server-client-split.md](references/server-client-split.md).

Regla general:

```text
Server: estructura, datos, permisos, links, listas, textos, íconos, markup estático
Cliente: estado efímero, handlers, hooks de browser (usePathname para resaltar el link activo,
         useState para colapsar, refs, media queries, drag & drop)
```

Ejemplo típico, el sidebar:

- El `<aside>`, la lista de navegación filtrada por permisos, los `<Link>` y los íconos se renderizan en server dentro del `layout.tsx`.
- El resaltado del link activo es una isla cliente pequeña (`usePathname`) que envuelve o recibe los items, o un `NavLink` cliente por item.
- El estado colapsado/expandido se lee de una cookie en server para que el primer HTML ya salga con el ancho correcto (sin salto), y un botón cliente lo alterna y persiste la cookie.
- Si los items dependen de datos runtime (usuario, membresías), envolver esa parte en `<Suspense>` con un skeleton del sidebar, para que el resto del layout no bloquee la navegación.

Pasar Server Components como `children` o props a un componente cliente en lugar de importarlos dentro de él: así siguen renderizándose en server.

## 4. Skeletons en vez de texto plano

Un `loading.tsx` que devuelve "Cargando..." o un spinner centrado provoca salto de layout (CLS) y no anticipa nada. Reemplazarlo por un skeleton que replique la **forma final** del segmento. Ver [skeleton-patterns.md](references/skeleton-patterns.md).

- Mismo contenedor, grid y anchos que la página real; placeholders con la altura de cada bloque (título, toolbar, filas de tabla, cards).
- Mostrar sin placeholder lo que ya se conoce: título de la sección, breadcrumbs estáticos, botones primarios deshabilitados.
- Accesibilidad: el contenedor con `aria-busy="true"` y un texto solo para lectores de pantalla ("Cargando miembros"), placeholders con `aria-hidden="true"`. No anunciar cada placeholder.
- Animación de shimmer/pulse desactivada con `prefers-reduced-motion`.
- Reutilizar el primitivo de skeleton del design system y extraer el skeleton de cada pantalla a un componente propio cuando lo usan `loading.tsx` y un `<Suspense>` de la misma página, para que no diverjan.
- Segmentos hijos que comparten la misma forma pueden reexportar el skeleton del padre (`export { default } from "../loading"`) en vez de duplicarlo.

## 5. Aplicar y verificar

1. Presentar primero la tabla de decisiones por segmento (qué se agrega, mueve o elimina y por qué) y después aplicar los cambios en el código.
2. Respetar las convenciones del proyecto: estructura de componentes, estilos, idioma del copy visible y librería de UI.
3. Verificar:
   - `typecheck`, lint y build (un `error.tsx` sin `"use client"` o un layout que lee `searchParams` fallan acá o en runtime).
   - Navegar entre rutas hermanas en el dev server: el shell y el sidebar quedan fijos y aparece el skeleton del segmento destino, no una pantalla congelada.
   - Forzar un error en una página (throw temporal o toggle de boundary en React DevTools) y comprobar que el sidebar sigue usable y que `retry` recupera.
   - Recargar en una ruta con datos lentos: el HTML inicial ya trae el shell server-rendered (ver código fuente o desactivar JS).
   - Revisar el bundle o las islas `"use client"`: el sidebar no debería aparecer entero como componente cliente.
4. Actualizar o agregar tests de comportamiento que cubran los estados nuevos (render del skeleton, fallback de error con acción de reintentar, `notFound`), siguiendo la estrategia de testing del proyecto.

## Formato del reporte

```markdown
## Árbol analizado
<tabla por segmento del paso 1>

## Decisiones
| Segmento | Cambio | Motivo |

## Server vs cliente
| Elemento | Antes | Después | Motivo |

## Verificación
<comandos y comprobaciones ejecutadas, con resultado>
```

## Límites con otras skills

- `refactor-ssr-data-fetching`: desde dónde se piden los datos (SSR, BFF o upstream) y qué DTO cruza al browser.
- `prevent-ssr-hydration-mismatches`: que el HTML de server y el primer render cliente coincidan (por ejemplo, el estado colapsado del sidebar leído de cookie y no de `localStorage`).
- `async-operation-error-handling` y `critical-validation-feedback-ui`: errores de mutations y validaciones dentro de una pantalla, no de la ruta.
- `measured-performance-optimization`: medir el impacto (LCP, CLS, bundle) cuando el pedido es de rendimiento.
- `mobile-first-responsive-layout`: el comportamiento responsive del sidebar y la chrome.
