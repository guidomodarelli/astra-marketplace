# Established Libraries

Prefer an established, well-maintained library over a custom implementation when it solves the need.

- Before writing a utility, parser, validator, date or number handling, retry logic, or any other general-purpose mechanism, check whether a dependency already declared in the project, or shipped by its framework, covers it. Reuse it with its supported API.
- When no declared dependency covers the need, prefer a widely adopted library with active maintenance, recent releases, and a compatible license over hand-rolling the behavior.
- Never install a new library without asking first. State the library, the need it covers, and why the existing dependencies do not, then wait for the user's confirmation before adding it.
- Stack rules that name a specific library or its availability order (for example, `lodash.md`) take precedence over this general rule.
