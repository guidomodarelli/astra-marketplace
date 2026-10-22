# Security Rules — Java

- Never hardcode secrets, tokens, or credentials; read them from environment variables or the project's secret manager, and never log them.
- Validate request DTOs at the controller boundary with Bean Validation (`@Valid` plus constraint annotations) and reject unknown or invalid values with an allowlist.
- Use parameterized queries (`PreparedStatement`, JPA parameters, Spring Data methods); never concatenate user input into SQL or JPQL.
- Do not deserialize untrusted data with Java native serialization (`ObjectInputStream`); configure JSON mappers without default typing for untrusted input.
- Keep authorization checks in the security configuration or the service layer (for example `@PreAuthorize`), never only in the client.
- Return safe error responses and keep stack traces and internal details in server logs.
- Scan dependencies (OWASP Dependency-Check or the project's tool) when they change and resolve reported vulnerabilities.
