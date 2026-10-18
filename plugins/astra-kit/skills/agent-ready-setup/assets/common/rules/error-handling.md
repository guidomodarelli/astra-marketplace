# Error Handling

Every failure must end in a deliberate outcome that someone can see and trace.

## Catch blocks

- Every `catch` does at least one intentional thing: map an expected failure to a stable result, log an unexpected failure with context, trigger safe user feedback, or rethrow to the boundary that owns the response.
- Do not add a `catch` that only swallows the error or redirects control flow without classification, logging, or feedback.
- When wrapping or rethrowing, attach the original error as `cause`.

## Logs

- Use structured logs with the operation name and the identifiers needed to debug it: correlation identifiers such as `requestId` or `traceId`, and safe business identifiers.
- Log unexpected failures once, at the boundary that owns the user-facing response.
- For retries and external provider calls, log each attempt and the final outcome with the same trace context.
- Never log secrets, tokens, cookies, authorization headers, raw provider payloads, or full PII.

## Error codes

When the project keeps a catalog of technical error codes:

- Give every technical error from server-side flows and external integrations (APIs, providers, databases) a stable code from that single catalog. Do not create ad-hoc or duplicated codes.
- Return the code next to the error message in technical error responses; success responses stay unchanged.
- Do not attach codes to request, form, or business validation errors.
- Show the code in the UI as secondary text below the generic message, never instead of it.
- When a new flow can produce technical errors, or you find one without a code, add its code in the same task.
