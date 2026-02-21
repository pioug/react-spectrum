# Storybook React -> Vue 1:1 Parity Plan

Status: active
Owner: Vue migration workstream
Last updated: 2026-02-21

## Progress

- Phase 0 completed on 2026-02-21 (legacy parity fixtures/pages/reports removed).
- Catalog identity gate scaffolded on 2026-02-21 via `scripts/storybook-parity-catalog.mjs`.

## Goal

Recreate the Vue Storybook so it mirrors the React Storybook structure and behavior 1:1, with strict visual parity (`0` pixel differences) in side-by-side comparison.

## Constraints

- Breaking changes are allowed.
- Do not preserve legacy migration fixture pages as the source of truth.
- React Storybook is the canonical reference.
- Vue Storybook must match story hierarchy, story ids, controls, states, variants, and interaction behavior.
- No brute-force visual fixes: no story-only CSS hacks to force screenshot parity.
- Reuse/port React styles from this repository as-is wherever possible.
- If visuals differ, fix Vue internals (DOM structure, class/state contracts, token usage) before touching styles.
- Always review React component source implementation (component + hooks/state + related utils) before or during each Vue port; do not guess.
- Derive behavior from React source only; do not introduce Vue-only behavior semantics.
- No local hacks or implementation-specific behavior that exists only in Vue.
- Derive styles from React style sources/contracts only; do not introduce Vue-only local styles for parity.

## Source of truth

- React Storybook config: `.storybook/main.js`, `.storybook/preview.js`
- React component stories: `packages/react-aria-components/stories/*.stories.tsx`
- React package stories used by root Storybook:
  - `packages/@react-spectrum/*/stories/*.stories.*`
  - `packages/@react-aria/*/stories/*.stories.*`
  - `packages/@react-stately/*/stories/*.stories.*`
- React Storybook stories are the API/behavior spec for Vue ports:
  - props + defaults
  - variants + state permutations
  - controls/argTypes
  - interaction behavior (hover/focus/press/keyboard/open-close)

## Story mapping spec (strict)

- Mapping is identity-based: `React story id === Vue story id`.
- No alias table and no fallback mapping are allowed.
- To guarantee identical ids, Vue stories must copy:
  - story `title` string exactly
  - named story export identifiers exactly
  - story hierarchy/grouping order expectations from React
- Any React story without an exact Vue id match is a parity failure.
- Any extra Vue story id not present in React (within scoped parity set) is a parity failure.
- The parity runner must compare `index.json` catalogs first and fail before screenshot diff if ids differ.

## Style source + port pattern

- Primary style source is repository CSS from `@adobe/spectrum-css-temp`:
  - component styles: `@adobe/spectrum-css-temp/components/<component>/vars.css`
  - theme/token styles: `@adobe/spectrum-css-temp/vars/*`
- React components consume these styles through shared class contracts:
  - `classNames(styles, 'spectrum-*', state classes)`
  - state classes include `is-hovered`, `is-active`, `is-focused`, `focus-ring`, `is-disabled`, `is-invalid`
- Some surfaces also rely on repo-local React Spectrum class layers (e.g. `react-spectrum-*` helpers such as table/actionbar).
- Port rule:
  - preserve class/state contract first in Vue internals
  - then apply the same style sources
  - no per-story CSS overrides for parity
  - no Vue-only component CSS that changes visual behavior beyond what exists in React style sources

## Current baseline (2026-02-21)

- React stories:
  - `react-aria-components`: 45
  - `@react-spectrum/*`: 166
  - `@react-aria/*`: 29
  - `@react-stately/*`: 1
- Vue stories currently wired in Storybook: 2 (`Button`, `TextField`)

## Execution plan

### Phase 0: Clean slate

1. Remove legacy parity scaffolding as gating sources:
   - `starters/react-parity/*`
   - `starters/vue/parity*.html`
   - `starters/vue/src/Parity*.vue`
   - `migration/vue-visual-parity-*.json`
   - `migration/visual-parity/*` report artifacts
2. Keep only one parity gate: Storybook-to-Storybook parity.
3. Add this plan as the single active parity execution spec.

Acceptance criteria:
- No CI or docs reference legacy parity fixtures/pages.
- No remaining commands or docs claiming legacy parity is authoritative.

### Phase 1: Structural parity (file + story topology)

1. Mirror React story files into Vue structure:
   - Create `packages/@vue-spectrum/components/stories/*` matching React filenames from `packages/react-aria-components/stories/*`.
2. Match Storybook titles and story export names exactly.
3. Add Vue equivalents for shared React story helpers:
   - `styles.css`
   - `utils`
   - small story-only wrappers (provider/layout/test hooks)
