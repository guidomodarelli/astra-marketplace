---
name: ui-ux-flow-patterns
description: 'UI/UX por flujo: qué componente usar y qué mostrar en cada estado (loading, vacío, con datos, error, parcial, sin permiso), cuándo usar toast, banner, inline o diálogo, confirmar o deshacer, validación previa a la acción con error junto al campo, limpieza de errores viejos (stale errors) al cambiar de recurso o reintentar, cuándo usar el feedback de reporte a soporte y qué feedback recibe el usuario. Usar siempre, sin pedido explícito, al crear o modificar pantallas, listas, tablas, formularios, búsquedas, uploads, wizards o acciones de UI en cualquier stack; no en código sin interfaz.'
license: MIT
metadata:
  version: "1.0.0"
  author: "Guido Modarelli"
  category: "frontend"
  tags: "ux, ui, empty-state, loading, error-state, toast, feedback, components, flows"
  command: "/ui-ux-flow-patterns"
---

# UI/UX por flujo: componentes, estados y feedback

Una pantalla no tiene un solo diseño: tiene uno por **estado**. La versión "con datos" es la que todos dibujan; las que hacen que un producto se sienta cuidado (Linear, Stripe, GitHub, Gmail, GOV.UK) son las otras: la primera carga, la lista vacía de un usuario nuevo, la búsqueda sin resultados, el error que no borra lo que el usuario escribió, el guardado que confirma sin interrumpir. Esta skill obliga a diseñar todas esas versiones antes de dar una UI por terminada y a elegir el componente y el canal de feedback que corresponden a cada una.

## Invocación automática

Usar esta skill por iniciativa propia cada vez que se crea o modifica código que el usuario ve o con el que interactúa (páginas, componentes, listas, tablas, formularios, diálogos, acciones), aunque el pedido solo hable de "agregar un botón" o "mostrar los pagos". Elegir el modo según el alcance:

