---
name: react-useeffect-abortcontroller
description: Prevents race conditions in React useEffect async flows by requiring AbortController cancellation, explicit cancel handling, and safe state updates. Use when implementing async effects in React.
license: MIT
metadata:
  version: "1.0.0"
  author: "Guido Modarelli"
  category: "frontend"
  tags: "react, useEffect, abortcontroller, race-conditions, async"
  command: "/react-useeffect-abortcontroller"
---

## Quick start

- Read [rule.md](references/rule.md) for the required AbortController-first pattern and safe cancellation handling.
- Use [examples.md](references/examples.md) for a copy-ready implementation with AbortController, an `isActive` guard, and explicit cancellation error handling.
