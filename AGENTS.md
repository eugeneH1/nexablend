## Learned User Preferences

- The site and marketing copy target the **South African market**; use **ZAR** and explicit **`en-ZA`** formatting for money and numbers in the UI so display matches SSR and avoids hydration mismatches.
- When fixing **syntax, JSX, or markup** issues, keep the **existing wording**; do not rewrite copy unless the user asks for it.
- Large refactors (e.g. performance and bundle work) may stay **documented in `docs/`** and unimplemented until the user is ready to execute.

## Learned Workspace Facts

- Shared formatting lives in **`lib/format.ts`**: `LOCALE` is `en-ZA`, with **`formatNumber`** and **`formatZAR`** for consistent number and Rand currency display.
- The main menubar logo in **`components/glassmorphism-nav.tsx`** uses **`/images/Logo/BADGEblkbck.png`** (served from `public`).
- A deferred **performance and bundle optimization** checklist and phases are in **`docs/perf-and-bundle-optimization-plan.md`**.
