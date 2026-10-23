# Modos de ejecución por capacidades del agente

El prompt del loop (`SKILL.md`, «Prompt») está escrito para Claude Code: `Monitor` como disparador, cron de `/loop` como respaldo, `Agent` para subagentes y `PushNotification` para avisos. Este archivo define cómo correr **el mismo prompt** cuando faltan esas herramientas. Las equivalencias generales y el protocolo detectar → verificar → alternativa → desactivar y reportar viven en [`agent-capabilities.md`](../../../references/agent-capabilities.md).

## Elegir el modo (por capacidades, no por nombre del agente)

Antes del paso (0) del prompt, verificá en la lista de herramientas de la sesión:

| Modo | Requiere (todas verificadas en la sesión) | Típico en |
|---|---|---|
| **A. Monitor + cron** (original) | `Monitor`, `CronCreate`, `CronList`, `CronDelete`, `TaskStop` | Claude Code interactivo |
| **B. Watcher en background** | Un proceso en background que avisa al terminar (`terminal` con `background` + `notify`/`notify_on_complete`) y una herramienta para esperarlo o matarlo (`process`/`process_manage` con `wait` y `kill`) | Hermes |
| **C. Una ronda por invocación** | Nada de lo anterior | Codex CLI, `claude -p`, otros agentes |

Si falta una sola herramienta de un modo, ese modo no aplica: bajá al siguiente. No mezcles modos en una misma corrida.

## Garantías que se mantienen en todos los modos

Viven en el estado del PR (`.codex-autofix/processed-<PR>.json`) y en comprobaciones síncronas contra GitHub, así que no dependen del mecanismo de espera:

- **Dedup por PR**: `processedCommentIds`, `inFlight`, `delegationReplyIds` y `outcomes` se leen y escriben igual. El loop principal sigue siendo el único escritor.
- **Tope de rondas** (`reviewRounds` contra `{{MAX_REVIEW_ROUNDS}}`) y **tope de solo tests** (`testOnlyRounds`): persisten entre invocaciones, así que relanzar no los resetea.
- **Gates de merge**: review limpia de Codex para el head actual y GATE DE CI del paso (5-bis), evaluados en el momento del merge. Nunca se mergea con CI roja, checks pendientes ni hallazgos abiertos.
- **Guard de auto-cancelación**: el paso «GUARD» corre primero en cada vuelta.

## Modo A — Monitor + cron (Claude Code)

El prompt tal cual, sin cambios.

## Modo B — Watcher en background (Hermes)

Reemplaza el paso (0) y el cron de respaldo por ciclos de un watcher acotado:

1. **Armar**: lanzá en background, con aviso al terminar, el script de esta skill
   `bash <skill-dir>/scripts/wait-for-pr-event.sh --repo {{OWNER}}/{{REPO}} --pr {{PR}} --poll-seconds {{MONITOR_POLL_SEC}} --timeout-seconds {{WATCH_TIMEOUT_SEC}}`
   (en Hermes: `terminal(command=..., background=true, notify=true)`; usá el nombre de parámetro que muestre el schema). Guardá el `session_id` del proceso. Debe haber **un solo** watcher vivo por PR: antes de armar otro, listá los procesos y reutilizá el existente.
2. **Al recibir el aviso** (o con `process wait` y `timeout` ≤ `{{WATCH_TIMEOUT_SEC}}`), leé el código de salida:
   - `0` (evento) o `3` (timeout): corré **una** iteración completa del prompt desde el GUARD. El timeout cumple el rol del cron de respaldo: en esa vuelta se evalúan los TTL (`{{CODEX_ACK_TIMEOUT_MIN}}`, `{{CODEX_FIX_TTL_MIN}}`, `{{INFLIGHT_TTL_MIN}}`) y los reintentos de merge.
   - `5` (PR no `OPEN`): auto-cancelá (el GUARD lo confirma) y terminá.
   - `4` (GitHub no disponible) o `2` (uso inválido): no rearmes; reportá el error con la salida del script y terminá.
3. **Rearmar** tras cada iteración mientras el loop siga vivo, contando ciclos. Tope: `{{MAX_WATCH_CYCLES}}` ciclos por sesión. Al alcanzarlo, terminá con un mensaje «loop detenido por tope de ciclos: relanzá la skill para seguir» (el estado del JSON se conserva).
4. **Auto-cancelar** = matar el watcher vivo (`process kill`) y avisar en el chat. No hay cron que borrar.
5. **Subagentes**: `delegate_task` (en paralelo con `tasks[]`) en lugar de `Agent`. Mueren con la sesión padre: antes de terminar, esperá a los que estén vivos o detenelos y dejá sus ids en `inFlight` para que el TTL los libere.
6. **Avisos**: cada `PushNotification` del prompt se reemplaza por una línea en el mensaje del chat.

No uses `cronjob` como respaldo: cada disparo corre en una sesión nueva sin acceso a los subagentes ni al watcher de esta sesión, así que no puede reconciliar `inFlight` ni cancelar el loop.

## Modo C — Una ronda por invocación (Codex y otros agentes)

Corré el prompt **una sola vez**, sin el paso (0) ni el paso (7):

- **Bloqueado en este modo**: armar monitores o crons, `/loop`, `sleep` en bucle, procesos en background que sobrevivan al turno, y frases como «sigo escuchando». Si te descubrís a punto de esperar un evento futuro, cortá la ronda.
- **Subagentes**: si la sesión tiene subagentes con espera (`spawn_agent` + `wait_agent` en Codex), lanzalos y **esperalos dentro del turno**; si no, aplicá `fix-in-ephemeral-clone` en contexto, grupo por grupo. Ningún subagente local queda vivo al terminar. Los pedidos `@codex fix` sí quedan en `inFlight`, porque se reconcilian contra GitHub en la próxima invocación.
- **Merge**: igual que el original, solo si en esta ronda se cumplen la review limpia del head y el GATE DE CI. Con checks pendientes no esperes: terminá y dejalo para la próxima invocación.
- **Cierre**: el mensaje final incluye la línea de resumen del paso (6-bis), qué quedó pendiente (por ejemplo «`@codex review` posteado, esperando a Codex») y cómo relanzar: «volvé a invocar `codex-autofix-loop` para el PR {{PR}} cuando Codex responda».
- **Avisos**: cada `PushNotification` se reemplaza por una línea del mensaje final.

## Variables de los modos B y C

- `{{WATCH_TIMEOUT_SEC}}` = `300` — presupuesto de cada ciclo del watcher (también marca cada cuánto se evalúan los TTL).
- `{{MAX_WATCH_CYCLES}}` = `72` — ciclos por sesión en el modo B (≈ 6 h con el timeout por defecto).

## Limitaciones del agente (reportar al cierre)

| Modo | Desactivado | Motivo | Alternativas evaluadas |
|---|---|---|---|
| B | Cron de respaldo | No hay cron de sesión; `cronjob` corre en sesiones nuevas | Watcher con timeout como respaldo |
| B | Supervisión después de cerrar la sesión | El watcher y los subagentes mueren con la sesión (igual que en Claude Code) | Workflow `codex-autofix.yml` del repo |
| C | Escucha continua del PR | No hay herramienta que despierte al agente después del turno | Watcher en foreground dentro del turno: descartado porque bloquearía el turno sin supervisión del usuario |
| C | Relanzado automático tras `@codex review` (paso 7) | Ídem | Relanzar a mano o usar el workflow `codex-autofix.yml` |
