# Capacidades de agente: detección, equivalencias y fallbacks

Leer este archivo cuando una skill de `golfo-kit` necesite una herramienta que no todos los agentes tienen: preguntar con opciones, monitorear procesos, programar tareas, lanzar subagentes, invocar otra skill, plan/todos, widgets, hooks, MCP o rutas de configuración. Es la única fuente de verdad de estas equivalencias; cada skill lista en su sección «Compatibilidad entre agentes» solo sus adaptaciones propias.

El [reporte de compatibilidad](compatibility-report.md) describe qué se verificó por skill y por agente. **No es la fuente de verdad para decidir qué ejecutar**: en cada ejecución la skill verifica las capacidades realmente disponibles con el protocolo de abajo, aunque el reporte diga otra cosa.

## Protocolo (obligatorio en cada skill que use una capacidad de esta tabla)

1. **Detectar** el agente con las señales de [Detección](#detección). Es solo una pista para elegir qué nombre de herramienta buscar primero.
2. **Verificar la herramienta concreta**: la fuente de verdad es que la herramienta figure en la lista de herramientas de la sesión (incluidas las diferidas que se cargan con `ToolSearch`, `tool_search`/`tool_describe` o equivalente) o que el comando esté en `PATH` (`command -v <cmd>`). Los nombres varían entre builds del mismo agente (por ejemplo Hermes expone `terminal` o `mcp__terminal`, y `process` o `process_manage`); buscá por nombre base y leé el schema antes de llamar.
3. **Usar la alternativa** de la [tabla](#tabla-de-capacidades) si la herramienta preferida no está.
4. **Si no hay alternativa**, desactivar **solo** la parte que la necesita, bloquearla en la ejecución (no llamarla, no simularla, no reemplazarla por un bucle sin tope) y seguir con el resto.
5. **Reportar** al cierre una sección `Limitaciones del agente` con: capacidad faltante, parte desactivada, alternativas evaluadas y por qué no aplicaron, y cómo obtener la funcionalidad completa (por ejemplo, correr la skill en otro agente). Si no hubo limitaciones, omitir la sección.

Reglas que valen siempre:

- Nunca simular una herramienta inexistente (por ejemplo, escribir en el chat «llamé a `Monitor`» o fabricar el resultado de un subagente).
- Nunca dejar un proceso sin supervisión: todo proceso en background tiene un timeout y un dueño que lo espera o lo mata antes de terminar la sesión.
- Nunca un bucle sin tope: toda espera tiene timeout e iteraciones máximas, y su vencimiento termina con un código o mensaje explícito.
- Una falla de capacidad nunca es silenciosa: si una rama se desactivó, aparece en `Limitaciones del agente`.

## Detección

Señales verificadas en esta máquina el 2026-10-23 (ver evidencia en el [reporte](compatibility-report.md)):

| Agente | Versión probada | Variables de entorno en sus comandos de shell | Otras señales |
|---|---|---|---|
| Claude Code | 2.1.309 | `CLAUDECODE=1`, `CLAUDE_CODE_ENTRYPOINT` (`cli`, `sdk-cli`, …), `CLAUDE_CODE_SESSION_ID` | Herramientas `Read`/`Edit`/`Bash`/`Skill`/`ToolSearch`; skills en `~/.claude/skills` o plugins con `CLAUDE_PLUGIN_ROOT` |
| Codex CLI | 0.162.1 | `CODEX_SESSION_ID`, `CODEX_THREAD_ID`, `CODEX_VERSION`; `CODEX_CI=1` en `codex exec` | Herramientas `exec_command`, `write_stdin`, `apply_patch`; skills en `$CODEX_HOME/skills` (default `~/.codex`) o `~/.agents/skills` |
| Hermes Agent | 0.22.4 | `HERMES_AGENT=true`, `AI_AGENT=hermes-agent`, `HERMES_SESSION_ID`, `HERMES_HOME` | Herramientas `terminal`, `clarify`, `delegate_task`, `skill_view` (con o sin prefijo `mcp__`) |

Las variables **se heredan**: un Claude Code lanzado desde una sesión de Hermes ve a la vez `CLAUDECODE=1` y todas las `HERMES_*` (observado en esta auditoría). Por eso:

- Si hay señales de varios agentes, el agente activo es el que expone las herramientas de la sesión actual; las variables solo ordenan la búsqueda.
- Nunca decidir una rama solo por una variable: confirmar siempre con el paso 2 del protocolo.
- Sin señales reconocibles, tratar el agente como «otro» y aplicar el protocolo igual.

## Tabla de capacidades

«No verificado» significa que no se pudo confirmar en esta auditoría: tratalo como no disponible hasta verificarlo en la sesión.

| Capacidad | Claude Code | Codex CLI | Hermes | Fallback | Qué se desactiva si no hay nada |
|---|---|---|---|---|---|
| Preguntar con opciones | `AskUserQuestion` (no aparece en sesiones headless como `claude -p` o `sdk-cli`) | `request_user_input` existe pero solo en modo Plan; en el modo default y en `codex exec` no está disponible | `clarify` (`questions[1..5]` con `choices` ≤ 4 y `multi_select`); devuelve `outcome` `submitted`, `cancelled`, `timed_out` o `undelivered` | Pregunta en texto con opciones numeradas y **detenerse** a esperar la respuesta; si `clarify` devuelve `undelivered`, `timed_out` o `cancelled`, pasar a este fallback | Nada: el fallback en texto conserva la función. Sin usuario (cron, `-q` no interactivo), cortar antes de la acción que necesitaba la respuesta y reportarlo |
| Monitorear procesos o eventos | `Monitor` (stream de eventos, `timeout_ms` máx. 1 800 000) + `TaskStop` | `exec_command` + `write_stdin` permiten un proceso largo **dentro del turno**; no hay aviso al terminar el turno | `terminal(background=true, notify=true)` (en la doc, `notify_on_complete`) + `process`/`process_manage` (`poll`, `wait` con `timeout`, `kill`, `log`) | Script de espera acotada en foreground con timeout y tope de iteraciones | La espera desatendida entre turnos: la skill corre una vuelta por invocación y explica cómo relanzarla |
| Tareas programadas | `CronCreate`/`CronList`/`CronDelete` (de sesión) y `/loop` | No encontrado en la sesión de `codex exec` (la app de escritorio tiene automatizaciones, no verificadas desde el CLI) | `cronjob`/`cronjob_manage` (`create`, `list`, `remove`, `repeat`); cada disparo corre en una sesión nueva sin contexto ni preguntas | Ninguno equivalente dentro de la sesión | La recurrencia: la skill corre una vez y lo reporta |
| Subagentes | `Agent` (alias `Task`), en background con handle | `spawn_agent`/`wait_agent`/`list_agents` (`multi_agent` activo en 0.162.1) | `delegate_task` (`tasks[]` en paralelo, `action` `spawn`/`list`/`stop`); los hijos no pueden usar `clarify` ni `cronjob` y mueren con el padre | Ejecutar en el mismo contexto, secuencial | El paralelismo; si la skill exige aislamiento de contexto (evaluador held-out, verificador adversarial), esa parte se desactiva |
| Plan / todos | `TodoWrite` o `TaskCreate` según versión (ninguno apareció en la sesión `sdk-cli` probada) | `update_plan` no estaba en la sesión probada; hay `create_goal`/`update_goal`, que no son equivalentes | `todo` / `todo_list` | Lista de pasos en el mensaje | Nada |
| Worktrees | `EnterWorktree`/`ExitWorktree` + `git worktree` | `codex exec --worktree` (flag de arranque) + `git worktree` | `hermes chat --worktree` (flag de arranque) + `git worktree` | `git worktree` por shell | Nada si hay `git` |
| Widgets visuales | `mcp__visualize__show_widget` (solo Claude con ese conector; no aparece en sesiones headless) | No existe | No existe | Ninguno equivalente: un HTML estático o texto cambian el comportamiento | El render del widget |
| MCP | `claude mcp`; config en `~/.claude.json` / `.mcp.json` | `codex mcp`; `[mcp_servers]` en `$CODEX_HOME/config.toml` | `mcp_servers` en `$HERMES_HOME/config.yaml` | — | Las herramientas de ese servidor |
| Hooks | `hooks` en `settings.json` | Feature `hooks` activo; formato no verificado en esta auditoría | `hooks:` en `config.yaml` (shell hooks), `HOOK.yaml` de gateway | — | La automatización del hook; hacer la acción a mano y reportarlo |
| Rutas de config | `~/.claude` (o `$CLAUDE_CONFIG_DIR`) | `$CODEX_HOME` (default `~/.codex`) | `$HERMES_HOME` (default `~/.hermes`; `%LOCALAPPDATA%\hermes` en Windows) | Preguntar la ruta | — |
| Invocar otra skill | `Skill` / `/<skill>` | Mención `$<skill>` o leer su `SKILL.md` (la mención no se verificó en esta auditoría) | `skill_view(name)` o `/<skill>` si está instalada; `hermes chat -s <skill>` para precargar | Leer el `SKILL.md` de la skill por path y seguirlo | Nada si el archivo existe |
| Notificación push | `PushNotification` | No existe | No verificado en sesiones CLI (`hermes send` es para plataformas de mensajería) | Línea en el mensaje del chat | Nada |

## Evidencia de capacidades

El reporte guarda la evidencia de cada fila (comandos, salidas y fuentes). Las fuentes primarias usadas:

- Claude Code: lista de herramientas de una sesión `sdk-cli` y `claude --version`.
- Codex: `codex --version`, `codex exec --help`, `codex features list` y una corrida de `codex exec` que listó sus herramientas y variables de entorno.
- Hermes: `hermes --version`, `hermes chat --help`, `hermes tools list`, una corrida de `hermes chat -Q -q` con `tool_describe` de `process_manage`, `cronjob_manage` y `todo_list`, y la documentación en <https://hermes-agent.nousresearch.com/docs>.
