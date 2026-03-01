# AGENTS - Vue Parity

Last updated: 2026-03-01 (Asia/Singapore)
Source of truth: `AGENTS.md`

## Rules
- Vue-first migration; React is maintenance-only.
- Do not add parity scripts/counters/checklist validators.
- Green tests are regression gates, not parity proof.
- Compare Vue against React source, API contracts, stories, and React tests.
- Preserve React behavior/style contracts; no Vue-only behavior unless contract-safe.
- Reuse React/Spectrum styles/selectors; avoid Vue-only style forks unless unavoidable.
- Fix gaps in Vue internals, not story-only workarounds.
- Validate both namespaces:
  - `packages/@vue-spectrum/*/stories`
  - `packages/vue-aria-components/stories`
- `PARITY_REVIEW_CHECKLIST.md` is tracking only: keep it compact (`[ ]` -> `[x]`), no detailed notes.
- Put evidence (scope, gaps, validation outputs) in commit/PR notes.
- Discovery is owned by parity work; do not wait for reviewer/user bug reports.

## Per-Item Flow
1. Pick next unchecked checklist item.
2. Start gate (required):
   - Story surface parity: exports + meta (`title`, `excludeStories`, top-level `args`, `argTypes`).
   - Story id parity: React/Vue ids 1:1.
   - First render: visible + styled with no token-missing/transparent surfaces.
   - Overlay components: initially-open overlay resolves inside `.vs-provider`.
   - Structure baseline: header/heading/icon/footer/content region ordering matches React.
   - Style wiring: imports, CSS deps, selector/class contract, helper-class collision scan (`rg`).
3. Compare same story id in both iframes: `iframe.html?id=<story-id>&viewMode=story`.
4. Verify parity: DOM/order, ARIA + `data-*`, state classes/transitions, behavior/interactions, computed styles.
5. Fix Vue internals and add/adjust targeted regression tests.
6. Run validation gate.
7. Mark checklist item done (no appended details).

## Validation Gate
- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check in targeted scope (React/Vue story-id diff = 0)
- Manual side-by-side Storybook review
- Targeted style wiring check with triggered state

## Definition of Done
- React/Vue parity for structure, behavior, styles, controls, and tests in scope.
- Checklist fully completed for reviewed scope.
