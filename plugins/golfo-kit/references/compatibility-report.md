# Reporte de compatibilidad entre agentes: golfo-kit

<!-- Generado desde compatibility-report.json con `pnpm compat:render`. No editar a mano: editá el JSON y regenerá. -->

> Este reporte **describe** la compatibilidad verificada; no es la fuente de verdad para decidir qué ejecutar.
> Cada skill verifica en runtime las herramientas realmente disponibles en la sesión, según [`agent-capabilities.md`](agent-capabilities.md).

## A. Resumen ejecutivo

- **Fecha de auditoría:** 2026-10-23 (generado 2026-10-23T16:59:41Z).
- **Total de skills analizadas:** 43.
- **Funcionalidades deshabilitadas:** 12.
- **Adaptaciones implementadas:** 22; verificadas: 5.
- **Problemas críticos pendientes:** ninguno.

### Agentes evaluados

| Agente | Versión | Comando | Señales de detección |
|---|---|---|---|
| Claude Code (`claude_code`) | 2.1.309 | `claude --version` | CLAUDECODE=1; CLAUDE_CODE_ENTRYPOINT; CLAUDE_CODE_SESSION_ID; herramientas Skill/ToolSearch |
| Codex CLI (`codex`) | codex-cli 0.162.1 | `codex --version` | CODEX_SESSION_ID; CODEX_THREAD_ID; CODEX_VERSION; CODEX_CI=1 en codex exec; herramientas exec_command/apply_patch |
| Hermes Agent (`hermes`) | v0.22.4 (2026.9.24) | `hermes --version` | HERMES_AGENT=true; AI_AGENT=hermes-agent; HERMES_SESSION_ID; HERMES_HOME; herramientas terminal/clarify/delegate_task |

### Skills por estado y agente

| Estado | `claude_code` | `codex` | `hermes` |
|---|---|---|---|
| `compatible` | 0 | 0 | 0 |
| `adapted` | 0 | 0 | 0 |
| `partial` | 0 | 0 | 0 |
| `incompatible` | 0 | 1 | 1 |
| `unverified` | 43 | 42 | 42 |

### Regla de derivación del estado

El estado de una skill en un agente se deriva de sus funcionalidades, en este orden:

1. `unverified` si alguna funcionalidad **obligatoria** está `unverified`.
2. `incompatible` si todas las obligatorias están `disabled` y ninguna funcionalidad (obligatoria u opcional) está `enabled` o `adapted`.
3. `partial` si alguna funcionalidad (obligatoria u opcional) está `disabled`.
4. `adapted` si alguna funcionalidad está `adapted`.
5. `compatible` en otro caso (todas las obligatorias `enabled`).

Las funcionalidades opcionales `unverified` no cambian el estado global, pero se listan como pendientes de verificar.
Una funcionalidad solo puede estar `enabled` o `adapted` si la respalda al menos una prueba `eval` o `real_run` ejecutada **en ese agente** con resultado `passed`; las pruebas `simulated_eval` (otro agente simulando este), `bats` (scripts) y `static` (inspección) no alcanzan.
Toda funcionalidad `disabled` tiene una entrada en el registro de incompatibilidades con ID `INC-<skill>--<agente>--<funcionalidad>`.

## B. Matriz global

| Skill | `claude_code` | `codex` | `hermes` |
|---|---|---|---|
| `agent-ready-setup` | `unverified` | `unverified` | `unverified` |
| `async-operation-error-handling` | `unverified` | `unverified` | `unverified` |
| `codex-autofix-loop` | `unverified` | `unverified` | `unverified` |
| `codex-comment-closeout` | `unverified` | `unverified` | `unverified` |
| `constants-refactor` | `unverified` | `unverified` | `unverified` |
| `create-issue` | `unverified` | `unverified` | `unverified` |
| `enforce-jsdoc-tsdoc` | `unverified` | `unverified` | `unverified` |
| `error-observability-diagnostics` | `unverified` | `unverified` | `unverified` |
| `feature-branch-pr` | `unverified` | `unverified` | `unverified` |
| `fix-in-ephemeral-clone` | `unverified` | `unverified` | `unverified` |
| `fix-tests-intelligently` | `unverified` | `unverified` | `unverified` |
| `functionality-check` | `unverified` | `unverified` | `unverified` |
| `generate-commit-messages` | `unverified` | `unverified` | `unverified` |
| `improve-spec` | `unverified` | `unverified` | `unverified` |
| `inline-thread-autofix` | `unverified` | `unverified` | `unverified` |
| `measured-performance-optimization` | `unverified` | `unverified` | `unverified` |
| `mobile-first-responsive-layout` | `unverified` | `unverified` | `unverified` |
| `mock-first-testing-design` | `unverified` | `unverified` | `unverified` |
| `nextjs-route-ui-boundaries` | `unverified` | `unverified` | `unverified` |
| `node-runtime-debugging` | `unverified` | `unverified` | `unverified` |
| `optimistic-action-mutations` | `unverified` | `unverified` | `unverified` |
| `pr-description-template` | `unverified` | `unverified` | `unverified` |
| `pr-inline-comment-template` | `unverified` | `unverified` | `unverified` |
| `prevent-ssr-hydration-mismatches` | `unverified` | `unverified` | `unverified` |
| `react-data-fetching-best-practices` | `unverified` | `unverified` | `unverified` |
| `react-render-performance-patterns` | `unverified` | `unverified` | `unverified` |
| `refactor-modularize-code` | `unverified` | `unverified` | `unverified` |
| `refactor-ssr-data-fetching` | `unverified` | `unverified` | `unverified` |
| `review-fix-loop` | `unverified` | `unverified` | `unverified` |
| `review-maintainability` | `unverified` | `unverified` | `unverified` |
| `review-performance` | `unverified` | `unverified` | `unverified` |
| `review-security` | `unverified` | `unverified` | `unverified` |
| `semantic-html-a11y` | `unverified` | `unverified` | `unverified` |
| `sibling-worktree` | `unverified` | `unverified` | `unverified` |
| `simplify-code` | `unverified` | `unverified` | `unverified` |
| `skill-optimizer` | `unverified` | `unverified` | `unverified` |
| `stacked-pr` | `unverified` | `unverified` | `unverified` |
| `test-best-practices` | `unverified` | `unverified` | `unverified` |
| `test-planning` | `unverified` | `unverified` | `unverified` |
| `typed-errors-refactor` | `unverified` | `unverified` | `unverified` |
| `ui-ux-flow-patterns` | `unverified` | `unverified` | `unverified` |
| `user-manual` | `unverified` | `unverified` | `unverified` |
| `widget-ui-proposals` | `unverified` | `incompatible` | `incompatible` |

## C. Análisis por skill

### `agent-ready-setup`

**Identificación**

- Nombre: Agent Ready Setup; versión: 1.4.0; SKILL.md: `plugins/golfo-kit/skills/agent-ready-setup/SKILL.md`.
- Propósito: Prepara la configuración multi-provider (Claude Code y Codex) de un repo: .claude/, .agents/, .codex/, AGENTS.md y hooks.
- Funcionalidades principales: detección de stack; bootstrap de assets; bloque gestionado de AGENTS.md; hooks y sync.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Rutas de instalación (~/.claude, $CODEX_HOME, CLAUDE_PLUGIN_ROOT) | path | sí | `claude_code`; `codex` |
| `bash`, `git`, `node`, `python` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| CLI `claude` (revisión de hooks) | command | no | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### agent-ready-setup / `claude_code`: `unverified`

Provider de destino soportado. No ejecutada en esta auditoría (las suites bats de los scripts pasan).

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `bootstrap-config` | sí | `unverified` | bootstrap.sh genera la configuración de Claude Code y Codex. | — | No ejecutada en Claude Code en esta auditoría. | Suites bats (prueba agent-ready-bats).; prueba `agent-ready-bats` |
| `provider-autodetect` | no | `unverified` | resolve-provider.sh por ruta. | — | No ejecutada en Claude Code en esta auditoría. | — |

#### agent-ready-setup / `codex`: `unverified`

Provider de destino soportado. No ejecutada en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `bootstrap-config` | sí | `unverified` | bootstrap.sh genera la configuración de Claude Code y Codex. | — | No ejecutada en Codex CLI en esta auditoría. | Suites bats (prueba agent-ready-bats).; prueba `agent-ready-bats` |
| `provider-autodetect` | no | `unverified` | resolve-provider.sh por ruta. | — | No ejecutada en Codex CLI en esta auditoría. | — |

#### agent-ready-setup / `hermes`: `unverified`

Hermes no es provider de destino; desde Hermes la inferencia de provider falla y exige AGENT_READY_SETUP_ACTIVE_PROVIDER. No ejecutada.

