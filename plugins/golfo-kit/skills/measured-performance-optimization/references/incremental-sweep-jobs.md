# Jobs periódicos: barrido incremental con cursor monótono

## Qué es el problema

Un job periódico (cron, driver o worker con tick fijo) relee en cada corrida una ventana completa (por ejemplo, todas las fuentes de las últimas 24 h) para encontrar lo poco que cambió. El costo y la demora crecen con el tamaño de la ventana y no con la cantidad de filas nuevas.

Ejemplo: la ventana ocupa S páginas, cada tick procesa una página y el job certifica ("todo lo anterior a T ya se examinó") recién al terminar el barrido completo. Una fila nueva espera entre S+1 y 2S ticks, según en qué página del barrido en curso entre: si llega justo después de que el barrido pasó por su posición, tiene que esperar a que termine ese barrido y al siguiente. Con la ventana creciendo, la demora crece sin que haya más trabajo real.

## Detectar

- Un job que pagina por toda la ventana en cada corrida y casi todo lo que lee sale `existing`, `unchanged`, `skipped` o equivalente.
- La latencia de punta a punta (evento → efecto del job) crece con el tamaño de la ventana o con la cantidad de filas, no con las filas nuevas.
- Un corte de certificación o marca de "procesado hasta" que se ancla al inicio del barrido completo.
- Una página fija por tick con un presupuesto de corrida que no alcanza para recorrer la ventana.

## Medir antes

- Filas examinadas frente a filas nuevas por corrida (la proporción muestra cuánto trabajo es redundante).
- Páginas por barrido y ticks por barrido.
- Demora de punta a punta (evento → certificación o efecto) frente a la cantidad de filas de la ventana: medirla con al menos dos tamaños de ventana para mostrar que crece con ella.
- Tiempo y queries por corrida, con la misma data y el mismo entorno que se usarán después (paso 3 de la skill).

## Corregir: barrido incremental

**Frontera persistida y monótona.** Guardar la última posición examinada como una tupla de orden completa (por ejemplo, `created_at, id`, más las columnas que hagan falta para que el orden sea total). La frontera solo avanza, y el storage tiene que impedir que retroceda (por ejemplo, `UPDATE ... SET frontier = $new WHERE frontier < $new` o un `CHECK`/trigger), para que dos corridas concurrentes o un deploy viejo no la pisen hacia atrás.

**Horizonte fijo por barrido.** Al empezar, cada barrido fija un horizonte (`now`) y lee solo lo que está después de la frontera y hasta ese horizonte, paginando con keyset sobre la misma tupla (`WHERE (created_at, id) > ($frontier_created_at, $frontier_id) AND created_at <= $horizon ORDER BY created_at, id`). Al terminar, la frontera avanza al horizonte. Un barrido sin novedades también certifica: avanza la frontera hasta el horizonte aunque no haya leído ninguna fila.

**Reintentos solo de lo que falló.** Las filas que no se pudieron procesar (fuente no disponible, error transitorio) van a una tabla de reintentos aparte, que se reexamina una vez por barrido. Con eso:

- La certificación se limita a justo antes del reintento pendiente más antiguo: `certified_until = min(horizon, oldest_pending_retry - ε)`. La frontera de lectura puede avanzar, pero lo que se declara "terminado" no puede saltar por encima de un fallo pendiente.
- Excluir de la lectura de filas nuevas las que ya tienen reintento pendiente, para no examinar dos veces lo mismo en un barrido.
- Una fila sale de la tabla de reintentos cuando se procesa bien o cuando se descarta de forma explícita (con log y motivo), nunca en silencio.

## Riesgo principal: confirmaciones tardías

Una transacción fija el timestamp de una fila (`created_at = now()`) y confirma tarde. Mientras tanto, el barrido leyó hasta un horizonte posterior a ese timestamp y avanzó la frontera: la fila aparece detrás de la frontera y ningún barrido la vuelve a leer. Es una pérdida silenciosa, no una demora.

Opciones, de mejor a peor:

