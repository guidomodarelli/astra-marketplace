# Cross-Engine Compatibility — Chromium and WebKit

Every style and every piece of client-side JavaScript must render and behave correctly on Chromium (Chrome, Edge, Android Chrome) and WebKit (Safari, iOS Safari, iOS Chrome, iOS WebViews). A change is not done until it works on both engines.

## Styles

- Validate small viewports on both engines: several divergences only appear on mobile Chrome and iOS.
- Be careful with layout features whose sizing differs between engines: grid `fr`/`minmax()` tracks inside `fit-content` or `auto` containers, `-webkit-line-clamp` with `-webkit-box`, flex and grid `min-height`/`min-width` defaults, sticky positioning, fixed positioning combined with `inset` or `margin: auto`, and viewport units. When a scroll container depends on an `fr` track, give it a definite size.
- Keep the required `-webkit-` prefixes and provide a standard fallback. Never ship a property or value only one engine understands.

## Viewport units

- Use `svh` for page or section `min-height` and for viewport-bound scroll containers.
- Use `dvh` only for fullscreen mobile overlays.
- Do not use bare `100vh`, and never swap every `svh` for `dvh` in bulk.

## JavaScript

- Do not depend on Chromium-only APIs or behaviors. Guard non-universal Web APIs with feature detection and give WebKit a working fallback.

## Verification

- When fixing or reviewing a UI bug, rule out an engine-specific cause and verify the fix on both engines. If one engine cannot be exercised, state the blocker and the closest validation you ran.