- Capacidades faltantes: Inferencia de provider desde $HERMES_HOME; Generación de configuración para Hermes.
- Alternativas investigadas: AGENT_READY_SETUP_ACTIVE_PROVIDER=claude|codex elegido por el usuario.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `bootstrap-config` | sí | `unverified` | bootstrap.sh genera la configuración de Claude Code y Codex. | — | No ejecutada en Hermes Agent en esta auditoría. | Suites bats (prueba agent-ready-bats).; prueba `agent-ready-bats` |
| `provider-autodetect` | no | `disabled` | — | AGENT_READY_SETUP_ACTIVE_PROVIDER elegido por el usuario. | resolve-provider.sh solo reconoce ~/.claude, $CODEX_HOME y CLAUDE_PLUGIN_ROOT; desde $HERMES_HOME termina con error. | Lectura de scripts/resolve-provider.sh. |

**Implementación**

- Adaptaciones: Sección «Compatibilidad entre agentes»: Hermes como excepción explícita y override manual.
- Archivos modificados: `plugins/golfo-kit/skills/agent-ready-setup/SKILL.md`.
- Fallback: Override manual del provider..
- Cambios de comportamiento respecto del original: Ninguno..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |
| `agent-ready-bats` | `any` | bats | `bats plugins/golfo-kit/skills/agent-ready-setup/tests/merge-instructions.bats` | `passed` | Suite de merge de instrucciones (agnóstica de agente). |

Pendiente de verificar:

- Ejecutar bootstrap real desde los tres agentes.

### `async-operation-error-handling`

**Identificación**

- Nombre: Async Operation Error Handling; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/async-operation-error-handling/SKILL.md`.
- Propósito: Diseña, implementa y revisa manejo de errores en operaciones asíncronas distribuidas (batch, jobs, polling, retries, estados terminales).
- Funcionalidades principales: clasificación de fallos parciales y upstream; preservación de progreso y reintentos; traducción de errores a copy localizado.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### async-operation-error-handling / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### async-operation-error-handling / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### async-operation-error-handling / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `codex-autofix-loop`

**Identificación**

- Nombre: Codex auto-fix loop (local, vía Claude Code); versión: 1.3.0; SKILL.md: `plugins/golfo-kit/skills/codex-autofix-loop/SKILL.md`.
- Propósito: Opera el loop que auto-fixea los comentarios de Codex en un PR hasta converger y mergear con gates.
- Funcionalidades principales: escucha de eventos del PR; triage y fix en clones efímeros; closeout de hilos; dedup y topes de rondas; merge con gates de CI y review limpia; auto-cancelación.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Monitor | monitor | no | `claude_code` |
| CronCreate / CronList / CronDelete (/loop) | scheduler | no | `claude_code` |
| TaskStop | tool | no | `claude_code` |
| terminal(background, notify) + process wait/kill | monitor | no | `hermes` |
| Subagentes (Agent / spawn_agent / delegate_task) | subagent | no | `claude_code`; `codex`; `hermes` |
| PushNotification | tool | no | `claude_code` |
| `gh` y `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| fix-in-ephemeral-clone, codex-comment-closeout | skill | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### codex-autofix-loop / `claude_code`: `unverified`

Modo A, comportamiento original sin cambios. La elección del modo pasó un eval en Claude Code; el loop completo se verifica al operarlo sobre un PR real.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `mode-selection` | sí | `enabled` | Elige el modo A cuando están Monitor, CronCreate/List/Delete y TaskStop. | — | Con las herramientas presentes, conserva el comportamiento original. | Eval en Claude Code.; prueba `eval-claude-mode-a` |
| `pr-event-watch` | sí | `unverified` | `Monitor` del PR (paso 0 del prompt). | — | No ejecutada en Claude Code en esta auditoría. El eval solo confirma la elección del modo. | Instrucción original sin cambios.; prueba `eval-claude-mode-a` |
| `backup-schedule` | no | `unverified` | Cron de sesión vía `/loop`. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `fix-round` | sí | `unverified` | Triage, agrupación, fix, closeout y dedup (pasos 1 a 6). | — | No ejecutada en Claude Code en esta auditoría. | — |
| `parallel-subagents` | no | `unverified` | Subagentes `Agent` en background por grupo de archivo. | Fix en contexto, grupo por grupo. | No ejecutada en Claude Code en esta auditoría. | — |
| `merge-gates` | sí | `unverified` | Review limpia del head + GATE DE CI antes de cualquier merge. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `round-caps` | sí | `unverified` | Topes de rondas y de rondas de solo tests persistidos. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `auto-cancel` | sí | `unverified` | Borra el cron y detiene el Monitor. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `notifications` | no | `unverified` | `PushNotification` de una línea. | Línea en el chat. | No ejecutada en Claude Code en esta auditoría. | — |

#### codex-autofix-loop / `codex`: `unverified`

Modo C (una ronda por invocación). Codex eligió el modo correcto en una corrida real; la ronda completa no se ejecutó en Codex y las evals con provider codex quedaron bloqueadas por el sandbox de Windows.

- Capacidades faltantes: Herramienta que despierte al agente después del turno (Monitor o background con aviso); Scheduler de sesión; PushNotification.
- Alternativas investigadas: exec_command + write_stdin dentro del turno (descartado: bloquea el turno sin supervisión); Automatizaciones de la app de escritorio (no verificadas desde el CLI); Relanzar `codex exec resume` desde un watcher externo (descartado: proceso sin supervisión); Workflow codex-autofix.yml del repo (persistencia real, fuera de la sesión).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `mode-selection` | sí | `enabled` | Elige el modo C (una ronda por invocación). | — | Codex eligió el modo C con sus herramientas reales. | Corrida real en Codex.; prueba `codex-real-mode-selection` |
| `pr-event-watch` | sí | `disabled` | — | Una ronda por invocación y relanzado manual. | Codex CLI no tiene herramienta que despierte al agente después del turno (confirmado en la lista de herramientas de `codex exec` 0.162.1). | Lista de herramientas de Codex.; prueba `codex-real-mode-selection` |
| `backup-schedule` | no | `disabled` | — | Relanzado manual o workflow codex-autofix.yml. | No hay cron en la sesión de Codex CLI; las automatizaciones de la app de escritorio no se verificaron desde el CLI. | Lista de herramientas de Codex.; prueba `codex-real-mode-selection` |
| `single-round` | sí | `unverified` | Modo C: una vuelta del prompt sin pasos 0 y 7; termina indicando cómo relanzar. | — | La elección del modo se verificó en Codex; la vuelta completa no se ejecutó. Eval simulado en Claude aprobado. | Eval simulado (no cuenta como evidencia en Codex).; prueba `eval-sim-codex-single-round`; prueba `eval-codex-provider` |
| `fix-round` | sí | `unverified` | Pasos 1 a 6 del prompt, igual que el original. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `parallel-subagents` | no | `unverified` | `collaboration.spawn_agent` + `wait_agent` esperando dentro del turno. | Fix en contexto, grupo por grupo. | Herramientas presentes en la sesión; no se ejecutaron. | — |
| `merge-gates` | sí | `unverified` | Mismos gates; con checks pendientes no espera y lo deja para la próxima invocación. | — | Eval simulado aprobado; no ejecutado en Codex. | prueba `eval-sim-codex-merge-gates` |
| `round-caps` | sí | `unverified` | Topes persistidos entre invocaciones. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `auto-cancel` | sí | `unverified` | No queda nada vivo que cancelar: la invocación termina. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `notifications` | no | `unverified` | Línea en el mensaje final. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `auto-relaunch` | no | `disabled` | — | Instrucción de relanzado en el cierre. | El paso (7) exige que el loop siga vivo tras `@codex review`; en Codex no hay mecanismo para seguir vivo. | agent-modes.md, modo C.; prueba `codex-real-mode-selection` |

#### codex-autofix-loop / `hermes`: `unverified`

Modo B (watcher en background). El watcher y la elección del modo funcionaron en Hermes; el loop completo (fixes, closeout, merge) no se ejecutó.

