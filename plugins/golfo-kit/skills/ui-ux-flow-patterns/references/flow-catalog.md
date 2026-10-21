# Catálogo de flujos

Por tipo de flujo: componentes típicos, estados críticos, feedback esperado y productos que lo resuelven bien. Los nombres de componentes son roles: usar el equivalente de la librería del proyecto. Para qué mostrar en cada estado, ver [state-matrix.md](state-matrix.md); para el canal de cada evento, [feedback-channels.md](feedback-channels.md).

## Contenido

- [Colección: lista, tabla o grilla](#colección-lista-tabla-o-grilla)
- [Búsqueda](#búsqueda)
- [Detalle de un recurso](#detalle-de-un-recurso)
- [Formulario de creación o edición](#formulario-de-creación-o-edición)
- [Wizard, onboarding y flujos de varios pasos](#wizard-onboarding-y-flujos-de-varios-pasos)
- [Acción destructiva o masiva](#acción-destructiva-o-masiva)
- [Upload de archivos](#upload-de-archivos)
- [Dashboard](#dashboard)
- [Settings](#settings)
- [Autenticación](#autenticación)
- [Pago y checkout](#pago-y-checkout)
- [Inbox y notificaciones](#inbox-y-notificaciones)
- [Chat y tiempo real](#chat-y-tiempo-real)
- [Acciones rápidas: toggles, likes, favoritos](#acciones-rápidas-toggles-likes-favoritos)

## Colección: lista, tabla o grilla

- **Componentes**: header con título + contador + acción primaria ("Nuevo …"); toolbar con búsqueda, filtros (chips removibles de los activos) y orden; tabla (datos comparables, columnas) o lista/cards (contenido heterogéneo o visual); paginación numerada con total, o "Cargar más"/scroll infinito para feeds; selección con barra de acciones masivas; menú de acciones por fila.
- **Estados críticos**: carga inicial y recarga al filtrar o paginar ([Carga](state-matrix.md#carga)); vacío de primera vez y vacío por filtro ([Vacío](state-matrix.md#vacío)); error de la tabla ([Error](state-matrix.md#error)).
- **Feedback**: el ítem nuevo aparece en la lista ([Con datos](state-matrix.md#con-datos)); archivar, borrar y acciones masivas según [Confirmar o deshacer](feedback-channels.md#confirmar-o-deshacer).
- **Detalles que marcan diferencia**: header de tabla y barra de acciones masivas fijos al scrollear; filtros, orden y página en la URL; volver del detalle a la misma posición; números alineados a la derecha; fila entera clickeable con un link real para abrir en otra pestaña.
- **Referencias**: GitHub Issues (filtros como query editable, contadores abiertos/cerrados), Linear (vistas guardadas, atajos, optimistic UI), Stripe Dashboard (chips de estado, filtros por fecha y monto).

## Búsqueda

- **Componentes**: input con icono, botón de limpiar y atajo (`/` o `Cmd+K`); dropdown de sugerencias con resultados agrupados, término resaltado y navegación con flechas; recientes al enfocar el campo vacío; opción "Buscar '…'" al final; página de resultados con contador y filtros.
- **Estados críticos**: foco con campo vacío (recientes o sugeridas, nunca un dropdown vacío); escribiendo (debounce ~200–300 ms, cancelar pedidos viejos para que una respuesta lenta no pise a la nueva); sin resultados ([Vacío](state-matrix.md#vacío)), con corrección del término si aplica; error que conserva el término ([Error](state-matrix.md#error)).
- **Feedback**: contador de resultados anunciado como mensaje de estado ([Accesibilidad del feedback](feedback-channels.md#accesibilidad-del-feedback)).
- **Referencias**: Algolia/DocSearch (resultados agrupados, recientes y favoritos), Linear y Vercel (`Cmd+K` como paleta de comandos que también ejecuta acciones), Slack (filtros por persona, canal y fecha).

## Detalle de un recurso

- **Componentes**: breadcrumb o "Volver" al listado; título con estado (chip) y acciones primarias; secciones o tabs; panel lateral de metadatos; actividad o historial.
- **Estados críticos**: carga del título y de las secciones ([Carga](state-matrix.md#carga)); not found cuando el recurso no existe y sin permiso cuando existe y no puede verse; secciones que cargan y fallan por separado ([Error](state-matrix.md#error)).
- **Feedback**: edición inline con guardado por campo; cambios de estado visibles en el chip y en la actividad. Canal de cada uno en [Tabla de decisión](feedback-channels.md#tabla-de-decisión).
- **Referencias**: Stripe (página de un pago con timeline de eventos), Linear (issue con propiedades en el panel y edición inline), Notion (propiedades como base de datos editable).

## Formulario de creación o edición

- **Componentes**: labels visibles (no solo placeholder), help text antes del error, campos agrupados con títulos, opcionales marcados (o requeridos, lo que sea minoría), botón primario con verbo + objeto y secundario "Cancelar"; drawer o diálogo para formularios cortos sin salir del contexto, página para los largos.
- **Estados críticos**: inicial (valores por defecto razonables, foco en el primer campo), validación, enviando, error del servidor y éxito según [Formularios](feedback-channels.md#formularios) y [Error](state-matrix.md#error).
- **Feedback**: ver [Formularios](feedback-channels.md#formularios). Al crear: navegar al recurso nuevo o mostrarlo en la lista. Al editar: quedarse en la pantalla.
- **Detalles**: avisar cambios sin guardar al salir; autosave para documentos; no deshabilitar el botón de envío sin decir qué falta (mejor dejarlo activo y mostrar los errores al enviar).
- **Referencias**: GOV.UK (labels claros, error summary con links a campos, "Check your answers"), Stripe Checkout (validación al salir del campo, formato automático de tarjeta).

## Wizard, onboarding y flujos de varios pasos

- **Componentes**: stepper o indicador "Paso 2 de 4" con títulos de pasos; una pregunta o tema por paso; "Atrás" que conserva lo cargado y "Continuar"; paso de revisión ("Revisá tus datos") con links "Cambiar"; página de confirmación con qué sigue. Para onboarding de producto: checklist corto (≤5 ítems) persistente y salteable, datos de ejemplo o plantillas, tours de ≤5 pasos que se pueden saltar y reabrir.
- **Estados críticos**: progreso guardado al salir (autosave o "Guardar y seguir después"); validación por paso antes de avanzar; error al enviar al final sin perder pasos previos ([Error](state-matrix.md#error)); pasos salteados que quedan pendientes en el checklist en vez de perderse.
- **Feedback**: el stepper marca completados; la confirmación final es una página ([Tabla de decisión](feedback-channels.md#tabla-de-decisión)).
- **Referencias**: GOV.UK (one thing per page, check answers, confirmation page con número de referencia), Stripe Connect onboarding (pasos con estado y retomar luego), Notion/Linear (onboarding con plantillas y workspace de ejemplo).

## Acción destructiva o masiva

- **Componentes**: acción en menú secundario o zona de peligro (no al lado del primario); botón con estilo destructivo; diálogo de confirmación o toast con deshacer según [la regla](feedback-channels.md#confirmar-o-deshacer); papelera o archivo.
- **Estados críticos**: pending del botón del diálogo ([Carga](state-matrix.md#carga)); error que deja el diálogo abierto con el motivo ([Error](state-matrix.md#error)); éxito parcial en masivas ("Se eliminaron 18 de 20. 2 no se pudieron eliminar: ver") con acceso a los fallidos.
- **Referencias**: Gmail (archivar + "Deshacer"), GitHub (escribir el nombre del repo para borrarlo, danger zone), Primer (guía de borrado sin confirmación para acciones reversibles).

## Upload de archivos

- **Componentes**: drop zone con borde visible, estado de hover al arrastrar y botón/`input type=file` de respaldo; tipos y tamaño máximo visibles **antes** de elegir; lista por archivo con nombre, tamaño, progreso, estado y acciones (cancelar, reintentar, quitar); preview de imágenes.
- **Estados críticos**: validación al seleccionar (tipo y tamaño, antes de subir); progreso por archivo ([Carga](state-matrix.md#carga)); fallo individual con reintento sin rehacer el lote; éxito parcial del lote; offline o red lenta ([Offline y datos desactualizados](state-matrix.md#offline-y-datos-desactualizados)).
- **Feedback**: estado anunciado como mensaje de estado ([Accesibilidad del feedback](feedback-channels.md#accesibilidad-del-feedback)); al terminar, el archivo aparece donde se usa.
- **Referencias**: Google Drive (panel de subidas con progreso por archivo y reanudación), Dropbox, GitHub (arrastrar imagen al editor con placeholder "Uploading…" en el texto).

## Dashboard

- **Componentes**: KPIs con valor, período y comparación; gráficos con período seleccionable; listas de "requiere atención"; cada widget en su propio boundary.
- **Estados críticos**: carga, vacío y error por widget ([Carga](state-matrix.md#carga), [Vacío](state-matrix.md#vacío), [Error](state-matrix.md#error)), con el vacío explicado en vez de un cero engañoso; datos desactualizados ([Offline y datos desactualizados](state-matrix.md#offline-y-datos-desactualizados)).
- **Referencias**: Stripe (resumen con comparación de períodos), Vercel (estado de deployments con tiempo relativo), Plausible (métricas simples con período en la URL).

## Settings

- **Componentes**: navegación por secciones; cada sección con su guardado explícito, o guardado por control para toggles; zona de peligro separada al final.
- **Estados críticos**: cambios sin guardar visibles (botón habilitado solo con cambios, aviso al salir); guardando y error por sección ([Formularios](feedback-channels.md#formularios), [Error](state-matrix.md#error)); toggles que fallan vuelven a su valor con el motivo.
- **Feedback**: toggle con efecto inmediato y formulario con botón según [Tabla de decisión](feedback-channels.md#tabla-de-decisión) y [Formularios](feedback-channels.md#formularios).
- **Referencias**: GitHub settings (secciones con su botón, danger zone), Linear (preferencias con efecto inmediato).

## Autenticación

- **Componentes**: un formulario mínimo; proveedores sociales; "Mostrar contraseña"; recuperar contraseña; mensajes que no revelan si una cuenta existe cuando eso importa para la seguridad.
- **Estados críticos**: enviando; credenciales incorrectas (mensaje genérico, input conservado salvo la contraseña); cuenta bloqueada o no verificada con la salida concreta; sesión vencida que vuelve al lugar donde estaba el usuario ([Error](state-matrix.md#error)).
- **Referencias**: Slack y Notion (magic link con pantalla "Revisá tu email" que dice a qué dirección se envió y permite reenviar), GitHub (2FA con alternativas visibles).

## Pago y checkout

- **Componentes**: resumen del pedido siempre visible con total final (sin sorpresas al último paso); campos con formato automático; métodos guardados; botón con el monto ("Pagar $12.000").
- **Estados críticos**: procesando ([Carga](state-matrix.md#carga)) con aviso de no cerrar; rechazo con el motivo accionable (fondos, datos, otro medio) según [Error](state-matrix.md#error); resultado pendiente o asíncrono (transferencia, revisión) con qué esperar; éxito con página de confirmación y comprobante.
- **Feedback**: la confirmación es una página dedicada (y email) según [Tabla de decisión](feedback-channels.md#tabla-de-decisión).
- **Referencias**: Stripe Checkout, Mercado Pago Checkout, Shopify checkout (total visible, validación al salir del campo, estados de pago pendiente).

## Inbox y notificaciones

- **Componentes**: badge de no leídas en el acceso; lista con leído/no leído distinguible; acciones rápidas (marcar leído, archivar) con deshacer; filtros (todas, menciones, no leídas); "Marcar todo como leído".
- **Estados críticos**: vacío vaciado por el usuario ([Vacío](state-matrix.md#vacío)); nuevas notificaciones mientras se mira la lista (aviso "3 nuevas" para insertarlas, sin mover lo que el usuario está leyendo).
- **Referencias**: GitHub notifications (agrupación por repo, done + undo), Gmail (inbox cero, archivar + deshacer), Linear inbox.

## Chat y tiempo real

- **Componentes**: composer que conserva el borrador; mensajes con estados enviando/enviado/fallido; indicador de escribiendo; presencia; separadores de fecha y "nuevos mensajes".
- **Estados críticos**: mensaje fallido con "Reintentar" ([Error](state-matrix.md#error)); reconexión ([Offline y datos desactualizados](state-matrix.md#offline-y-datos-desactualizados)) y resincronización; historial paginado hacia arriba sin saltos de scroll; llegada de mensajes con el scroll fuera del final (aviso "Nuevos mensajes ↓" en vez de saltar).
- **Referencias**: Slack, WhatsApp Web, Discord (estados de envío y reconexión).

## Acciones rápidas: toggles, likes, favoritos

- **Componentes**: el control mismo cambia de estado al instante (optimistic), con contador si aplica.
- **Estados críticos**: falla del servidor que revierte el control con un toast de error breve ([Error](state-matrix.md#error)); clics repetidos coalescidos.
- **Feedback**: el cambio del control es el feedback, sin toast de éxito ([Tabla de decisión](feedback-channels.md#tabla-de-decisión)).
- **Implementación**: ver la skill `optimistic-action-mutations`.
- **Referencias**: Linear (cambios de estado instantáneos), GitHub (star), X/Instagram (like).
