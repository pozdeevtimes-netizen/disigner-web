# View transitions — adapted working notes

Source: Vercel Agent Skills, react-view-transitions. Consult the pinned upstream file and official React/Next.js documentation before implementation.

Verify that the installed framework versions support the proposed API. Use a route transition to preserve orientation or continuity between a list and a detail page. Keep transition names unique, and define behavior for entering, leaving and shared elements deliberately.

Preserve direct URLs, browser back/forward, scroll restoration and focus. Provide a useful reduced-motion fallback and a correct unanimated route change. Test rapid navigation, aborted loads and reordering. Do not replace a reliable router with manual DOM manipulation to obtain an effect.
