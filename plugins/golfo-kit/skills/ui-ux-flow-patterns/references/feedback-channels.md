# Canales de feedback

Fuente única de qué canal usar para cada evento, cuándo confirmar o deshacer y cómo hacerlo accesible. Los criterios salen de las guías de Material, Carbon, Polaris, Primer, GOV.UK y NN/g citadas en [sources.md](sources.md).

## Contenido

- [Canales](#canales)
- [Tabla de decisión](#tabla-de-decisión)
- [Toasts](#toasts)
- [Confirmar o deshacer](#confirmar-o-deshacer)
- [Formularios](#formularios)
- [Accesibilidad del feedback](#accesibilidad-del-feedback)

## Canales

Ordenados de menos a más interruptivo:

| Canal | Persistencia | Para qué |
|---|---|---|
| **Cambio directo de la UI** | — | La acción se ve en su resultado: el ítem aparece en la lista, el toggle cambia, el contador sube. Es el mejor feedback; muchas veces no hace falta otro. |
| **Inline junto al control** | Hasta que se resuelve | Estado de un control o campo: pending del botón, "Guardado" al lado de un autosave, error de un campo. |
| **Badge / indicador** | Mientras dure el estado | Conteos y estados de un objeto ("3 sin leer", chip "Pendiente"). No es interactivo ni reemplaza un mensaje. |
| **Toast / snackbar** | Se va solo (con pausa al hover/foco) | Confirmación breve de una acción que no está a la vista, o el "Deshacer" de una acción reversible aunque su resultado sí se vea, con como mucho **una** acción (normalmente "Deshacer" o "Ver"). |
| **Banner / alerta inline de página o sección** | Hasta que se resuelve o se descarta | Condición persistente que afecta a la página: offline, plan vencido, integración desconectada, error que hay que resolver, aviso del sistema. |
| **Diálogo modal** | Bloquea hasta decidir | Decisión que el usuario **tiene** que tomar ahora: confirmar algo irreversible, resolver un conflicto, sesión vencida. |
| **Página / región dedicada** | Es el estado | Not found, sin permiso, error total, confirmación final de un proceso largo (pago realizado, solicitud enviada). |

## Tabla de decisión

Recorrer en orden y quedarse con la primera respuesta que aplique:

1. **¿Es el cierre exitoso de un flujo largo o con consecuencias?** (pago, envío de solicitud, alta de cuenta) → página o paso de confirmación con qué pasó, qué sigue y un comprobante.
2. **¿El usuario tiene que decidir antes de seguir y la acción no se puede deshacer?** → diálogo de confirmación ([confirmar o deshacer](#confirmar-o-deshacer)).
3. **¿Es sobre un campo o control concreto?** (validación, guardado de un campo, pending) → inline junto al control.
4. **¿El resultado ya se ve en pantalla donde el usuario está mirando y la acción no necesita "Deshacer"?** (el ítem aparece, el valor cambia) → cambio directo de la UI, sin toast. Agregar un toast acá es ruido. **Excepción:** si es una acción reversible que se hace de inmediato y se ofrece deshacer (archivar, mover, quitar una etiqueta, mandar a la papelera; ver [confirmar o deshacer](#confirmar-o-deshacer)), el cambio directo de la UI va acompañado de un toast con "Deshacer" aunque el resultado esté a la vista: ese toast no confirma, da la salida.
5. **¿Falló una acción y el usuario ya no está en el contexto donde la hizo?** → toast de error **con acción** ("Reintentar") que no se descarta solo, o un banner si el problema persiste.
6. **¿Es una condición que sigue vigente y requiere atención o acción?** (error que persiste, offline, falta configurar algo, cuota casi llena) → banner en la página o sección afectada. No toast: un toast que desaparece no sirve para algo que sigue pasando.
7. **¿Es la confirmación de una acción que salió bien pero cuyo resultado no está a la vista?** (se envió una invitación, se archivó y el ítem desapareció, se copió al portapapeles, terminó un proceso en segundo plano) → toast, con "Deshacer" si la acción es reversible.
8. **¿Es un conteo o estado de un objeto?** → badge o chip.

Si dos canales parecen válidos, elegir el **menos interruptivo** que garantiza que el usuario lo vea y pueda actuar.

## Toasts

Usar cuando:

- confirman una acción completada fuera de la vista o en segundo plano;
- ofrecen deshacer una acción reversible recién hecha;
- avisan que terminó un proceso largo que el usuario dejó corriendo.

No usar para:

- errores de validación o de un campo (van inline);
- información crítica que hay que leer o resolver (va en banner o diálogo);
- confirmar algo que ya es visible en pantalla (salvo para ofrecer "Deshacer" de una acción reversible: ahí el toast es la vía de deshacer, no una confirmación redundante);
- mensajes largos (más de ~1–2 líneas) o con más de una acción;
- reemplazar el estado de error de una región que no cargó.

Reglas:

- Mostrar de a uno; si se encolan, agrupar ("3 pagos archivados") en vez de apilar diez.
- Duración: ~4–6 s para confirmaciones, ~5–10 s si tienen "Deshacer"; pausar el temporizador con hover o foco. **Los toasts de error con acción no se descartan solos.**
- Copy corto con objeto concreto: "Invitación enviada a ana@…", no "Operación exitosa".
- Tipo por intención: neutro (acuse de una acción), éxito (resultado esperado), info, advertencia, error. Si el proyecto define su propio mapa de tipos (por ejemplo un `toast.promise` para escrituras async), usar ese.
- Para escrituras async, preferir el patrón loading → éxito/error en un solo toast (promise) en lugar de un toast de "Guardando…" y otro de "Guardado".
- La acción de un toast tiene que ser alcanzable con teclado antes de que desaparezca, y no puede ser el único camino a esa acción (ofrecer también deshacer desde la papelera o el historial).

## Confirmar o deshacer

| Situación | Patrón |
|---|---|
| Reversible y frecuente (archivar, mover, quitar una etiqueta, marcar leído) | Hacer **de inmediato** + toast con "Deshacer" (5–10 s). Sin diálogo: los diálogos frecuentes se aceptan por reflejo. |
| Reversible con papelera o soft delete | Hacer + toast "Movido a la papelera" con "Deshacer"; borrado definitivo desde la papelera. |
| Irreversible y de impacto moderado | Diálogo con título que nombra el objeto ("¿Eliminar el curso 'Álgebra'?"), consecuencia concreta ("Se borrarán 12 lecciones y el progreso de 40 alumnos"), botón destructivo con verbo y objeto ("Eliminar curso") y foco inicial en "Cancelar". |
| Irreversible y de alto impacto (borrar cuenta, organización, base de datos) | Diálogo que pide **escribir el nombre** del recurso para habilitar el botón. |
| Envío que no se puede editar después (mensaje, pago) | Ventana de "Deshacer" corta antes de enviar de verdad (estilo "Deshacer envío" de Gmail) o paso de revisión previo. |
| Acción masiva destructiva | Indicar cuántos ítems afecta en el botón y en la confirmación ("Eliminar 23 pagos"). |

Nunca confirmar con "¿Estás seguro?" + "Sí / No": el diálogo tiene que poder entenderse leyendo solo el botón.

## Formularios

- Validar al salir del campo (blur) o al enviar, no mientras se escribe; si se valida en vivo, esperar a que el usuario deje de tipear (~500 ms) y nunca marcar error en un campo que todavía no tocó.
- Mostrar el error **junto al campo** (debajo, asociado con `aria-describedby`), con texto que dice cómo corregirlo, y no solo con color.
- Al enviar con errores: resumen arriba del formulario con links a cada campo y foco en el resumen o en el primer campo con error.
- Al corregir, el error del campo desaparece en el momento (no esperar a reenviar).
- Botón de envío en pending mientras se procesa; volver a habilitarlo ante error, conservando lo escrito.
- Al guardar bien: si el usuario se queda en la pantalla, inline "Cambios guardados" o toast; si se navega al resultado, el resultado es el feedback (más un toast si el objeto nuevo no es obvio).
- Formularios largos: avisar antes de salir con cambios sin guardar; autosave con indicador "Guardando… / Guardado" cuando el flujo lo permite.

## Accesibilidad del feedback

- Mensajes de estado (WCAG 4.1.3) anunciados sin mover el foco: el contenedor `role="status"` / `aria-live="polite"` existe **antes** de que llegue el mensaje y el texto se inyecta dentro. `role="alert"` (assertive) solo para errores urgentes.
- Diálogos: foco al abrir en el primer control seguro (Cancelar en destructivos), foco atrapado dentro, `Escape` cierra, foco vuelve al disparador al cerrar.
- Estado y error nunca solo por color: icono + texto ("Error:" o el mensaje).
- Spinners y skeletons con texto accesible del estado; el botón en pending conserva su nombre accesible (o lo cambia a "Guardando…").
- Animaciones de entrada y salida dentro de lo que defina el proyecto y respetando `prefers-reduced-motion`.