- Capacidades faltantes: Monitor; CronCreate/CronList/CronDelete de sesión; TaskStop; PushNotification.
- Alternativas investigadas: terminal(background, notify) + process_manage (adoptado); cronjob_manage con repeat (descartado: sesión nueva sin contexto ni subagentes); hermes send para avisos (no aplica a sesiones CLI).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `mode-selection` | sí | `enabled` | Elige el modo B (watcher en background). | — | Hermes eligió el modo B con sus herramientas reales. | Corrida real en Hermes.; prueba `hermes-real-mode-selection` |
| `pr-event-watch` | sí | `adapted` | `scripts/wait-for-pr-event.sh` en background con aviso, rearmado hasta MAX_WATCH_CYCLES. | Modo C si falta alguna herramienta. | Reemplaza a Monitor con un proceso acotado y supervisado. | Watcher ejecutado en Hermes con aviso y wait.; Tests bats del watcher.; prueba `hermes-real-watcher`; prueba `watcher-bats` |
| `backup-schedule` | no | `adapted` | El timeout del watcher (exit 3) dispara la vuelta que evalúa TTLs y reintentos de merge. | — | cronjob_manage corre en sesiones nuevas sin acceso a subagentes ni al watcher, así que no puede reconciliar inFlight; se descartó. | Exit 3 observado en Hermes.; prueba `hermes-real-watcher` |
| `fix-round` | sí | `unverified` | Pasos 1 a 6 del prompt. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `parallel-subagents` | no | `unverified` | `delegate_task` con `tasks[]`; los hijos mueren con la sesión. | Fix en contexto. | Herramienta presente; no ejecutada. | — |
| `merge-gates` | sí | `unverified` | Mismos gates. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `round-caps` | sí | `unverified` | Topes persistidos. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `auto-cancel` | sí | `unverified` | Mata el watcher vivo. | — | kill no se ejercitó en la prueba real (el watcher terminó por timeout). | — |
| `notifications` | no | `unverified` | Línea en el chat. | — | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Selección de modo por capacidades (A/B/C); Script portable `wait-for-pr-event.sh` con timeout, tope de polls y códigos de salida; Modo B para Hermes con rearmado acotado (MAX_WATCH_CYCLES); Modo C de una ronda por invocación; Casos de eval por agente.
- Archivos modificados: `plugins/golfo-kit/skills/codex-autofix-loop/SKILL.md`, `plugins/golfo-kit/skills/codex-autofix-loop/references/agent-modes.md`, `plugins/golfo-kit/skills/codex-autofix-loop/scripts/wait-for-pr-event.sh`, `plugins/golfo-kit/skills/codex-autofix-loop/tests/wait-for-pr-event.bats`, `plugins/golfo-kit/skills/codex-autofix-loop/evals/eval-config.json`.
- Fallback: Modo C: una ronda por invocación, sin esperas, con instrucciones para relanzar..
- Cambios de comportamiento respecto del original: Ninguno en Claude Code (modo A). En Hermes la espera usa el watcher y no hay cron; en Codex no hay escucha continua ni relanzado automático..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `watcher-bats` | `any` | bats | `bats plugins/golfo-kit/skills/codex-autofix-loop/tests/wait-for-pr-event.bats` | `passed` | 10/10: evento por head, comentario, review y checks (exit 0), tope de polls y timeout (exit 3), GitHub caído (exit 4), PR cerrado (exit 5), argumentos inválidos (exit 2). |
| `eval-claude-mode-a` | `claude_code` | eval | `run-evals <copia con solo claude-with-monitor-keeps-original-mode> --provider claude` | `passed` | Con Monitor y cron en la sesión elige el modo A: Monitor como disparador y /loop como respaldo (3/3 aserciones). |
| `eval-sim-hermes-mode-b` | `hermes` | simulated_eval | `run-evals <copia con solo hermes-without-monitor-uses-background-watcher> --provider claude` | `passed` | Claude simulando una sesión Hermes: usa wait-for-pr-event.sh en background con aviso, tope de ciclos y kill; no planea Monitor ni CronCreate (6/6). No cuenta como evidencia en Hermes. |
| `eval-sim-codex-single-round` | `codex` | simulated_eval | `run-evals <copia con solo codex-runs-single-round-without-waiting> --provider claude` | `passed` | Claude simulando Codex: una ronda, sin esperar y con instrucciones para relanzar (4/4). No cuenta como evidencia en Codex. |
| `eval-sim-codex-merge-gates` | `codex` | simulated_eval | `run-evals <copia con solo codex-single-round-keeps-merge-gates> --provider claude` | `passed` | Claude simulando Codex: con CI pendiente no mergea ni espera y deja el merge para la próxima invocación (3/3). |
| `eval-codex-provider` | `codex` | eval | `run-evals <copia con los 4 casos nuevos> --provider codex` | `blocked` | Los 4 casos fallaron por infraestructura: `codex exec --sandbox read-only` en Windows no puede leer archivos («el acceso al archivo fue bloqueado por la política del entorno»; en la sonda directa, `CreateProcessAsUserW failed: 5 (Access is denied.)`). |
| `codex-real-mode-selection` | `codex` | real_run | `codex exec --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check "<leer SKILL.md y referencias; describir modo, herramientas y cierre sin tocar GitHub>"` | `passed` | Codex 0.162.1 leyó SKILL.md, agent-modes.md y agent-capabilities.md, eligió el modo C porque faltan Monitor/Cron/TaskStop y background con aviso, propuso collaboration.spawn_agent/wait_agent esperando dentro del turno, interrupt_agent para cancelar, notificación en el mensaje final y cierre con instrucción de relanzar. No ejecutó gh ni procesos. |
| `hermes-real-watcher` | `hermes` | real_run | `hermes chat -Q -q "<terminal(background=true, notify=true) sobre wait-for-pr-event.sh --pr 20 --poll-seconds 10 --timeout-seconds 40; process_manage wait timeout=120>"` | `passed` | Hermes 0.22.4 lanzó el watcher con mcp__terminal background=true notify=true (session_id proc_49b329b77739, notify_on_complete: true) y process_manage wait devolvió status exited, exit_code 3, stdout «TIMEOUT no event on PR #20 after 3 polls». Solo lecturas a GitHub. |
| `hermes-real-mode-selection` | `hermes` | real_run | `hermes chat -Q -q "<leer SKILL.md y referencias; describir modo y herramientas sin tocar GitHub>"` | `passed` | Hermes eligió el modo B (mcp__terminal background+notify, process_manage diferido), propuso delegate_task con tasks[], kill del watcher y delegate_task stop para cancelar, avisos en el chat, sin cronjob_manage; no mencionó invocar Monitor ni CronCreate. |

Pendiente de verificar:

- Claude Code: loop completo (Monitor, cron, subagentes, merge) sobre un PR real.
- Codex: una ronda completa con fixes, closeout y merge gates.
- Hermes: loop completo con delegate_task, kill del watcher y merge gates.

### `codex-comment-closeout`

**Identificación**

- Nombre: Cierre de comentarios de Codex; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/codex-comment-closeout/SKILL.md`.
- Propósito: Plantilla y checklist para responder, reaccionar y resolver comentarios de Codex en un PR.
- Funcionalidades principales: variantes Resuelto / Sin cambios / No pude aplicar; reacción y resolución del hilo; verificación del body publicado.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### codex-comment-closeout / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### codex-comment-closeout / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### codex-comment-closeout / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `constants-refactor`

**Identificación**

- Nombre: Constants Refactor; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/constants-refactor/SKILL.md`.
- Propósito: Analiza y refactoriza constantes, literales funcionales y contratos cross-layer.
- Funcionalidades principales: detección de hardcodes; movimiento a constants/; validación del refactor.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### constants-refactor / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### constants-refactor / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### constants-refactor / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `create-issue`

**Identificación**

- Nombre: Create Issue; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/create-issue/SKILL.md`.
- Propósito: Genera la descripción estructurada de una issue a partir de la explicación del usuario.
- Funcionalidades principales: estructura de issue de planificación.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### create-issue / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### create-issue / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### create-issue / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `enforce-jsdoc-tsdoc`

**Identificación**

- Nombre: enforce-jsdoc-tsdoc; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/enforce-jsdoc-tsdoc/SKILL.md`.
- Propósito: Agrega o actualiza JSDoc/TSDoc donde aporta a la lectura.
- Funcionalidades principales: reglas de ubicación y tags; omisión de documentación redundante.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### enforce-jsdoc-tsdoc / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### enforce-jsdoc-tsdoc / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### enforce-jsdoc-tsdoc / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `error-observability-diagnostics`

**Identificación**

- Nombre: Error Observability Diagnostics; versión: sin versión declarada; SKILL.md: `plugins/golfo-kit/skills/error-observability-diagnostics/SKILL.md`.
- Propósito: Diseña y revisa trazabilidad operativa de errores (logs estructurados, sinks, correlación).
- Funcionalidades principales: detección de sinks reales; feedback con reporte; redacción segura.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### error-observability-diagnostics / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### error-observability-diagnostics / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### error-observability-diagnostics / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `feature-branch-pr`

**Identificación**

- Nombre: Feature Branch + Commit + Push + PR; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/feature-branch-pr/SKILL.md`.
- Propósito: Lleva los cambios de la rama a un PR: rama feature/*, commit, push, PR y resumen.
- Funcionalidades principales: creación de rama; commit y push; apertura del PR con pr-description-template.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### feature-branch-pr / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### feature-branch-pr / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### feature-branch-pr / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `fix-in-ephemeral-clone`

**Identificación**

- Nombre: Fix Issue Efímero Clone; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/fix-in-ephemeral-clone/SKILL.md`.
- Propósito: Ejecuta fixes en un clone efímero depth-1 y publica la rama autorizada sin hacer closeout.
- Funcionalidades principales: clone efímero; fix y validación; commit y push con reintegración; cleanup.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` y `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| Subagente con handle (modo background) | subagent | no | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### fix-in-ephemeral-clone / `claude_code`: `unverified`

