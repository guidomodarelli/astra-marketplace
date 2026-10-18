# Testing Rules — Frontend (React + TypeScript)

Standards for writing and reviewing tests. The `test-reviewer` agent uses this file as the reference for what a good test looks like in this stack.

---

## Framework

- Use the test runner configured in `package.json` (Jest or Vitest) with **React Testing Library (RTL)** for unit and integration tests — do not assume Jest if Vitest is configured.

## TDD cycle

Work test-first for every feature, bug fix, and architectural change, always in this order:

1. **Testing** — write the smallest failing test at the right layer, defining the expected behavior first. One clear behavior per test.
2. **Code** — implement the minimum code that makes it pass, respecting the module boundaries; do not skip ports, mappers, or value objects to move faster.
3. **Refactor** — only once the behavior is covered: improve naming, remove duplication, and tighten boundaries without changing behavior.
4. **Green** — the cycle ends when the new behavior is covered by passing tests.

## What to test by layer

- **`domain`** — unit tests for entities, value objects, and pure business rules.
- **`application`** — unit tests for use cases with doubles for the domain ports.
- **`infrastructure`** — integration tests for adapters, DTO mappers, auth wiring, and provider or database boundaries.
- **Routes and UI** — RTL tests for server/client boundaries, rendering, and critical user flows.
- **End-to-end** — smoke coverage for critical authentication and authorization flows.

## Coverage

- Minimum line coverage: **80%**.
- Every new or modified public component and function must have at least one test.
- API handlers and server hooks require integration tests.

## What to test

- **Happy path** — expected inputs produce expected outputs.
- **Error cases** — API failures, missing required fields, boundary values.
- **User interactions** — clicks, form submissions, keyboard navigation.
- **Async and error tracking states** — follow `Tests` in `user-facing-feedback.md`.
- **Middleend boundaries** — invalid input rejected at the route boundary, no duplicated validation in handlers, a valid public DTO consumed and an unusable one rejected safely, upstream responses consumed without schema revalidation, and no raw upstream payload in responses, logs, or public errors. Exercise the real validator instead of mocking it.
- Do not test implementation details — test what the user sees and does.

## Selectors (in order of preference)

1. `getByRole` — semantic and accessible.
2. `getByLabelText` — form fields.
3. `getByText` — visible content.
4. `getByTestId` — last resort, only when no semantic alternative exists.

Avoid snapshot tests as the primary assertion strategy — they detect change, not correctness.

## Mocking

- **Component tests**: mock internal services with `jest.spyOn`. No real HTTP calls.
- Never mock the design system's component libraries or the SSR framework's platform packages; render and call them for real.
- **Service tests**: do not mock the project's HTTP client — use HTTP record/replay interceptors (for example, `nock.back`); HTTP calls are captured as fixtures.
- Place `jest.mock()` / `vi.mock()` calls after imports.
- Reset mocks between tests using `beforeEach` / `afterEach`.
- See `no-unnecessary-mocks.md` for the full strategy and setup.

## Async

- Await all async interactions: `await userEvent.click(...)`, use `findBy*` queries for elements that appear after async operations.
- Never use arbitrary `setTimeout` delays to fix flakiness — find and fix the root cause.

## Structure

- Test file location: colocated in `__tests__/` next to the file under test, or `*.spec.tsx` alongside it.
- Exception: never place tests inside a Next.js App Router `app/` directory, where colocated files can become route artifacts. Put tests for pages, layouts, loading states, and route handlers in a separate tests tree that mirrors `app/`.
- Description format: start with a verb describing behavior — `"shows the error banner when the API returns 500"`.
- Follow AAA: Arrange → Act → Assert. No logic (conditionals, loops) inside test bodies.
