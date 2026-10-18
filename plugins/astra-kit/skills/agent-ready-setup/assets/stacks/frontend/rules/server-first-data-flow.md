# Server-First Data Flow

Load data on the server by default and adapt external data in exactly one place.

## Default strategy

- Load initial data through server-side entrypoints (server components, pages, layouts, loaders).
- Give each route segment a single primary data entrypoint whenever possible.
- Do not scatter external fetches across presentational components when the route can resolve them on the server.

## Middleend mapping

- External contracts belong to infrastructure: `src/modules/<feature>/infrastructure/api/dto/*` and `src/modules/<feature>/infrastructure/api/mapper.ts`.
- Internal contracts for the UI belong to application: `commands/`, `queries/`, and `results/`.
- Follow one conversion flow:

```text
External API/SDK -> infrastructure DTO -> infrastructure mapper -> domain entity/value object -> use case -> application result -> route view model/component props
```

- Never pass provider DTOs directly to route components or props.
- A route, server component, or action that calls external infrastructure translates failures into a safe, localized UX and never exposes raw provider messages, stack traces, or internal diagnostics.

## Client-side fetching

- Fetch on the client only when the server is not a fit: user-triggered refreshes, incremental interactions, or post-render mutations.
- Keep client fetching behind use cases and adapters; components never call third-party SDKs directly.
- When a route needs client fetching plus session state, split container and presenter: the container owns session, fetching, mutation state, and validation flow; the presenter renders props and emits callbacks.
