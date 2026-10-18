# Database Rules

Applies to services and server-rendered apps that talk to a relational database.

## Schema changes

- Every change to database structure (schema, tables, columns, constraints, indexes, relationships, or row-level security) ships with a versioned SQL migration in the same task. A dashboard SQL editor is for experiments only and never replaces the migration.
- Validate migrations, SQL functions, and policies on a disposable database (an ephemeral branch or a local Postgres) before closing the task. Exercise the committed SQL as written, not an ad-hoc rewrite. When fixing a bug, reproduce the failing case first.
- Never experiment on, seed, or mutate the default or production database. Applying migrations there needs an explicit request.
- Never print or persist secrets, connection strings, or sensitive row data while debugging; prefer metadata queries.

## Pooled connections

- A server render or background callback can be aborted mid-flight; an aborted flow suspends the `finally` that returns a pooled client, and the leaked clients exhaust the pool. A fast direct connection with pool `timeout exceeded` errors means pool starvation, not a slow database.
- Every path that checks out a pooled client must release it even when the awaiting flow is abandoned: register an `error` listener that destroys the client, guard against double release, and never issue `ROLLBACK` on a socket that already errored. Reuse the project's safe checkout helper instead of writing a new bare `connect()`/`finally` pair.
- Set a local `idle_in_transaction_session_timeout` right after `BEGIN` in request-scoped transactions, far larger than any legitimate transaction, so the server reclaims abandoned ones. Apply the same guard per connection (for example in the pool's connect hook) to cover transactions opened by libraries that own their checkout.
- Size the pool `max` for concurrent renders.
- Do not retry connection-acquisition timeouts: retrying while the pool is saturated doubles the pressure. Retry only genuinely transient terminations, such as a backend-closed idle client.
- Do not run a provider call plus a write on every server-rendered read; throttle reconciliation behind a freshness window.
- Before closing a task that touches database access, transactions, pools, retries, or provider calls on a render path, search the codebase for the same pattern (`pool.connect()`, pool factories, request-scoped transactions, retry helpers) and confirm every occurrence follows these rules or record why it is exempt.