Clone, validación y push usan solo git y shell; el modo background depende de un subagente con handle. No ejecutada en Claude Code en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `in-context-fix` | sí | `unverified` | Workflow completo en el contexto actual. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `background-mode` | no | `unverified` | `Agent` con handle. | in_context o HANDOFF_EXECUTOR_MISSING. | No ejecutada en Claude Code en esta auditoría. | — |

#### fix-in-ephemeral-clone / `codex`: `unverified`

Clone, validación y push usan solo git y shell; el modo background depende de un subagente con handle. No ejecutada en Codex CLI en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: spawn_agent.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `in-context-fix` | sí | `unverified` | Workflow completo en el contexto actual. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `background-mode` | no | `unverified` | `spawn_agent` + `wait_agent`. | in_context o HANDOFF_EXECUTOR_MISSING. | No ejecutada en Codex CLI en esta auditoría. | — |

#### fix-in-ephemeral-clone / `hermes`: `unverified`

Clone, validación y push usan solo git y shell; el modo background depende de un subagente con handle. No ejecutada en Hermes Agent en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: delegate_task.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `in-context-fix` | sí | `unverified` | Workflow completo en el contexto actual. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `background-mode` | no | `unverified` | `delegate_task`. | in_context o HANDOFF_EXECUTOR_MISSING. | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Sección «Compatibilidad entre agentes» para el modo background.
- Archivos modificados: `plugins/golfo-kit/skills/fix-in-ephemeral-clone/SKILL.md`.
- Fallback: Modo in_context..
- Cambios de comportamiento respecto del original: Ninguno..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar un fix real en Claude Code.
- Ejecutar un fix real en Codex CLI.
- Ejecutar un fix real en Hermes Agent.

### `fix-tests-intelligently`

**Identificación**

- Nombre: fix-tests-intelligently; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/fix-tests-intelligently/SKILL.md`.
- Propósito: Diagnostica tests rotos o flaky sin ajustar aserciones a ciegas.
- Funcionalidades principales: decidir si el fix va en el test o en la implementación.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### fix-tests-intelligently / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### fix-tests-intelligently / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### fix-tests-intelligently / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `functionality-check`

**Identificación**

- Nombre: Functionality Check; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/functionality-check/SKILL.md`.
- Propósito: Determina si las capacidades de una spec están implementadas y alcanzables en el código.
- Funcionalidades principales: cobertura con evidencia; gaps exactos.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### functionality-check / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### functionality-check / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### functionality-check / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `generate-commit-messages`

**Identificación**

- Nombre: Generate Commit Messages; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/generate-commit-messages/SKILL.md`.
- Propósito: Reúne contexto, redacta y aplica el mensaje de commit.
- Funcionalidades principales: análisis del diff; commit.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### generate-commit-messages / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### generate-commit-messages / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### generate-commit-messages / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `improve-spec`

**Identificación**

- Nombre: Improve Spec; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/improve-spec/SKILL.md`.
- Propósito: Mejora specs de docs/specs/ resolviendo ambigüedades, completando secciones y dejando tasks ejecutables.
- Funcionalidades principales: selección del spec; preguntas de ambigüedad; exploración del codebase; aprobación y guardado.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Herramienta de preguntas (AskUserQuestion / clarify / request_user_input en modo Plan) | tool | no | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### improve-spec / `claude_code`: `unverified`

La pregunta en texto se verificó en una sesión headless sin AskUserQuestion; la ruta nativa con AskUserQuestion y el flujo completo no se ejecutaron.

- Capacidades faltantes: AskUserQuestion en sesiones headless (claude -p, sdk-cli).
- Alternativas investigadas: AskUserQuestion (sesiones interactivas).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-user-choices` | sí | `adapted` | Fallback en texto en sesión headless; AskUserQuestion en sesiones interactivas. | Pregunta en texto con opciones numeradas y detenerse. | Verificado el fallback; la ruta nativa no. | Ver pruebas.; prueba `eval-claude-no-question-tool` |
| `spec-improvement` | sí | `unverified` | Pasos 2 a 8: análisis, exploración, generación y guardado. | — | No ejecutada en Claude Code en esta auditoría. | — |

#### improve-spec / `codex`: `unverified`

Pregunta en texto y se detiene (request_user_input solo existe en modo Plan); verificado en una corrida real. El flujo completo no se ejecutó.

- Capacidades faltantes: request_user_input fuera del modo Plan.
- Alternativas investigadas: request_user_input en modo Plan.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-user-choices` | sí | `adapted` | Pregunta en texto y detenerse; request_user_input solo en modo Plan. | Pregunta en texto con opciones numeradas y detenerse. | Verificado en Codex real. | Ver pruebas.; prueba `codex-real-ask-fallback` |
| `spec-improvement` | sí | `unverified` | Pasos 2 a 8: análisis, exploración, generación y guardado. | — | No ejecutada en Codex CLI en esta auditoría. | — |

#### improve-spec / `hermes`: `unverified`

Usa clarify; si devuelve undelivered (por ejemplo en `hermes chat -Q -q`) pregunta en texto y se detiene. Verificado en una corrida real; el flujo completo no se ejecutó.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: clarify (máx. 4 choices).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-user-choices` | sí | `adapted` | `clarify`; fallback en texto ante undelivered/timed_out/cancelled. | Pregunta en texto con opciones numeradas y detenerse. | Verificado en Hermes real. | Ver pruebas.; prueba `hermes-real-clarify-fallback` |
| `spec-improvement` | sí | `unverified` | Pasos 2 a 8: análisis, exploración, generación y guardado. | — | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Sección «Compatibilidad entre agentes»: herramienta de preguntas por agente y fallback en texto con detención.
- Archivos modificados: `plugins/golfo-kit/skills/improve-spec/SKILL.md`, `plugins/golfo-kit/skills/improve-spec/evals/eval-config.json`.
- Fallback: Pregunta en texto con opciones numeradas y detención hasta la respuesta..
- Cambios de comportamiento respecto del original: Antes, sin AskUserQuestion la skill preguntaba en texto pero no exigía detenerse; ahora no avanza ni guarda hasta la respuesta..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `eval-claude-no-question-tool` | `claude_code` | eval | `run-evals <copia con no-question-tool-asks-in-text-and-stops> --provider claude` | `passed` | Sesión headless de Claude Code (claude -p, sin AskUserQuestion): pregunta en texto con opciones numeradas y se detiene sin generar el spec (5/5). |
| `eval-claude-clarify-undelivered` | `hermes` | simulated_eval | `run-evals <copia con hermes-clarify-undelivered-falls-back-to-text> --provider claude` | `passed` | Claude simulando Hermes con clarify undelivered: repite en texto, no guarda y reporta la limitación (3/3). |
| `eval-codex-provider` | `codex` | eval | `run-evals <copia con los 2 casos nuevos> --provider codex` | `blocked` | Fallo de infraestructura: el sandbox read-only de Codex en Windows no permite leer SKILL.md. |
| `codex-real-ask-fallback` | `codex` | real_run | `codex exec --dangerously-bypass-approvals-and-sandbox -C <repo temporal con 3 specs> "<seguir SKILL.md y correr /improve-spec sin argumento>"` | `passed` | Codex listó docs/specs, preguntó en texto con 3 opciones numeradas y se detuvo; reportó que request_user_input requiere modo Plan. Los specs quedaron sin cambios. |
| `hermes-real-clarify-fallback` | `hermes` | real_run | `hermes chat -Q --in <repo temporal con 3 specs> -q "<seguir SKILL.md y correr /improve-spec sin argumento>"` | `passed` | Hermes llamó a clarify, que devolvió outcome "undelivered" con la sugerencia de elegir por su cuenta; siguiendo la sección de compatibilidad preguntó en texto con 3 opciones y se detuvo. `git status` limpio. |

Pendiente de verificar:

- Flujo completo (pasos 2 a 8) en los tres agentes.
- Ruta nativa con AskUserQuestion en Claude Code interactivo.

### `inline-thread-autofix`

**Identificación**

- Nombre: Inline Thread Autofix; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/inline-thread-autofix/SKILL.md`.
- Propósito: Orquesta el feedback de un hilo o review de PR: pregunta el entorno, aplica el fix y hace el closeout.
- Funcionalidades principales: pregunta del entorno; preflight y stack; handoff a fix-in-ephemeral-clone o sibling-worktree; closeout del hilo.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Herramienta de preguntas | tool | no | `claude_code`; `codex`; `hermes` |
| Subagente con handle (modo background) | subagent | no | `claude_code`; `codex`; `hermes` |
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### inline-thread-autofix / `claude_code`: `unverified`

