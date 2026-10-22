---
name: review-pr
description: Ejecuta una review completa del PR actual de Java orquestando los agentes de review especializados. Usar cuando se pida revisar un pull request en un proyecto Java.
---

# Review PR — Java

Run a full review of the current PR with the specialized agents and consolidate their findings in one report.

## Steps

### 1. Get the diff

```bash
gh pr diff
```

If no PR is open, compare against the remote default branch:

```bash
BASE_BRANCH="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD)"
git diff "$BASE_BRANCH"...HEAD
```

If `origin/HEAD` is not configured locally, set it with `git remote set-head origin --auto` and rerun the fallback.

### 2. Run the agents

| Agent | File |
|-------|------|
| Security scanner | `.agents/agents/security-scanner.md` |
| Performance analyzer | `.agents/agents/perf-analyzer.md` |

Also check the diff against `.agents/rules/coding-style.md` and `.agents/rules/testing.md`.

### 3. Consolidate and report

```
## PR Review — [branch name]

### Bloqueante
- [agent] [file:line] Problema — Corrección: ...

### Recomendado
- [agent] [file:line] Sugerencia.

### Sin hallazgos
- Seguridad: sin hallazgos
- Performance: sin hallazgos
```

Blocking issues must be resolved before merging.
