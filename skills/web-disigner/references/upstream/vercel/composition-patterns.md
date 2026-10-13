# Component composition — adapted working notes

Source: Vercel Agent Skills, composition-patterns. Read the pinned upstream file for detailed examples when needed.

Make reusable components reflect a stable responsibility. Prefer small composed parts to one component with many unrelated boolean modes. Expose explicit variants and slots when callers need different structures. Keep state ownership clear; separate reusable presentation from application-specific data and effects.

When building compound components, use shared context only for genuinely shared state. Preserve accessibility relationships between triggers, panels, labels and controls. Match the project's current React version and its component conventions. Do not introduce a context layer for a single simple static section.

Inspect existing components before creating another one. Keep public APIs understandable and imports consistent. During refactoring, verify the actual interaction and loading/error states, not just successful compilation.