Adaptaciones documentadas para la pregunta del entorno y el modo background; no ejecutada en Claude Code en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-environment` | sí | `unverified` | `AskUserQuestion`. | Pregunta en texto y detención. | No ejecutada en Claude Code en esta auditoría. | — |
| `background-handoff` | no | `unverified` | `Agent` con handle. | Modo in_context. | No ejecutada en Claude Code en esta auditoría. | — |
| `pr-closeout` | sí | `unverified` | Reply, reacción y resolución del hilo con gh. | — | No ejecutada en Claude Code en esta auditoría. | — |

#### inline-thread-autofix / `codex`: `unverified`

Adaptaciones documentadas para la pregunta del entorno y el modo background; no ejecutada en Codex CLI en esta auditoría.

- Capacidades faltantes: request_user_input fuera del modo Plan.
- Alternativas investigadas: request_user_input en modo Plan; spawn_agent.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-environment` | sí | `unverified` | Texto y detención; `request_user_input` solo en modo Plan. | Pregunta en texto y detención. | No ejecutada en Codex CLI en esta auditoría. | — |
| `background-handoff` | no | `unverified` | `spawn_agent` + `wait_agent`. | Modo in_context. | No ejecutada en Codex CLI en esta auditoría. | — |
| `pr-closeout` | sí | `unverified` | Reply, reacción y resolución del hilo con gh. | — | No ejecutada en Codex CLI en esta auditoría. | — |

#### inline-thread-autofix / `hermes`: `unverified`

Adaptaciones documentadas para la pregunta del entorno y el modo background; no ejecutada en Hermes Agent en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: clarify; delegate_task.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-environment` | sí | `unverified` | `clarify`; texto ante undelivered/timed_out/cancelled. | Pregunta en texto y detención. | No ejecutada en Hermes Agent en esta auditoría. | — |
| `background-handoff` | no | `unverified` | `delegate_task`. | Modo in_context. | No ejecutada en Hermes Agent en esta auditoría. | — |
| `pr-closeout` | sí | `unverified` | Reply, reacción y resolución del hilo con gh. | — | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Sección «Compatibilidad entre agentes»: pregunta por agente con fallback en texto; background solo con handle real.
- Archivos modificados: `plugins/golfo-kit/skills/inline-thread-autofix/SKILL.md`.
- Fallback: Pregunta en texto con detención; modo in_context..
- Cambios de comportamiento respecto del original: Ninguno en Claude Code; en otros agentes la pregunta puede ser en texto..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar con una URL de hilo real en Claude Code.
- Ejecutar con una URL de hilo real en Codex CLI.
- Ejecutar con una URL de hilo real en Hermes Agent.

### `measured-performance-optimization`

**Identificación**

- Nombre: Measured Performance Optimization; versión: 1.2.0; SKILL.md: `plugins/golfo-kit/skills/measured-performance-optimization/SKILL.md`.
- Propósito: Mide y optimiza rendimiento web con evidencia.
- Funcionalidades principales: medición antes/después; optimizaciones de bundle, renders, caching y N+1.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### measured-performance-optimization / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### measured-performance-optimization / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### measured-performance-optimization / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `mobile-first-responsive-layout`

**Identificación**

- Nombre: Mobile First Responsive Units; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/mobile-first-responsive-layout/SKILL.md`.
- Propósito: Guía de unidades y patrones mobile-first en CSS/SCSS.
- Funcionalidades principales: unidades fluidas; breakpoints.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### mobile-first-responsive-layout / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### mobile-first-responsive-layout / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### mobile-first-responsive-layout / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `mock-first-testing-design`

**Identificación**

- Nombre: Mock First Testing Design; versión: 2.0.0; SKILL.md: `plugins/golfo-kit/skills/mock-first-testing-design/SKILL.md`.
- Propósito: Decide cómo aislar dependencias en tests sin contaminar el código de producción.
- Funcionalidades principales: integración real primero; dobles solo en puertos de dominio.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### mock-first-testing-design / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### mock-first-testing-design / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### mock-first-testing-design / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `nextjs-route-ui-boundaries`

**Identificación**

- Nombre: Next.js: boundaries de UI por ruta; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/nextjs-route-ui-boundaries/SKILL.md`.
- Propósito: Decide loading, error, layouts, Suspense y server/client en Next.js App Router.
- Funcionalidades principales: boundaries por ruta; APIs de Next.js.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### nextjs-route-ui-boundaries / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### nextjs-route-ui-boundaries / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### nextjs-route-ui-boundaries / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `node-runtime-debugging`

**Identificación**

- Nombre: Debugging runtime de Node.js; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/node-runtime-debugging/SKILL.md`.
- Propósito: Depura servidores Node.js/BFF con node --inspect y requests reales.
- Funcionalidades principales: inspección de valores runtime.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `node` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### node-runtime-debugging / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### node-runtime-debugging / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### node-runtime-debugging / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `optimistic-action-mutations`

**Identificación**

- Nombre: Optimistic Action Mutations; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/optimistic-action-mutations/SKILL.md`.
- Propósito: Patrones de mutaciones optimistas con reconciliación y rollback.
- Funcionalidades principales: debounce y coalescing; rollback seguro.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### optimistic-action-mutations / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### optimistic-action-mutations / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### optimistic-action-mutations / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `pr-description-template`

**Identificación**

- Nombre: PR Description Template; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/pr-description-template/SKILL.md`.
- Propósito: Define el título y la descripción estándar de PR (y el modo traceability-only), incluidas capturas de UI.
- Funcionalidades principales: título y body con plantilla; conteo de archivos; capturas de UI desde el navegador del usuario; modo traceability-only.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| Claude in Chrome (mcp__claude-in-chrome__*) | mcp | no | `claude_code` |

**Compatibilidad por agente**

#### pr-description-template / `claude_code`: `unverified`

Plantilla y body por gh; capturas con Claude in Chrome. No ejecutada todavía en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `pr-body` | sí | `unverified` | Plantilla y gh pr create/edit. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `ui-screenshots` | no | `unverified` | Capturas desde Claude in Chrome. | Omitir capturas. | Requiere un cambio de UI y la extensión conectada; no ejecutado. | — |

#### pr-description-template / `codex`: `unverified`

Plantilla y body por gh; sin Claude in Chrome las capturas se omiten y se declara. No ejecutada.

- Capacidades faltantes: Claude in Chrome.
- Alternativas investigadas: browser headless o integrado (prohibidos por la skill para capturas publicadas).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `pr-body` | sí | `unverified` | Plantilla y gh pr create/edit. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `ui-screenshots` | no | `disabled` | — | Omitir capturas y declararlo en las notas para el revisor. | La skill exige el navegador real del usuario vía Claude in Chrome y prohíbe navegadores headless. | Lista de herramientas de la sesión. |

#### pr-description-template / `hermes`: `unverified`

Plantilla y body por gh; sin Claude in Chrome las capturas se omiten y se declara. No ejecutada.

- Capacidades faltantes: Claude in Chrome.
- Alternativas investigadas: toolset browser (no es el navegador del usuario).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `pr-body` | sí | `unverified` | Plantilla y gh pr create/edit. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `ui-screenshots` | no | `disabled` | — | Omitir capturas y declararlo en las notas para el revisor. | La skill exige el navegador real del usuario vía Claude in Chrome y prohíbe navegadores headless. | Lista de herramientas de la sesión. |

**Implementación**

- Adaptaciones: Sección «Agent compatibility»: omitir capturas sin Claude in Chrome y declararlo.
- Archivos modificados: `plugins/golfo-kit/skills/pr-description-template/SKILL.md`.
- Fallback: Sin capturas, declarado..
- Cambios de comportamiento respecto del original: Ninguno en Claude Code..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Abrir un PR real con la plantilla en Claude Code.
- Abrir un PR real con la plantilla en Codex CLI.
- Abrir un PR real con la plantilla en Hermes Agent.

### `pr-inline-comment-template`

**Identificación**

- Nombre: PR Inline Comment Template; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/pr-inline-comment-template/SKILL.md`.
- Propósito: Crea, formatea y publica comentarios inline de review en PRs de GitHub.
- Funcionalidades principales: plantilla de comentario; publicación inline.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### pr-inline-comment-template / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### pr-inline-comment-template / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### pr-inline-comment-template / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `prevent-ssr-hydration-mismatches`

**Identificación**

- Nombre: React SSR Hydration Consistency; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/prevent-ssr-hydration-mismatches/SKILL.md`.
- Propósito: Previene y diagnostica mismatches de hidratación SSR en React.
- Funcionalidades principales: render inicial determinista.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### prevent-ssr-hydration-mismatches / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### prevent-ssr-hydration-mismatches / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### prevent-ssr-hydration-mismatches / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `react-data-fetching-best-practices`

**Identificación**

- Nombre: React Data Fetching Best Practices; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/react-data-fetching-best-practices/SKILL.md`.
- Propósito: Buenas prácticas de data fetching en React, server-first.
- Funcionalidades principales: fetch en servidor; cancelación con AbortController.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### react-data-fetching-best-practices / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### react-data-fetching-best-practices / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### react-data-fetching-best-practices / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `react-render-performance-patterns`

**Identificación**

- Nombre: React Render Performance Patterns; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/react-render-performance-patterns/SKILL.md`.
- Propósito: Patrones de rendimiento de render y prioridad de updates en React.
- Funcionalidades principales: memoización; transiciones.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### react-render-performance-patterns / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### react-render-performance-patterns / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### react-render-performance-patterns / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `refactor-modularize-code`

