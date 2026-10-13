# React performance — adapted working notes

Source: Vercel Agent Skills, react-best-practices. Consult the pinned upstream file in source-manifest.json for full examples.

Investigate measured bottlenecks before changing architecture. Run independent requests concurrently; start asynchronous work before awaiting when dependencies permit. Avoid serial server/client fetch chains. Keep client bundles small by importing needed modules directly and loading expensive optional features only when used. Do not move secrets or server-only dependencies into browser code.

Respect the installed React/Next.js versions and server/client boundaries. Use an existing data layer, deduplication and caching only with correct scope and invalidation. Isolate frequently changing state, derive values during render when appropriate, and avoid unnecessary effect chains. Use memoization when identity or profiling demonstrates a benefit.

Check main-image delivery, long lists, hydration, expensive layout work and third-party scripts. Preserve behavior while optimizing. Compare an observable metric or reproduced problem before and after; do not treat a rule count as proof of speed.
