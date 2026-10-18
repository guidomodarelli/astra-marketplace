# Error Handling

Every failure must end in a deliberate outcome that someone can see and trace.

## Catch blocks

- Every `catch` (or error branch, in languages without exceptions) does at least one intentional thing: map an expected failure to a stable result, log an unexpected failure with context, trigger safe user feedback, or return or rethrow it to the boundary that owns the response.
- Do not add an error handler that only swallows the error or redirects control flow without classification, logging, or feedback.
- When wrapping or rethrowing, keep the original error attached with your language's mechanism (for example `cause` in JavaScript or `%w` in Go).

## Logs

- Use structured logs with the operation name and the identifiers needed to debug it: correlation identifiers such as `requestId` or `traceId`, and safe business identifiers.
- Log unexpected failures once, at the boundary that owns the user-facing response.
- For retries and external provider calls, record each attempt and the final outcome with the same trace context. The layer that owns the retry loop records the attempts; if the project forbids logging in that layer (for example in services), return the attempt metadata to the boundary and log it there.
- What may appear in logs is defined by the stack's `security.md` rule when it has one; otherwise, never log secrets, tokens, cookies, authorization headers, raw provider payloads, or PII.

## Error codes

When the project keeps a catalog of technical error codes:

- Give every technical error from server-side flows and external integrations (APIs, providers, databases) a stable code from that single catalog. Do not create ad-hoc or duplicated codes.
- Return the code next to the error message in technical error responses; success responses stay unchanged. When a skill's example returns only `{ error }` for a technical failure, add the catalog code in projects that keep one.
- Do not attach catalog codes to request, form, or business validation errors. Validation responses keep the codes their own contract defines (for example a validator's issue codes).
- A catalog code is an opaque support reference, not an infrastructure detail: the UI may show it as secondary text below the generic message, never instead of it, and never together with status codes, provider names, or other technical details.
- When a new flow can produce technical errors, or you find one without a code, add its code in the same task.