**Identificación**

- Nombre: Refactor Modularity Cohesion Deduplication; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/refactor-modularize-code/SKILL.md`.
- Propósito: Refactoriza límites de módulos, cohesión y duplicación sin cambiar comportamiento.
- Funcionalidades principales: extracción de módulos; reorganización de imports.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### refactor-modularize-code / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### refactor-modularize-code / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### refactor-modularize-code / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `refactor-ssr-data-fetching`

**Identificación**

- Nombre: React SSR y BFF Data Fetching; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/refactor-ssr-data-fetching/SKILL.md`.
- Propósito: Prioriza el acceso a upstream desde el servidor y el BFF same-origin en React SSR.
- Funcionalidades principales: decisión de arquitectura de red.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### refactor-ssr-data-fetching / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### refactor-ssr-data-fetching / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### refactor-ssr-data-fetching / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `review-fix-loop`

**Identificación**

- Nombre: Review Fix Loop; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/review-fix-loop/SKILL.md`.
- Propósito: Loop de review y fix multi-provider (Claude Code y Codex como reviewers CLI) sobre cambios locales o PRs.
- Funcionalidades principales: selección de provider con fallback; rondas de review y fix; filtro adversarial; reporte final.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| CLIs `claude` y/o `codex` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| Subagente aislado read-only (filtro) | subagent | no | `claude_code` |

**Compatibilidad por agente**

#### review-fix-loop / `claude_code`: `unverified`

Filtro adversarial con Agent; providers por CLI. No ejecutada en esta auditoría.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `provider-review` | sí | `unverified` | Helper `scripts/review-fix-loop` con providers CLI. | — | No ejecutada en Claude Code en esta auditoría. | Suite shell del helper (prueba review-fix-loop-shell-suite).; prueba `review-fix-loop-shell-suite` |
| `isolated-filter` | no | `unverified` | Filtro adversarial en subagente aislado. | Filtro inline. | No ejecutada en Claude Code en esta auditoría. | — |

#### review-fix-loop / `codex`: `unverified`

Providers por CLI; filtro inline porque spawn_agent no tiene modo read-only verificado. No ejecutada.

- Capacidades faltantes: Subagente read-only verificado.
- Alternativas investigadas: spawn_agent (sin restricción read-only verificada).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `provider-review` | sí | `unverified` | Helper `scripts/review-fix-loop` con providers CLI. | — | No ejecutada en Codex CLI en esta auditoría. | Suite shell del helper (prueba review-fix-loop-shell-suite).; prueba `review-fix-loop-shell-suite` |
| `isolated-filter` | no | `disabled` | — | Filtro inline en la sesión principal. | No se verificó un modo read-only para spawn_agent. | agent-capabilities.md; documentación de Hermes (delegation). |

#### review-fix-loop / `hermes`: `unverified`

Providers por CLI; filtro inline porque delegate_task hereda los toolsets del padre. No ejecutada.

- Capacidades faltantes: Subagente read-only (delegate_task hereda toolsets).
- Alternativas investigadas: delegate_task (sin parámetro de toolsets).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `provider-review` | sí | `unverified` | Helper `scripts/review-fix-loop` con providers CLI. | — | No ejecutada en Hermes Agent en esta auditoría. | Suite shell del helper (prueba review-fix-loop-shell-suite).; prueba `review-fix-loop-shell-suite` |
| `isolated-filter` | no | `disabled` | — | Filtro inline en la sesión principal. | delegate_task no permite restringir toolsets: los hijos heredan escritura. | agent-capabilities.md; documentación de Hermes (delegation). |

**Implementación**

- Adaptaciones: Sección «Agent compatibility»: providers por `command -v`, filtro inline fuera de Claude Code.
- Archivos modificados: `plugins/golfo-kit/skills/review-fix-loop/SKILL.md`.
- Fallback: Filtro inline..
- Cambios de comportamiento respecto del original: Ninguno en Claude Code..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |
| `review-fix-loop-shell-suite` | `any` | bats | `pnpm run test:review-fix-loop` | `passed` | Suite shell del helper de providers (agnóstica de agente). |

Pendiente de verificar:

- Ejecutar una ronda real en Claude Code.
- Ejecutar una ronda real en Codex CLI.
- Ejecutar una ronda real en Hermes Agent.

### `review-maintainability`

**Identificación**

- Nombre: Review Maintainability; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/review-maintainability/SKILL.md`.
- Propósito: Revisa riesgos de mantenibilidad en el diff contra develop/main/master.
- Funcionalidades principales: concurrencia; leaks; edge cases.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### review-maintainability / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-maintainability / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-maintainability / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `review-performance`

**Identificación**

- Nombre: Review Performance; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/review-performance/SKILL.md`.
- Propósito: Revisa problemas de rendimiento con impacto en producción en el diff.
- Funcionalidades principales: N+1; complejidad; I/O ineficiente.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### review-performance / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-performance / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-performance / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `review-security`

**Identificación**

- Nombre: Review Security; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/review-security/SKILL.md`.
- Propósito: Revisa vulnerabilidades en el diff y en instrucciones de agentes.
- Funcionalidades principales: AppSec; instrucciones de IA y skills.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### review-security / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-security / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### review-security / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `semantic-html-a11y`

**Identificación**

- Nombre: Semantic HTML and Accessibility; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/semantic-html-a11y/SKILL.md`.
- Propósito: Aplica HTML semántico y accesibilidad en markup frontend.
- Funcionalidades principales: elementos nativos; aria y foco.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### semantic-html-a11y / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### semantic-html-a11y / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### semantic-html-a11y / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `sibling-worktree`

**Identificación**

- Nombre: Worktree hermano; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/sibling-worktree/SKILL.md`.
- Propósito: Gestiona worktrees hermanos persistentes reutilizando ramas existentes.
- Funcionalidades principales: crear, listar, remover y migrar worktrees.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### sibling-worktree / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### sibling-worktree / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### sibling-worktree / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `simplify-code`

**Identificación**

- Nombre: Simplify Code; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/simplify-code/SKILL.md`.
- Propósito: Revisa el diff por reuso, simplificación y eficiencia, y aplica los fixes.
- Funcionalidades principales: limpieza del diff.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### simplify-code / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### simplify-code / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### simplify-code / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `skill-optimizer`

**Identificación**

- Nombre: Skill Optimizer; versión: 1.2.0; SKILL.md: `plugins/golfo-kit/skills/skill-optimizer/SKILL.md`.
- Propósito: Optimiza skills existentes de forma medible: audita, compara baseline contra candidato y aplica solo con evidencia.
- Funcionalidades principales: modo audit; modos quick/full con evaluador held-out aislado; gate held-out.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Subagente con contexto aislado (quick/full) | subagent | no | `claude_code`; `codex`; `hermes` |
| `run-evals` con CLI `claude` o `codex` | command | no | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### skill-optimizer / `claude_code`: `unverified`

audit no depende del agente; quick/full requieren subagente aislado y run-evals.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `audit` | sí | `unverified` | Fase 1 read-only y reporte. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `isolated-evaluation` | no | `unverified` | `Agent` con handle. | Sin evaluador aislado no se aplica ningún candidato. | No ejecutada en Claude Code en esta auditoría. | — |

#### skill-optimizer / `codex`: `unverified`

audit no depende del agente; quick/full requieren subagente aislado y un CLI de run-evals (claude o codex). No ejecutada en Codex CLI.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: spawn_agent.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `audit` | sí | `unverified` | Fase 1 read-only y reporte. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `isolated-evaluation` | no | `unverified` | `spawn_agent` + `wait_agent`. | Sin evaluador aislado no se aplica ningún candidato. | No ejecutada en Codex CLI en esta auditoría. | — |

#### skill-optimizer / `hermes`: `unverified`

audit no depende del agente; quick/full requieren subagente aislado y un CLI de run-evals (claude o codex). No ejecutada en Hermes Agent.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: delegate_task (contexto nuevo).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `audit` | sí | `unverified` | Fase 1 read-only y reporte. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `isolated-evaluation` | no | `unverified` | `delegate_task`. | Sin evaluador aislado no se aplica ningún candidato. | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Sección «Compatibilidad entre agentes» para quick/full.
- Archivos modificados: `plugins/golfo-kit/skills/skill-optimizer/SKILL.md`.
- Fallback: Modo diagnóstico sin aplicar candidatos..
- Cambios de comportamiento respecto del original: Ninguno..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar audit y quick en Claude Code.
- Ejecutar audit y quick en Codex CLI.
- Ejecutar audit y quick en Hermes Agent.

### `stacked-pr`

**Identificación**

- Nombre: Stacked PRs por responsabilidad; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/stacked-pr/SKILL.md`.
- Propósito: Gestiona stacked PRs por responsabilidad con golden diff y CI por capa.
- Funcionalidades principales: división de PRs; rebase de capas.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| `git` en PATH | command | sí | `claude_code`; `codex`; `hermes` |
| `gh` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### stacked-pr / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### stacked-pr / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### stacked-pr / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `test-best-practices`

