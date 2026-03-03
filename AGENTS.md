## Rules
- Port React code to Vue; React is the parity reference.
- Compare Vue against React source, API contracts, stories, and tests.
- Preserve React behavior/style contracts; no Vue-only behavior unless contract-safe.
- Reuse React/Spectrum selectors/styles; avoid Vue-only forks unless unavoidable.
- Fix root cause in internals (not story-only workarounds), including cross-package dependencies rendered by the target story.
- Do not add parity scripts/counters/checklist validators.
- Use targeted scripted DOM/computed-style checks as evidence when useful; do not rely on screenshots/guesswork.
- Do not declare parity from sampled stories; validate every story ID in the scoped component/story files.
- Green tests are regression gates, not parity proof.
- If either React or Vue target iframe is unavailable, stop and report blocker before making parity changes.
- If any diff remains, report it precisely as: story ID, selector, attribute/style key, React value, Vue value.
- Commit/PR notes must include: problem, resolution strategy, gap-discovery method, and parity evidence (scope, story IDs, key before/after checks).

## Per-Item Flow
1. Pick the next unchecked checklist item.
2. Start gate (required):
   - Story surface parity: exports + meta (`title`, `excludeStories`, top-level `args`, `argTypes`).
   - Story ID parity: React/Vue IDs are 1:1.
   - First render: visible/styled, no missing tokens or transparent surfaces.
   - Structure baseline: region/order matches React (header/heading/icon/footer/content).
   - Style wiring: imports, CSS deps, selector/class contracts.
3. Compare every story ID in scope in both iframes: `iframe.html?id=<story-id>&viewMode=story`.
4. Verify parity for each story ID: element/tag usage, DOM/wrapper layering, ARIA + `data-*`, state classes/transitions, behavior/interactions, computed styles.
5. Verify key layout contracts where relevant: inline style behavior (`position`, `top/left`, `width/height`, `z-index`, `overflow`) and focusability/tabindex.
6. Test at least two states per story ID: initial render and one triggered interaction state relevant to the component.
7. Fix Vue internals and add or adjust targeted regression tests.
8. Run the validation gate.
9. Mark the checklist item as done only when all scoped story IDs have no unresolved diffs (no additional checklist details).

## Validation Gate
- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check in targeted scope (React/Vue story-id diff = 0)
- Scripted DOM/ARIA/computed-style comparison across all scoped story IDs, including one triggered interaction state per story ID
- Manual side-by-side Storybook review
- Targeted style wiring check with triggered states

## Definition of Done
- React/Vue parity for structure, behavior, styles, controls, and tests in scope.
- All scoped story IDs pass initial + interaction-state parity checks with no unresolved DOM/ARIA/computed-style diffs.