- **Modo liviano** (cambio puntual: un botón, una columna, un campo, copy). Revisar solo lo que el cambio toca con este checklist y corregir en el mismo trabajo lo que el cambio introduzca:
  1. Si el cambio **trae datos**: ¿tiene estado de carga con la forma del contenido, estado vacío y estado de error con reintento? ([state-matrix.md](references/state-matrix.md))
  2. Si el cambio **ejecuta una acción**: ¿el control muestra pending, evita el doble envío y el resultado llega por el canal correcto? ([feedback-channels.md](references/feedback-channels.md#tabla-de-decisión))
  3. Si la acción **destruye o es irreversible**: ¿se eligió entre deshacer y confirmar según [la regla](references/feedback-channels.md#confirmar-o-deshacer)?
  4. Si el cambio **valida input o muestra errores**: ¿la acción se bloquea antes del request, el error queda junto al campo y el error viejo se limpia al cambiar de recurso o reintentar? ([validation-feedback.md](references/validation-feedback.md))
  5. ¿El feedback nuevo es accesible (live region, foco, no solo color)? ([accesibilidad](references/feedback-channels.md#accesibilidad-del-feedback))

  Aplicar lo que salga del checklist directamente en el código. No producir la matriz de estados ni las tablas del [formato del reporte](#formato-del-reporte), que son del modo completo: un cambio puntual se entrega con el formato que pidió el usuario. Si nada aplica, seguir sin reportar nada extra; si algo aplica, sumar una línea por hallazgo al cierre de la tarea.
- **Modo completo** (pantalla o flujo nuevo, rediseño, pedido explícito sobre UX, estados o feedback). Seguir los pasos 0 a 5.

No rediseñar pantallas que el cambio no toca: los problemas fuera del alcance se listan como sugerencia al final.

## 0. Leer el sistema de diseño del proyecto

Antes de proponer componentes, leer `DESIGN.md`, `AGENTS.md`/`CLAUDE.md` y las convenciones de `docs/` si existen, y ubicar la librería de componentes que el proyecto ya usa (por ejemplo su `EmptyState`, `Skeleton`, `toast`, `Alert`/`Banner`, `Dialog`). Reusar esos primitivos y su API; los nombres de esta skill (toast, banner, empty state) son **roles**, no componentes a crear. Respetar el idioma del copy visible y las reglas de motion y estilos del proyecto. Si el proyecto ya define cuándo usar cada tipo de toast u otro canal, esa regla manda sobre esta skill.

## 1. Identificar el tipo de flujo

Clasificar la pantalla o acción en uno o más tipos de [flow-catalog.md](references/flow-catalog.md) (colección/lista/tabla, búsqueda, detalle, formulario de creación/edición, wizard u onboarding, acción destructiva, upload, dashboard, settings, autenticación, pago, inbox/notificaciones, chat/tiempo real). Cada tipo trae sus componentes típicos, sus estados críticos, los errores comunes y referencias de productos que lo resuelven bien. Leer solo las secciones de los tipos que aplican.

## 2. Armar la matriz de estados

Para cada región que trae datos o ejecuta acciones, completar la matriz con los estados de [state-matrix.md](references/state-matrix.md#estados): carga inicial, recarga o refetch, vacío (primera vez, sin resultados por filtro o búsqueda, vaciado por el usuario, sin permiso), con datos (incluido uno solo y muchísimos), parcial, error (total, parcial, de acción), offline o desactualizado. Por cada estado decidir **qué se ve**, **qué puede hacer el usuario** y **cómo sale de ese estado**. Un estado sin salida (un error sin reintento, un vacío sin acción) es un callejón y se corrige.

## 3. Elegir el canal de feedback de cada evento

Para cada evento (acción completada, fallo, validación, cambio de estado en segundo plano, aviso persistente) elegir el canal con la [tabla de decisión](references/feedback-channels.md#tabla-de-decisión): inline junto al control, mensaje de formulario, banner, toast, diálogo, badge, página completa o el propio cambio de la UI. La pregunta guía es **dónde está mirando el usuario y cuánto necesita actuar**: lo que requiere acción no se va solo, y lo que solo confirma no interrumpe. Decidir también confirmar o deshacer para cada acción destructiva. Para validación previa, errores viejos y feedback de reporte a soporte, aplicar [validation-feedback.md](references/validation-feedback.md).

## 4. Escribir el copy de cada estado

Cada estado vacío, error y confirmación responde: **qué pasó**, **por qué** (si ayuda) y **qué hacer ahora**, con una acción concreta. Seguir las [reglas de copy](references/state-matrix.md#copy-de-los-estados): verbos específicos en botones ("Guardar cambios", no "Aceptar"), errores sin culpa ni jerga técnica, sin exponer detalles internos, en el idioma del producto.

## 5. Aplicar y verificar

1. Presentar primero la matriz de estados y el canal elegido por evento; después implementar.
2. Verificar cada estado de verdad, no solo el feliz: simular la red lenta (throttling o un delay temporal), una respuesta vacía, un error del servidor y un doble clic en cada acción. Si hay dev server, recorrer los estados en el browser con el teclado y con el lector de pantalla o las herramientas de accesibilidad disponibles.
3. Agregar o actualizar tests de comportamiento para los estados nuevos (render del vacío con su acción, error con reintento que recupera, botón en pending que no envía dos veces), siguiendo la estrategia de testing del proyecto.

## Formato del reporte

Solo en modo completo:

```markdown
## Flujo
<tipo(s) de flujo y regiones de la pantalla>

## Matriz de estados
| Región | Estado | Qué se ve | Acción disponible | Cómo sale |

## Feedback por evento
| Evento | Canal | Motivo |

## Verificación
<estados recorridos, tests y comprobaciones ejecutadas, con resultado>
```

## Límites con otras skills

- `nextjs-route-ui-boundaries`: en Next.js, **dónde** van `loading.tsx`, `error.tsx` y los `<Suspense>`; esta skill decide **qué muestran**.
- `optimistic-action-mutations`: implementación de toggles y acciones optimistas con rollback.
- `async-operation-error-handling`: errores de jobs, batches, polling y éxito parcial a través de las capas.
- `semantic-html-a11y`: semántica, roles y foco de los controles.
- `mobile-first-responsive-layout`: cómo se adapta cada estado a pantallas chicas.
- `widget-ui-proposals`: mostrar variantes visuales de un estado antes de implementarlo.