**Identificación**

- Nombre: test-best-practices; versión: 2.0.0; SKILL.md: `plugins/golfo-kit/skills/test-best-practices/SKILL.md`.
- Propósito: Estandariza tests con Vitest y Testing Library.
- Funcionalidades principales: naming y AAA; aserciones estrictas.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### test-best-practices / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### test-best-practices / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### test-best-practices / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `test-planning`

**Identificación**

- Nombre: Test Planning; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/test-planning/SKILL.md`.
- Propósito: Planifica casos y cobertura de tests antes de escribirlos.
- Funcionalidades principales: modo casos; modo cobertura.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### test-planning / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### test-planning / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### test-planning / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `typed-errors-refactor`

**Identificación**

- Nombre: Typed Errors Refactor; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/typed-errors-refactor/SKILL.md`.
- Propósito: Diseña y ejecuta refactors de errores tipados.
- Funcionalidades principales: jerarquía de errores; normalización.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### typed-errors-refactor / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### typed-errors-refactor / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### typed-errors-refactor / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `ui-ux-flow-patterns`

**Identificación**

- Nombre: UI/UX por flujo: componentes, estados y feedback; versión: 1.0.0; SKILL.md: `plugins/golfo-kit/skills/ui-ux-flow-patterns/SKILL.md`.
- Propósito: Define componentes, estados y feedback por flujo de UI.
- Funcionalidades principales: estados loading/vacío/error; toast, banner, diálogo.
- Agentes soportados declarados: no declara.

**Dependencias**

Sin dependencias específicas de agente detectadas por inspección.

**Compatibilidad por agente**

#### ui-ux-flow-patterns / `claude_code`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Claude Code durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Claude Code en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### ui-ux-flow-patterns / `codex`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Codex CLI durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Codex CLI en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

#### ui-ux-flow-patterns / `hermes`: `unverified`

Sin dependencias específicas de agente detectadas por inspección. No se ejecutó en Hermes Agent durante esta auditoría, así que su funcionamiento no está verificado.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `core-workflow` | sí | `unverified` | Instrucciones de la skill; no usa herramientas específicas de agente. | — | Sin dependencias específicas detectadas por inspección; no ejecutada en Hermes Agent en esta auditoría. | Inspección estática (prueba static-inspection).; prueba `static-inspection` |

**Implementación**

- Adaptaciones: ninguna.
- Archivos modificados: ninguno.
- Fallback: ninguno.
- Cambios de comportamiento respecto del original: ninguno.

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Ejecutar la skill en Claude Code con un caso real.
- Ejecutar la skill en Codex CLI con un caso real.
- Ejecutar la skill en Hermes Agent con un caso real.

### `user-manual`

**Identificación**

- Nombre: User Manual Generator; versión: 2.4.0; SKILL.md: `plugins/golfo-kit/skills/user-manual/SKILL.md`.
- Propósito: Genera o actualiza manuales de usuario HTML autocontenidos con capturas reales de la app.
- Funcionalidades principales: preguntas de dispositivo, idiomas y repo; mapa de visibilidad; HTML con DESIGN.md; capturas reales; publicación.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| Herramienta de preguntas | tool | no | `claude_code`; `codex`; `hermes` |
| Herramienta JavaScript de navegador (capturas) | tool | no | `claude_code`; `codex`; `hermes` |
| `node`, `python` en PATH | command | sí | `claude_code`; `codex`; `hermes` |

**Compatibilidad por agente**

#### user-manual / `claude_code`: `unverified`

Preguntas adaptadas por agente con fallback en texto; capturas con la herramienta JavaScript de navegador del agente o mockups dibujados. No ejecutada en Claude Code.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-device-languages` | sí | `unverified` | `AskUserQuestion`. | Pregunta en texto y detención. | No ejecutada en Claude Code en esta auditoría. | — |
| `manual-generation` | sí | `unverified` | Pasos 1 a 5 con los helpers de scripts/. | — | No ejecutada en Claude Code en esta auditoría. | — |
| `real-app-captures` | no | `unverified` | frame-driver.js + capture-bridge.py desde el navegador del agente. | Mockups dibujados (mockup-body), declarados en el reporte. | No ejecutada en Claude Code en esta auditoría. | — |

#### user-manual / `codex`: `unverified`

Preguntas adaptadas por agente con fallback en texto; capturas con la herramienta JavaScript de navegador del agente o mockups dibujados. No ejecutada en Codex CLI.

- Capacidades faltantes: request_user_input fuera del modo Plan.
- Alternativas investigadas: request_user_input en modo Plan.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-device-languages` | sí | `unverified` | Texto y detención; `request_user_input` solo en modo Plan. | Pregunta en texto y detención. | No ejecutada en Codex CLI en esta auditoría. | — |
| `manual-generation` | sí | `unverified` | Pasos 1 a 5 con los helpers de scripts/. | — | No ejecutada en Codex CLI en esta auditoría. | — |
| `real-app-captures` | no | `unverified` | frame-driver.js + capture-bridge.py desde el navegador del agente. | Mockups dibujados (mockup-body), declarados en el reporte. | No ejecutada en Codex CLI en esta auditoría. | — |

#### user-manual / `hermes`: `unverified`

Preguntas adaptadas por agente con fallback en texto; capturas con la herramienta JavaScript de navegador del agente o mockups dibujados. No ejecutada en Hermes Agent.

- Capacidades faltantes: ninguna.
- Alternativas investigadas: clarify; toolset browser.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `ask-device-languages` | sí | `unverified` | `clarify`; texto ante undelivered/timed_out/cancelled. | Pregunta en texto y detención. | No ejecutada en Hermes Agent en esta auditoría. | — |
| `manual-generation` | sí | `unverified` | Pasos 1 a 5 con los helpers de scripts/. | — | No ejecutada en Hermes Agent en esta auditoría. | — |
| `real-app-captures` | no | `unverified` | frame-driver.js + capture-bridge.py desde el navegador del agente. | Mockups dibujados (mockup-body), declarados en el reporte. | No ejecutada en Hermes Agent en esta auditoría. | — |

**Implementación**

- Adaptaciones: Sección «Agent compatibility»: preguntas por agente con fallback en texto y detención.
- Archivos modificados: `plugins/golfo-kit/skills/user-manual/SKILL.md`.
- Fallback: Pregunta en texto con detención..
- Cambios de comportamiento respecto del original: Ninguno en Claude Code..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |
| `design-tokens-bats` | `any` | bats | `bats plugins/golfo-kit/skills/user-manual/tests/check-design-tokens.bats` | `passed` | Suite del chequeo de tokens de DESIGN.md (agnóstica de agente). |

Pendiente de verificar:

- Generar un manual real en Claude Code.
- Generar un manual real en Codex CLI.
- Generar un manual real en Hermes Agent.

### `widget-ui-proposals`

**Identificación**

- Nombre: Widget-driven UI/UX proposals & previews; versión: 1.1.0; SKILL.md: `plugins/golfo-kit/skills/widget-ui-proposals/SKILL.md`.
- Propósito: Muestra propuestas y previews de UI como widgets visuales interactivos antes de escribir código.
- Funcionalidades principales: grid de propuestas aplicables; preview del resultado; aplicar e iterar.
- Agentes soportados declarados: no declara.

**Dependencias**

| Dependencia | Tipo | Obligatoria | Agentes que la tienen |
|---|---|---|---|
| mcp__visualize__show_widget / read_me | mcp | sí | — |

**Compatibilidad por agente**

#### widget-ui-proposals / `claude_code`: `unverified`

El widget existe solo en sesiones Claude con el conector visualize; no está en la sesión headless de Claude Code usada en esta auditoría, así que no se verificó.

- Capacidades faltantes: mcp__visualize__show_widget en la sesión probada.
- Alternativas investigadas: ninguna.

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `render-widget` | sí | `unverified` | Widget interactivo. | — | La herramienta no está en la sesión headless probada; no se probó en una sesión con el conector. | — |
| `apply-proposal` | no | `unverified` | Botón Aplicar del widget. | — | Depende del widget. | — |

#### widget-ui-proposals / `codex`: `incompatible`

No existe ninguna herramienta equivalente (confirmado en la lista de herramientas de Codex). La skill se detiene y lo reporta.

- Capacidades faltantes: mcp__visualize__show_widget.
- Alternativas investigadas: HTML estático o texto (descartados: cambian sustancialmente el comportamiento).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `render-widget` | sí | `disabled` | — | Detenerse y reportar; propuestas en texto solo si el usuario lo pide explícitamente. | La herramienta no existe en el agente. | Lista de herramientas de la sesión. |
| `apply-proposal` | no | `disabled` | — | El usuario elige en texto. | Depende del widget. | Lista de herramientas de la sesión. |