4. Expand Vue Storybook globs to include the mirrored component stories first, then package-level parity stories.

Acceptance criteria:
- `React story file count == Vue story file count` for scoped target set.
- Every React story id has an identical Vue story id (exact string match).
- Story tree order and grouping are deterministic and equivalent.
- Every mapped story has a parity checklist entry for props, variants, states, and behavior.

### Phase 2: Controls and behavior parity

1. For each mapped story, align:
   - args defaults
   - argTypes/controls
   - story parameters (layout, docs, viewport, backgrounds, a11y knobs)
   - state/variant permutations
2. Port interaction behavior (hover, focus, press, keyboard, open/close flows) into Vue stories.
   - Derive expected behavior from React source code for every mapped story, not assumptions.
3. Port styles by contract, not patching:
   - Match React DOM/class/state hooks in Vue component internals.
   - Apply existing React style sources from repo to equivalent Vue contracts.
   - Avoid adding visual-only overrides in stories except minimal layout wrappers.
4. Ensure deterministic rendering for comparison:
   - freeze timers/animations where needed
   - stable locale/timezone
   - stable viewport + device scale

Acceptance criteria:
- Args and controls are structurally equivalent for mapped story pairs.
- Interaction states produce equivalent DOM semantics and user-visible behavior.
- Visual parity fixes are implemented in component internals/style ports, not one-off screenshot workarounds.
- Vue story props/variants/states/behavior match React Storybook spec for every mapped story.

### Phase 2.5: Source-driven behavior gate

1. For each component/story group, run a mandatory source audit:
   - read React implementation source (component + hooks/state + related utils)
   - read Vue implementation source for the same surface
   - record behavior gaps before code changes
2. Fix gaps in Vue implementation (not in Storybook-only code), then verify with tests.
3. Add/maintain behavior parity tests for each mapped story group covering:
   - props and default semantics
   - emitted events (name, payload, order)
   - ARIA/role/label/description wiring
   - keyboard behavior and focus management
   - disabled/readonly/invalid edge cases
4. Store audit evidence for each component in a parity checklist artifact:
   - React source files reviewed
   - Vue source files reviewed
   - gaps found
   - fixes applied
   - tests proving closure

Acceptance criteria:
- No component is marked parity-complete without a source audit checklist.
- Behavior parity tests pass for all mapped story groups before visual diff runs.
- If behavior and visuals conflict, behavior is corrected in implementation first, then visual parity is re-run.
- Any behavior not traceable to React source is a blocking parity failure.
- Any style not traceable to React style sources/contracts is a blocking parity failure.

### Phase 3: Visual zero-diff gate

1. Add a parity runner script (new): `scripts/storybook-parity-check.mjs`
2. Runner responsibilities:
  - Start React Storybook and Vue Storybook
  - Run behavior parity test suite first and fail fast on behavior mismatch
  - Read each Storybook `index.json`
  - Assert catalog identity (`React ids == Vue ids`) before screenshots
  - Capture screenshots from `iframe.html?id=<story-id>&viewMode=story`
  - Generate side-by-side and diff artifacts
  - Fail on any changed pixel (`changedPixels > 0`)
3. Output artifacts:
   - `artifacts/storybook-parity/react/*.png`
   - `artifacts/storybook-parity/vue/*.png`
   - `artifacts/storybook-parity/diff/*.png`
   - `artifacts/storybook-parity/report.json`
   - `artifacts/storybook-parity/report.md`

Acceptance criteria:
- Story id catalogs are identical for the scoped parity set.
- Behavior parity suite passes before any screenshot comparison step.
- All mapped stories pass with `changedPixels = 0`.
- CI fails immediately on first non-zero diff.

### Phase 4: CI enforcement

1. Add scripts:
   - `yarn storybook:parity:check`
   - `yarn storybook:parity:update-baseline` (React only)
2. Wire parity check into CI required checks.
3. Require parity pass before merge for changed component/story paths.

Acceptance criteria:
- PRs touching Vue/React story files cannot merge when parity fails.
- Parity report artifact is always attached for failing runs.

## Definition of done

- Vue Storybook mirrors React story structure for the target scope.
- Story ids, controls, states, and variants are aligned.
- Side-by-side visual comparison has `0` differences for every mapped story.
- Legacy parity fixture pages are removed from active workflow.

## Immediate next actions

1. Generate a React->Vue story mapping file from `index.json`.
2. Scaffold all missing Vue story files with matching titles/exports.
3. Build the parity runner and make it the only visual gate.
4. Wire `yarn storybook:parity:check` into CI as required.