1. **Fence de lock.** Elegir una fila de lock que todo escritor y el lector compartan (por ejemplo, la fila padre o una fila de control por partición). Todo escritor toma `FOR SHARE` sobre ella **antes** de fijar el timestamp; el lector toma `FOR UPDATE` sobre la misma fila **antes** de leer el reloj para fijar el horizonte, en `READ COMMITTED`. El `FOR UPDATE` espera a que confirmen o aborten los escritores en curso, así que cualquier fila con timestamp ≤ horizonte ya es visible cuando el lector la busca, y los escritores que empiezan después obtienen un timestamp posterior al horizonte. En `REPEATABLE READ` o superior el snapshot puede ser anterior al lock y el fence no protege. Ojo con el reloj: en Postgres `now()` devuelve el inicio de la transacción, que puede ser anterior al lock; ambos lados tienen que tomar el timestamp después del lock (`clock_timestamp()` o el lock como primera sentencia de la transacción).
2. **xmin del snapshot.** Limitar el horizonte con la transacción activa más antigua (`pg_snapshot_xmin(pg_current_snapshot())` en Postgres, o el equivalente del motor) y registrar el xid de cada fila. Funciona sin tocar a los escritores, pero es más complejo, depende del motor y una transacción larga no relacionada frena todo el barrido.
3. **Margen de tiempo** (leer hasta `now - margen`). Solo es correcto si existe un límite real de duración de transacción que garantice que nada confirma más tarde que el margen. `idle_in_transaction_session_timeout` no lo garantiza: corta sesiones ociosas, no transacciones activas ni largas. `statement_timeout` tampoco acota la transacción completa. Sin ese límite, el margen solo baja la probabilidad de perder filas y agrega demora fija.

**Red de seguridad.** Sumar, con cualquiera de las opciones, un trigger `AFTER INSERT` (y `UPDATE` de las columnas de la tupla, si pueden cambiar) que encole como reintento toda fila con timestamp ≤ horizonte ya leído (la frontera persistida). Si el fence o el xmin tienen un hueco, la fila tardía se procesa en el siguiente barrido en lugar de perderse, y el contador del trigger sirve como alerta de que el mecanismo principal falló.

## Migración desde barrido completo

Al pasar de barrido completo a incremental, inicializar la frontera y revisar el progreso derivado (certificaciones, marcas de "procesado hasta"). Si el estado anterior no registraba qué filas fallaron, no se pueden reconstruir los reintentos pendientes: reiniciar el progreso derivado (frontera al inicio de la ventana y certificación vacía) para que el primer barrido incremental relea la ventana una vez y encole los fallos, en lugar de certificar huecos.

## Alternativa más débil

Leer varias páginas por corrida (o todas las que entren en el presupuesto) acota la demora sin cambiar el modelo, pero el costo sigue siendo O(ventana) por corrida y crece con ella. Contra una base remota, con latencia por query, el barrido completo puede no entrar en el presupuesto de la corrida y la demora vuelve a crecer. Sirve como paliativo inmediato, no como solución.

## Métricas antes/después

- Filas examinadas por corrida: O(ventana) → O(filas nuevas + reintentos pendientes).
- Demora de punta a punta: de S+1 a 2S ticks → acotada por uno o dos ticks, independiente del tamaño de la ventana.
- Queries y tiempo por corrida con la misma data.

## Validar

- Un test que reproduzca la demora con el modelo anterior (por ejemplo, una ventana de más de 50 filas con página de 25 y una fila nueva que necesita más de un barrido) y pruebe con el modelo incremental que la misma fila se certifica dentro de la cota.
- Tests contra la base real (Postgres u otro motor real, no mocks del driver) para:
  - el fence: un escritor que fijó el timestamp y confirma después de que el lector pidió el lock no queda detrás de la frontera;
  - los reintentos: una fila no disponible se reintenta, bloquea la certificación hasta procesarse y no se examina dos veces en el mismo barrido;
  - la fila tardía: una inserción con timestamp ≤ frontera la encola el trigger y el siguiente barrido la procesa;
  - la monotonía: un intento de retroceder la frontera no la modifica.