#### widget-ui-proposals / `hermes`: `incompatible`

No existe ninguna herramienta equivalente (confirmado en la lista de herramientas de Hermes). La skill se detiene y lo reporta.

- Capacidades faltantes: mcp__visualize__show_widget.
- Alternativas investigadas: HTML estático, toolset browser o texto (descartados: cambian sustancialmente el comportamiento).

| Funcionalidad | Obligatoria | Estado | Implementación | Fallback | Justificación | Evidencia |
|---|---|---|---|---|---|---|
| `render-widget` | sí | `disabled` | — | Detenerse y reportar; propuestas en texto solo si el usuario lo pide explícitamente. | La herramienta no existe en el agente. | Lista de herramientas de la sesión. |
| `apply-proposal` | no | `disabled` | — | El usuario elige en texto. | Depende del widget. | Lista de herramientas de la sesión. |

**Implementación**

- Adaptaciones: Sección «Agent compatibility»: detención y reporte sin el widget.
- Archivos modificados: `plugins/golfo-kit/skills/widget-ui-proposals/SKILL.md`.
- Fallback: Ninguno equivalente; propuestas en texto solo a pedido explícito..
- Cambios de comportamiento respecto del original: Sin el widget, la skill se detiene en lugar de improvisar..

**Verificación**

| Prueba | Agente | Tipo | Comando | Resultado | Evidencia |
|---|---|---|---|---|---|
| `static-inspection` | `any` | static | `grep -rE "AskUserQuestion\|request_user_input\|Monitor\|Cron(Create\|List\|Delete)\|PushNotification\|TaskStop\|Agent\|subagent\|mcp__\|claude -p\|codex exec\|~/.claude\|~/.codex\|apply_patch\|update_plan" plugins/golfo-kit/skills/<skill>` | `passed` | Inspección de SKILL.md, references y scripts del 2026-10-23; las coincidencias de "hook" son hooks de React o de git, no hooks de agente. |

Pendiente de verificar:

- Claude: probar en una sesión con el conector visualize.

## D. Registro de incompatibilidades

| ID | Skill | Agente | Funcionalidad | Dependencia faltante | Motivo técnico | Alternativas investigadas | Solución o bloqueo | Severidad | Estado |
|---|---|---|---|---|---|---|---|---|---|
| `INC-agent-ready-setup--hermes--provider-autodetect` | `agent-ready-setup` | `hermes` | `provider-autodetect` | Provider Hermes en resolve-provider.sh | La skill genera configuración solo para Claude Code y Codex. | agregar Hermes como provider de destino (fuera de alcance) | Excepción explícita documentada; override manual del provider. | `low` | `mitigated` |
| `INC-codex-autofix-loop--codex--pr-event-watch` | `codex-autofix-loop` | `codex` | `pr-event-watch` | Herramienta para esperar eventos después del turno | Codex CLI no expone Monitor, cron ni procesos en background que despierten al agente. | exec_command/write_stdin dentro del turno; codex exec resume desde un watcher externo; automatizaciones de la app de escritorio | Modo C: una ronda por invocación; las garantías de dedup, topes y gates se mantienen. | `medium` | `mitigated` |
| `INC-codex-autofix-loop--codex--backup-schedule` | `codex-autofix-loop` | `codex` | `backup-schedule` | Scheduler de sesión | No hay cron en Codex CLI. | automatizaciones de la app (no verificadas) | Relanzado manual; persistencia con el workflow codex-autofix.yml. | `low` | `mitigated` |
| `INC-codex-autofix-loop--codex--auto-relaunch` | `codex-autofix-loop` | `codex` | `auto-relaunch` | Mecanismo para seguir vivo tras `@codex review` | El paso (7) no es ejecutable sin espera supervisada. | ídem pr-event-watch | El cierre indica cómo relanzar; bloqueado en las instrucciones del modo C. | `low` | `mitigated` |
| `INC-codex-autofix-loop--codex--fix-round` | `codex-autofix-loop` | `codex` | `fix-round` | Evidencia de ejecución en Codex | La ronda completa no se ejecutó en Codex y `run-evals --provider codex` falla en Windows por el sandbox. | corrida real con --dangerously-bypass-approvals-and-sandbox sobre un PR de prueba | Pendiente: correr una ronda real en un PR de prueba. | `high` | `pending` |
| `INC-codex-autofix-loop--hermes--fix-round` | `codex-autofix-loop` | `hermes` | `fix-round` | Evidencia de ejecución en Hermes | Solo se ejecutaron el watcher y la elección de modo; fixes, closeout y merge no. | loop completo sobre un PR de prueba con delegate_task | Pendiente: correr el loop completo en Hermes sobre un PR de prueba. | `high` | `pending` |
| `INC-pr-description-template--codex--ui-screenshots` | `pr-description-template` | `codex` | `ui-screenshots` | Claude in Chrome | Las capturas publicadas deben salir del navegador real del usuario. | browser_use de Codex | Capturas omitidas y declaradas en el body. | `low` | `mitigated` |
| `INC-pr-description-template--hermes--ui-screenshots` | `pr-description-template` | `hermes` | `ui-screenshots` | Claude in Chrome | Las capturas publicadas deben salir del navegador real del usuario. | toolset browser de Hermes | Capturas omitidas y declaradas en el body. | `low` | `mitigated` |
| `INC-review-fix-loop--codex--isolated-filter` | `review-fix-loop` | `codex` | `isolated-filter` | Subagente aislado read-only | spawn_agent no tiene un modo read-only verificado. | spawn_agent | El filtro corre inline y se reporta en Limitaciones del agente. | `low` | `mitigated` |
| `INC-review-fix-loop--hermes--isolated-filter` | `review-fix-loop` | `hermes` | `isolated-filter` | Subagente aislado read-only | delegate_task hereda los toolsets del padre, incluida la escritura. | delegate_task | El filtro corre inline y se reporta en Limitaciones del agente. | `low` | `mitigated` |
| `INC-widget-ui-proposals--codex--render-widget` | `widget-ui-proposals` | `codex` | `render-widget` | mcp__visualize__show_widget | El conector visualize solo existe en sesiones Claude. | HTML estático; texto; browser_use | Bloqueado: la skill se detiene y reporta; no simula el widget. | `medium` | `pending` |
| `INC-widget-ui-proposals--codex--apply-proposal` | `widget-ui-proposals` | `codex` | `apply-proposal` | Botón sendPrompt del widget | Depende del render del widget. | elección en texto | Bloqueado junto con render-widget. | `low` | `pending` |
| `INC-widget-ui-proposals--hermes--render-widget` | `widget-ui-proposals` | `hermes` | `render-widget` | mcp__visualize__show_widget | El conector visualize solo existe en sesiones Claude. | HTML estático; texto; toolset browser | Bloqueado: la skill se detiene y reporta; no simula el widget. | `medium` | `pending` |
| `INC-widget-ui-proposals--hermes--apply-proposal` | `widget-ui-proposals` | `hermes` | `apply-proposal` | Botón sendPrompt del widget | Depende del render del widget. | elección en texto | Bloqueado junto con render-widget. | `low` | `pending` |

## E. Plan de acciones pendientes

| Prioridad | ID | Impacto | Acción recomendada | Criterio de resolución | Incompatibilidades |
|---|---|---|---|---|---|
| 1 | `ACT-001` | `high` | Correr codex-autofix-loop completo en Hermes (modo B) sobre un PR de prueba: delegate_task, kill del watcher, closeout y merge gates. | Prueba real_run en Hermes con fix, closeout y gates observados; features fix-round, merge-gates, round-caps y auto-cancel en adapted o enabled. | `INC-codex-autofix-loop--hermes--fix-round` |
| 2 | `ACT-002` | `high` | Correr una ronda real de codex-autofix-loop en Codex (modo C) sobre un PR de prueba. | Prueba real_run en Codex con una ronda completa terminada sin procesos vivos y con instrucción de relanzar. | `INC-codex-autofix-loop--codex--fix-round` |
| 3 | `ACT-003` | `medium` | Habilitar `run-evals --provider codex` en Windows (sandbox read-only no puede crear procesos) o correr las evals de Codex en Linux/CI. | Los casos nuevos de codex-autofix-loop e improve-spec pasan con provider codex. | — |
| 4 | `ACT-004` | `medium` | Ejecutar en Codex y Hermes las skills sin dependencias de agente con un caso real cada una, empezando por las de flujo GitHub (feature-branch-pr, stacked-pr, pr-inline-comment-template). | Cada skill tiene una prueba eval o real_run aprobada por agente y su estado pasa de unverified a compatible. | — |
| 5 | `ACT-005` | `low` | Evaluar si widget-ui-proposals debe ofrecer un entregable alternativo explícito (por ejemplo HTML de propuestas) fuera de Claude. | Decisión documentada en la skill y en este reporte. | `INC-widget-ui-proposals--codex--render-widget`; `INC-widget-ui-proposals--hermes--render-widget` |
