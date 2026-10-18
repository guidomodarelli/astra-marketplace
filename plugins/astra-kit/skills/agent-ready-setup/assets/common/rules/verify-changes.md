# Verify Changes

Verify your work after each meaningful change instead of assuming it worked.

- After each meaningful change, check that it achieved its goal through observable evidence: the relevant tests, the affected command, or the running flow. Lint runs once at the end of the task, as `lint-gate.md` defines.
- For visual tasks (layout, styles, components, rendered content), inspect the actual output in the browser and take screenshots of the affected screens and states. Use the browser capabilities described in `browser-before-user-questions.md`.
- When the verification reveals a problem, fix it and verify again. Do not finish a task while a known issue from that task remains unfixed.
- Before finishing, report anything you could not verify, why, and what remains pending. Never report unverified work as done.
