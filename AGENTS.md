# AGENTS Handoff - Vue Migration

Last updated: March 1, 2026 (Asia/Singapore)  
Source of truth: this file (`AGENTS.md`)

## Non-negotiables

- React packages are in maintenance mode; migration parity work is Vue-first.
- Do not add parity scripts, migration counters, or checklist validators.
- Passing automated tests protects from regressions but does not prove parity.
- Tests are a post-fix regression gate, not a parity gap discovery method.
- Never treat a green test run as evidence that React↔Vue parity gaps do not exist.
- Compare Vue against React source, API contracts, and existing React tests before implementing.
- Do not improvise Vue-only behavior logic; idiomatic Vue differences are valid only when the React behavior contract is preserved.
- Reuse/copy React/Spectrum styles where possible; avoid Vue-only style forks unless there is no React-equivalent DOM.
- Treat style parity as a first-class contract: if React imports Spectrum vars/local CSS, Vue must wire equivalent imports/dependencies and matching class/selector hooks.
- Vue ports should not add extra stories, styles, logic, or CSS beyond React parity, except when needed to solve Vue-idiomatic constraints without changing the React behavior/style contract.
- Fix behavior in Vue internals, not in story-only workarounds; replace placeholders before sign-off.
- Validate each component in all relevant Storybook namespaces:
  - `packages/@vue-spectrum/*/stories`
  - `packages/vue-aria-components/stories`
- Use `PARITY_REVIEW_CHECKLIST.md` as the mandatory progression tracker for the re-review; work top-to-bottom unless explicitly reprioritized.
- Mark checklist progress continuously while working (`[ ]` -> `[x]`) and record short evidence notes for each completed item.
- Commit and push often in small, reviewable increments; keep changes scoped to one component family/behavior cluster.
- Record scope, gaps, evidence, and validation outputs in commit/PR notes.

## Per-Component Workflow

1. Select the next unchecked item in `PARITY_REVIEW_CHECKLIST.md`.
2. Build parity artifacts (React artifact + fresh Vue Storybook build).
3. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
4. Compare React vs Vue source/API/props/states, and verify visual output, DOM structure, ARIA/data attributes, state classes/transitions, computed styles, and style-source wiring (imports/dependencies/selectors).
5. Fix Vue internals and add/adjust regression tests for the gap.
6. Run full validation gate; move to next component only after pass.
7. Mark the checklist item complete and add brief evidence (gap + fix + validation).

## Systematic Gap Detection (Required)

Use this checklist for every component batch. Do not skip steps even when tests are green.

1. **Story surface parity (before interaction testing)**
   - Compare React and Vue story file export keys **including exact casing**.
   - Compare `default export` metadata shape: `title`, `excludeStories`, top-level `args`, top-level `argTypes`.
   - Ensure helper exports intended to be excluded are actually listed in `excludeStories`.
   - Confirm no Vue-only story surface additions unless explicitly required for React parity.

2. **Story id parity**
   - Confirm targeted React/Vue story ids resolve 1:1.
   - Compare the same id only (`iframe.html?id=<story-id>&viewMode=story`) to avoid false diffs.

3. **Style-source parity (required before interaction sign-off)**
   - Compare React vs Vue style imports for the same component (`@adobe/spectrum-css-temp/.../vars.css` and local CSS files).
   - Confirm Vue package dependencies include any CSS package required by those imports.
   - Confirm Vue renders the class/selector contract expected by reused React/Spectrum CSS (e.g. `spectrum-*` / `react-spectrum-*` when applicable).
   - Replace placeholder/private Vue selectors when they break React style reuse parity.
   - Verify at least one triggered state in Storybook (not just static DOM) to ensure styles are actually applied.

4. **Contract parity per story**
   - DOM structure and ordering.
   - ARIA and `data-*` attributes (including props flowing through option objects like toast options).
   - State classes and transitions.
   - Behavior and interactions (pointer, keyboard, focus/blur, dismiss/close, async/loading).
   - Computed visual styles.

5. **Fix strategy**
   - Fix Vue internals first; do not hide contract gaps with story-only workarounds.
   - Detect and document the gap first from React↔Vue source/story/visual contract checks, then use tests to lock the fix.
   - Add/adjust targeted regression coverage in existing Vue parity tests.
   - Prefer extending current parity specs over introducing new parity scripts.

6. **Evidence and sign-off**
   - Log checked story ids, detected gaps, root cause, fix location, and validation results.
   - Only move to the next component family after the Validation Gate passes.

## Validation Gate

- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check for targeted scope (React vs Vue story id diff must be zero)
- Manual side-by-side Storybook review for structure, controls, attributes, styles, and interactions
- Targeted style wiring check (React vs Vue): imports, package deps, selector/class contract, and triggered visual state

## Definition Of Done

- Structure, behavior, styles, controls, and tests match React across all relevant namespaces, with evidence logged.
- `PARITY_REVIEW_CHECKLIST.md` is fully completed for the reviewed scope, with each completed item checked and evidenced.
