# Matriz de estados

Fuente única de qué mostrar en cada estado de una región que trae datos o ejecuta acciones. Los tiempos y criterios salen de las fuentes de [sources.md](sources.md).

## Contenido

- [Estados](#estados)
- [Carga](#carga)
- [Vacío](#vacío)
- [Con datos](#con-datos)
- [Error](#error)
- [Offline y datos desactualizados](#offline-y-datos-desactualizados)
- [Copy de los estados](#copy-de-los-estados)
- [Anti-patrones](#anti-patrones)

## Estados

| Estado | Cuándo ocurre | Pregunta que responde la UI |
|---|---|---|
| Carga inicial | Primera vez que la región pide datos | ¿Qué va a aparecer acá? |
| Recarga / refetch | Ya hay datos y se piden de nuevo (filtro, paginado, refresco) | ¿Lo que veo sigue siendo válido? |
| Vacío: primera vez | El usuario todavía no creó nada | ¿Para qué sirve esto y cómo empiezo? |
| Vacío: sin resultados | Un filtro o búsqueda no devuelve nada | ¿Por qué no hay nada y cómo amplío? |
| Vacío: vaciado por el usuario | Completó o borró todo (inbox cero, carrito vacío) | ¿Terminé? ¿Qué sigue? |
| Vacío: sin permiso o no disponible | Existe contenido pero el usuario no puede verlo, o la feature no está configurada | ¿Qué me falta para acceder? |
| Con datos: uno | Un solo ítem | ¿La UI sigue teniendo sentido con uno? |
| Con datos: muchos | Cientos o miles, textos largos | ¿Puedo encontrar lo que busco? |
| Parcial | Algunas partes cargaron y otras no | ¿Qué es confiable y qué falló? |
| Error total | No se pudo cargar la región | ¿Es mi culpa? ¿Puedo reintentar? |
| Error de acción | Falló una mutación (guardar, borrar, enviar) | ¿Se perdió lo que hice? ¿Qué hago? |
| Offline / desactualizado | Sin red o datos viejos | ¿Lo que veo es actual? ¿Se guarda lo que hago? |

No todas las regiones tienen todos los estados: descartar uno explícitamente ("esta lista nunca está vacía porque siempre existe el dueño") es una decisión válida; olvidarlo no.

## Carga

Elegir el indicador por **duración esperada** y **si se conoce la forma del resultado**:

| Espera | Indicador |
|---|---|
| < ~300 ms | Nada. Un loader que parpadea unas decenas de ms se lee como un glitch. Si el indicador ya apareció, mantenerlo un mínimo (~300–600 ms) para que no destelle. |
| ~300 ms – ~2 s, layout conocido | **Skeleton** con la forma final (mismas filas, columnas, alturas) para evitar saltos de layout. |
| Acción puntual en un control | **Pending en el control**: el botón conserva su ancho, muestra spinner o texto en gerundio ("Guardando…") y queda deshabilitado para evitar el doble envío. |
| Espera corta sin forma predecible | Spinner chico **en el lugar** donde va a aparecer el resultado, nunca bloqueando la pantalla entera. |
| > ~10 s o medible (upload, export, import) | **Barra de progreso determinada** con porcentaje o pasos, opción de cancelar y, si es largo, permitir seguir usando la app y avisar al terminar. Una barra falsa que se clava destruye la confianza. |

Reglas:

- **Recarga ≠ carga inicial.** Con datos ya visibles, no volver al skeleton: mantener los datos anteriores con un indicador sutil (opacidad reducida, barra fina arriba, spinner en el control que disparó la recarga) y bloquear solo lo que no es válido. Volver al skeleton hace perder el lugar y el scroll.
- Cargar por **región**: la chrome (navegación, header, filtros) aparece al instante y cada bloque carga por su cuenta; un bloque lento no bloquea a los demás.
- El skeleton se marca `aria-busy="true"` en la región y se oculta a lectores de pantalla (`aria-hidden`) con un texto accesible de estado ("Cargando pagos"); su animación respeta `prefers-reduced-motion`.
- Texto plano ("Cargando…") o un spinner centrado en la página son aceptables solo cuando no existe forma conocida (por ejemplo una pantalla de redirección).

## Vacío

Todo estado vacío responde **qué es esto, por qué está vacío y qué hacer ahora**, con una acción concreta. Un vacío no es un error: tono neutro o alentador.

| Tipo | Qué mostrar | Acción |
|---|---|---|
| Primera vez | Título que explica el valor ("Todavía no hay cursos"), una línea de para qué sirve, ilustración opcional y sobria | CTA primario para crear el primero; opcional: importar, plantilla o datos de ejemplo, link a ayuda |
| Sin resultados (filtro/búsqueda) | Repetir el término o los filtros activos ("No hay pagos que coincidan con 'marzo' y 'Pendiente'") | "Limpiar filtros" o quitar filtros de a uno; sugerencias de búsqueda; ofrecer crear el ítem buscado si corresponde |
| Vaciado por el usuario | Mensaje de cierre positivo ("Estás al día") | Siguiente paso natural o nada; no un CTA de "crear" agresivo |
| Sin permiso | Qué existe y qué falta ("Solo los administradores pueden ver los pagos") | Pedir acceso, contactar al dueño o volver; nunca un 404 genérico si el recurso existe y el usuario puede saberlo |
| Feature sin configurar | Qué habilita configurar la feature | CTA a la configuración |

Reglas:

- Mantener la **chrome de la colección** (título, botón de crear, filtros) también en el vacío: si los filtros desaparecen cuando no hay resultados, el usuario no puede quitarlos.
- El vacío por filtro **no** reutiliza el copy de primera vez ("Creá tu primer pago" cuando hay 300 pagos filtrados es falso).
- Un vacío dentro de un bloque chico (widget de dashboard, sección de detalle) es una línea de texto con, como mucho, un link; el empty state grande es para la región principal.
- Diferenciar "vacío" de "todavía cargando" y de "falló": mostrar el vacío solo con una respuesta exitosa sin ítems.

## Con datos

- Probar con **uno** (que no se vea roto un grid de una sola card, que el plural del contador sea correcto) y con **muchos** (paginación o carga incremental, contador total, texto largo truncado con el valor completo accesible, números alineados a la derecha en tablas).
- Mostrar dónde está el usuario en el conjunto ("1–25 de 312") y conservar filtros, orden, página y scroll al volver de un detalle (en la URL cuando se puede compartir).
- Ítems recién creados aparecen donde el usuario los espera (arriba o resaltados un momento), no perdidos en la página 7.

## Error

| Tipo | Canal | Contenido |
|---|---|---|
| Error total de la región | Reemplaza **solo la región** que falló, con la chrome intacta | Qué falló en lenguaje del usuario, botón "Reintentar"; si persiste, camino alternativo (soporte, código de referencia) |
| Error parcial | El bloque que falló muestra su propio error; lo demás queda usable | Igual que el total, acotado al bloque |
| Error de acción (mutación) | Cerca del control que la disparó, o toast con acción si el usuario ya se fue de ahí | Qué no se hizo, que **lo ingresado no se perdió**, cómo reintentar |
| Validación | Inline en el campo + resumen en el formulario al enviar | Ver [validation-feedback.md](validation-feedback.md) y [feedback-channels.md](feedback-channels.md#formularios) |
| Recurso inexistente / sin permiso | Página o región dedicada (not found, forbidden) | Qué pasó y a dónde ir |
| Sesión vencida | Diálogo o redirección que **preserva** el trabajo en curso | Reingresar y volver al mismo lugar |

Reglas:

- **Nunca perder input**: tras un error, el formulario conserva lo escrito y el botón vuelve a estar habilitado.
- Clasificar antes de mostrar: error de red (reintentar), del usuario (corregir), de permisos (pedir acceso), del servidor (reintentar más tarde). Cada clase tiene un copy y una acción distintos.
- No mostrar mensajes crudos del proveedor, stack traces ni ids internos; sí un código o id de referencia corto que soporte pueda buscar.
- Reintentos automáticos solo para operaciones idempotentes y con límite; mostrar que se está reintentando.

## Offline y datos desactualizados

- Avisar con un **banner persistente** mientras dure ("Sin conexión. Los cambios se guardarán al reconectar" o "Mostrando datos de hace 2 horas") y quitarlo solo al recuperarse.
- Marcar los ítems pendientes de sincronizar y no fingir éxito de algo que no llegó al servidor.
- Si una acción no puede funcionar offline, deshabilitarla con el motivo visible, no dejar que falle.

## Copy de los estados

- **Qué pasó + qué hacer ahora.** "No pudimos guardar los cambios. Revisá tu conexión y probá de nuevo." mejor que "Error 500".
- Botones con verbo + objeto: "Crear curso", "Guardar cambios", "Eliminar 3 pagos". Evitar "Aceptar", "OK", "Enviar" genéricos, sobre todo en diálogos destructivos.
- Sin culpa ni alarma: "Ese email ya está registrado" y no "Email inválido!!". Sin jerga técnica (`null`, `timeout`, `403`).
- Sentence case, frases cortas, sin signos de exclamación en errores.
- Mismo término para el mismo concepto en toda la app ("miembro" en todos lados, no "miembro", "usuario" y "participante").
- El idioma y el tono los define el producto; las fuentes de UX writing del proyecto mandan.

## Anti-patrones

- Pantalla en blanco mientras carga o cuando la lista está vacía.
- Spinner de página completa para una acción en un botón.
- Volver al skeleton en cada recarga, perdiendo scroll y contexto.
- Mostrar "No hay resultados" mientras todavía está cargando o cuando el pedido falló.
- Empty state de primera vez cuando el vacío es por un filtro.
- Error genérico sin reintento, o que reemplaza toda la pantalla incluida la navegación.
- Borrar el formulario después de un error.
- Toast como único lugar donde aparece un error que el usuario necesita resolver.
