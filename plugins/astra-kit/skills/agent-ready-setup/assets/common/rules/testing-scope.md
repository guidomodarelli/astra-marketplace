# Testing Scope

Write only tests that exercise behavior: what the product or a script observably does. A test that cannot fail when the behavior breaks is noise, and it slows every change.

## Tests to write

- Assert observable behavior: rendered UI and interactions, use case results, adapter and mapper outputs, route handler responses, SQL run against a real database, and the effects of running a script.
- When functionality changes, add or update its tests in the same task.
- Mock at the port boundary of the project, not inside vendor internals, unless the test is the adapter test for that vendor.

## Tests not to write

Do not add these tests. When one is part of the code your task already changes, delete or rewrite it; when you find one elsewhere, report it instead of deleting it:

- Tests that only restate constants or configuration values, check that a module exports or imports something, check function arity or other language details, or snapshot static data.
- Tests that assert on mocks the test itself configured with no product logic in between, such as a use case that returns the repository double's value unchanged, or a wrapper test that only checks a mocked SDK was called.
- Tests that duplicate another case without adding coverage, assert static CSS classes with no conditional logic, or test a third-party library instead of the project's code.
- Tests that read repository files (source, migrations, styles, configs, scripts, `package.json`, docs) to assert on their text, regexes, or internal strings. Reading a file only to feed it to the real tool under test is allowed; asserting on its content is not.
- Tests for framework, platform, or build configuration (redirects, headers, bundler, ORM or deploy settings, environment-file loading). Verify those changes by running the app or the build.
- Tests that assert on SQL text, query chunks, or how many statements a mocked executor received. Assert the mapped result, the returned status, or the calls to external providers; to verify what the SQL does, run it against a real database.
- Tests of scripts or thin wrappers that assert the argument lists, command lines, file paths, or names they build for an external CLI or SDK. Test their own logic (parsing, decisions, redaction, error handling) or the effects of running them.
- Tests whose only purpose is to verify that tooling is configured or active (linter rules and plugins, formatter, type checker, build, hooks). Run the tool itself instead.
