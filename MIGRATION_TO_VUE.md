# Vue Migration Plan

## Current status (as of February 25, 2026)

1. React packages are in maintenance mode while Vue migration ports continue.
2. Storybook parity is still in progress and must be validated manually.
3. Vue Storybook includes both `@vue-spectrum/*/stories` and `packages/vue-aria-components/stories` sources for parity navigation coverage.
4. Completion is evidence-driven and not inferred from scripts, reports, or checklists.

## Non-negotiable rules (required)

1. Do not add parity scripts, migration tracker scripts, checklist-validator scripts, or script-based completion counters.
2. Do not infer completion from generated reports, checklists, or script output.
3. Fix behavior and structure in Vue component internals (no story-only hacks).
4. Scaffold placeholders are temporary only and must be replaced by real parity stories before a component is considered complete.
5. Record reviewed scope, gaps, and evidence in commit/PR notes.
6. Commit and push frequently in small, reviewable increments.
7. Do not sign off parity from only one Storybook namespace when a component exists in multiple namespaces (for example `Button/*` and `React Aria Components/Button/*`).
8. Style parity is blocking, not optional. If computed styles diverge on canonical states, the component is not complete.
9. Controls parity is blocking, not optional. If Storybook controls/argTypes differ, the component is not complete.

## Session execution mode (required)

1. Do not wait for user screenshot checks to discover gaps.
2. Pick the next component in Storybook and run the full parity workflow end-to-end.
3. Only move to the next component after the current component passes the validation gate.
4. If blocked, record the blocker in commit/PR notes with the exact missing dependency or code path.
5. Ask for user validation only after structure, style, behavior, and tests are aligned for that component.

## Per-component parity workflow (required)

1. Build auditable Storybook outputs before gap analysis (use current React Storybook build artifact and a fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. If the component exists in multiple Storybook namespaces, run parity for each namespace before marking the component complete.
4. Confirm story source structure, grouping, names, and featured scenario coverage match React. Use built `index.json` entries as the source of truth for story labels/names because Storybook may normalize names differently than source `story.name` declarations.
5. Compare story meta/controls contract for canonical stories: `args`, `argTypes`, control type/options/defaults, hidden/disabled rows, and story-level control/action parameter overrides.
6. When canonical `args.children` contains serialized framework elements, compare semantic children content and slots, and ignore React-only `type.__docgenInfo` payloads and undefined-only transport keys that do not affect runtime behavior.
7. Capture baseline DOM snapshots for the canonical interactive node (tag, class, role, `data-*`, `aria-*`, `tabindex`, and other critical attributes).
8. Always include native-button contract checks in the baseline and diffs: `disabled`, `aria-disabled`, `tabindex`, and `data-react-aria-pressable`.
9. Run a deterministic interaction probe sequence with real browser input: keyboard focus (`Tab`), hover, pointer down/up, keyboard activation (`Space`/`Enter`), then story-specific interactions.
10. Capture post-step snapshots after each probe and diff React vs Vue state attributes and class/state transitions.
11. After each interaction step, wait for state transitions to settle before capturing snapshots (at least one interaction animation interval) so comparisons are not skewed by in-flight CSS transitions.
12. Treat contract drift as a gap: missing attributes, extra attributes, wrong classes, mismatched ARIA state, or divergent interaction transitions.
13. When comparing built Storybook DOM classes, normalize framework-generated CSS-module hash prefixes (for example `Ab12_spectrum-*`) and compare semantic Spectrum/state tokens, not raw hashed class strings.
14. Verify compiled CSS selectors in the built output match the runtime state contract (for example `focus-ring`, `is-hovered`, `is-active`). If Vue emits state classes but compiled selectors are pseudo-only (or vice versa), fix the component/style wiring before sign-off.
15. Capture computed style snapshots for canonical nodes on at least these states when applicable: initial, focus-visible, hover, pressed, disabled, pending.
16. Compare a fixed critical style set per component (layout, typography, color, border, radius, shadow/outline, cursor/opacity, user-select/pointer-events). Treat any unexplained delta as a parity gap.
17. Do not use screenshot-only judgments for style parity. Screenshots are supporting evidence only after computed-style parity is established.
18. If direct cross-framework story imports fail in tests due workspace resolution, use browser-level probes against built Storybook output rather than blocking discovery.
19. Inspect React and Vue internals for the divergent code paths and fix one gap cluster at a time.
20. Add or update regression tests for each fixed gap, including at least one assertion for canonical DOM contract and one assertion for a critical style/state behavior in Vue tests.
21. Rerun the validation gate and only then move to the next component.
22. Use screenshots only as final confirmation after structure, styles, and behavior already match.

## Style handling policy (required)

1. Prioritize style sources in this order: `@adobe/spectrum-css-temp` component/vars styles, existing React package-local styles when needed for parity, and Vue-local styles only for Vue-only DOM that has no React equivalent.
2. Keep React/Spectrum class structure and class names where feasible.
3. Prefer wiring Vue components to existing React/Spectrum style modules instead of duplicating CSS.
4. Do not create Vue-only duplicate style files when an equivalent React/Spectrum stylesheet already exists.
5. Include tests for style-state behavior (focus, hover, pressed, disabled, pending) when fixing style gaps.
6. Do not add Vue-only overrides that merely make screenshots look similar while state selectors or DOM contracts remain mismatched.
7. When style mismatches appear, verify class and state-attribute parity first, then fix style sources.

## Validation gate before requesting review (required)

1. Run `yarn typecheck:vue`.
2. Run `yarn test:vue`.
3. Build Vue Storybook with `yarn build:vue:storybook`.
4. Run Storybook index parity check (React vs Vue story id diff must be zero for the targeted scope).
5. Capture and review DOM-contract diffs for canonical stories in each relevant namespace before sign-off.
6. Capture and review computed-style diffs for canonical stories in each relevant namespace and state matrix before sign-off.
7. Capture and review controls/argTypes parity evidence for canonical stories in each relevant namespace before sign-off.
8. Manually review React and Vue Storybook side by side for structure, controls, key attributes, computed styles, and interactions.
9. Confirm regression tests cover fixed gaps and evidence is captured in commit/PR notes.

## Systematic parity review strategy (component-owned behavior)

### 1. Root-cause class to eliminate everywhere

1. Treat this as a blocking anti-pattern: story-level code implementing behavior that should live in Vue component internals.
2. Treat this as a blocking anti-pattern: Vue exports that alias multiple React concepts into one primitive when React has distinct trigger/controller components.
3. For each component family, parity review must explicitly answer: "What behavior is owned by React component internals vs story scaffolding?"

### 2. Repository-wide audit pass (before fixes)

1. Build a migration audit table with one row per Vue component family (`@vue-spectrum/*` + relevant `vue-aria-components` stories):
   - React owner components (source files in `packages/@react-spectrum/*/src`).
   - Vue owner components (source files in `packages/@vue-spectrum/*/src`).
   - Story-level behavior found (open/close state, keyboard routing, dismiss handlers, focus management, positioning logic).
   - Risk tier.
2. Assign risk tiers to prioritize work:
   - Tier 1: trigger/overlay/controller patterns (`*Trigger`, popover/tray/menu/dialog/select/picker/combobox).
   - Tier 2: composite controls with selection/open state (`ListBox`, `Table`, `Tree`, `Tabs`, `ActionGroup`).
   - Tier 3: mostly presentational/stateless primitives.
3. For each Tier 1 row, verify whether Vue still has alias exports hiding missing architecture (for example `MenuTrigger = Menu`-style patterns). These rows are first to fix.

### 3. Per-component execution loop (repeat until all components are covered)

1. Extract React contract from source and tests:
   - internal state ownership,
   - event contract (`openChange`, `dismiss`, selection events),
   - keyboard/pointer/focus behavior,
   - overlay/dismiss semantics (Escape, outside click/press, focus restore).
2. Write/expand failing Vue regressions first for that contract:
   - component-level tests (`components.spec.ts`) for behavior ownership,
   - story-level parity tests (`storybook-parity.spec.ts`) for integration expectations,
   - API-compat tests when exports/events change.
3. Move behavior from stories into Vue component internals:
   - keep stories declarative and scenario-focused,
   - remove workaround wrappers used only to simulate missing component architecture.
4. Reconcile event and prop contracts with React:
   - align payload shapes and naming semantics where required,
   - keep compatibility aliases only where they do not hide missing behavior.
5. Re-run validation gate and only then mark that component row complete.

### 4. Mandatory parity assertions per component

1. Open/close lifecycle:
   - trigger click toggles correctly,
   - no reopen race,
   - no layout shift from menu/overlay mount.
2. Dismiss lifecycle:
   - Escape closes from expected focus locations,
   - outside click/press closes reliably,
   - focus restore behavior matches React expectations.
3. Keyboard lifecycle:
   - Arrow/Home/End navigation where applicable,
   - trigger ArrowDown/ArrowUp open strategy where applicable,
   - submenu keyboard open/close where applicable.
4. Visual state lifecycle:
   - no unintended hovered/focused/selected state on open,
   - focus-visible styles only when keyboard modality requires them.
5. Story contract:
   - stories do not own component behavior,
   - controls/args/argTypes parity remains aligned.

### 5. Completion criteria for each component row

1. Vue component internals own the same behavior class as React.
2. No story-level workaround code remains for missing core behavior.
3. Regression tests fail without the fix and pass with the fix.
4. Validation gate passes (`typecheck`, Vue tests, Storybook build, parity checks).
5. Evidence is logged with exact files changed, behaviors fixed, and validation commands.

### 6. Execution cadence and governance

1. Run this workflow component-by-component in priority order; do not batch unrelated families in one change.
2. Keep each change scoped to one behavior cluster and one component family where possible.
3. After each component row is complete, append a dated evidence entry before moving to the next row.
4. Do not rely on user manual QA to discover regressions; test coverage must discover the known failure classes automatically.

## Evidence log (cleaned)

### February 26, 2026

1. Converted scaffolded stories to live behavior and removed placeholder migration wording across key Storybook surfaces.
2. Closed early core parity gaps in `ActionGroup` and `ListBox` internals (including disabled/selection contracts and semantic labeling).
3. Added regression coverage in `starters/vue/src/storybook-parity.spec.ts` and `starters/vue/src/components.spec.ts` for the migrated clusters.
4. Validation snapshots passed repeatedly during these changes:
   - typecheck: `yarn typecheck:vue`
   - full tests: `yarn test:vue` (up to 367 tests by end of day)
   - Storybook build: `yarn build:vue:storybook`
5. Story/index parity remained zero-diff for this scope (`react_ids=1467`, `vue_ids=1467`, `only_react=0`, `only_vue=0`; no title/name/args/argTypes drift reported).

### February 27, 2026 — Core contract parity (`@vue-spectrum/*`)

1. Completed broad iterable-key/value and selection contract hardening across component internals, including these families:
   - `accordion`, `actionbar`, `actiongroup`, `card`, `combobox`, `list`, `listbox`, `menu`, `picker`, `steplist`, `table`, `tag`.
2. Closed event-payload parity gaps so emitted values/sets align with React behavior for canonical interaction paths.
3. Closed numeric-key and disabled-key edge cases where Vue behavior diverged from React in controlled and uncontrolled scenarios.
4. Updated stories in affected families to consume real iterable/controlled contracts instead of ad hoc story-only normalization.
5. Each cluster was covered by targeted regression additions in:
   - `starters/vue/src/components.spec.ts`
   - `starters/vue/src/storybook-parity.spec.ts`
   - `starters/vue/src/api-compat.spec.ts` when export semantics changed.

### February 27, 2026 — Story parity and fixture-removal pass

1. Migrated remaining fixture/template-only stories to live stateful stories across `packages/vue-aria-components/stories` and `packages/@vue-spectrum/*/stories`.
2. Removed stale scaffold wording and static shells from RAC and Spectrum story files, replacing them with real component wiring and interaction coverage.
3. Closed parity gaps across RAC story areas including (non-exhaustive): `Switch`, `SearchField`, `Form`, `Disclosure`, `Dropzone`, `TextField`, `TimeField`, `Meter`, `ProgressBar`, `RadioGroup`, `NumberField`, `Popover`, `Tooltip`, `FileTrigger`, color components, `Slider`, `Link`, `Autocomplete`, `Select`, `GridList`, `Modal`, `Table`, and `DatePicker`.
4. Re-ran parity-focused test slices after each migration cluster, then re-ran full Vue validation gate.

### February 27, 2026 — `Menu`/`MenuTrigger` parity remediation

1. Resolved visual and behavior parity drift reported during side-by-side React/Vue review for `MenuTrigger` stories (layout shift, hover/focus state, selected-on-open drift, dismiss semantics, keyboard gaps, reopen race).
2. Aligned menu DOM/class/state contracts with React expectations and fixed link/unavailable/submenu behavior in `@vue-spectrum/menu` internals and stories.
3. Added missing keyboard and dismiss behaviors:
   - top-level `Escape` dismiss,
   - outside click dismiss,
   - submenu keyboard open/close focus restoration,
   - trigger `ArrowDown`/`ArrowUp` open-focus strategies.
4. Fixed race/regression sequence discovered during review:
   - reopen-on-close race,
   - immediate-close-on-open suppression timing,
   - unintended first-item hover/focus appearance.
5. Final architectural correction:
   - replaced `MenuTrigger = Menu` aliasing with a real Vue `MenuTrigger` component that owns trigger/open/dismiss/focus behavior (React-like ownership),
   - removed story-owned trigger behavior hacks,
   - aligned `openChange` trigger semantics and added explicit regressions.

### February 27, 2026 — Overlay/Dialog dismissal parity remediation

1. Closed shared overlay parity gaps in `@vue-spectrum/overlays`:
   - added `Escape` dismissal handling for dismissable `Modal`, `Tray`, and `Popover`,
   - added outside pointer-dismiss behavior for non-modal dismissable `Popover`,
   - prevented nested-overlay dismissal collisions by scoping dismissal to the topmost overlay surface.
2. Closed controlled `DialogTrigger` close-contract drift in `@vue-spectrum/dialog`:
   - ensured dismiss requests emit `close` in controlled mode (matching story/controller expectations),
   - prevented duplicate close emissions when parent also drives `open` state updates.
3. Added trigger focus restoration on `DialogTrigger` close to align controller-owned focus lifecycle with React expectations.
4. Added regression coverage in:
   - `starters/vue/src/components.spec.ts` for overlay Escape/outside-dismiss and `DialogTrigger` focus restore,
   - `starters/vue/src/storybook-parity.spec.ts` for dismissable modal `DialogTrigger` Escape/underlay dismissal flows.

### February 27, 2026 — `ActionGroup` overflow keyboard/dismiss parity remediation

1. Closed overflow-menu keyboard parity gaps in `@vue-spectrum/actiongroup`:
   - trigger `ArrowDown`/`ArrowUp` now opens overflow menu with first/last focus strategy,
   - overflow menu now supports `ArrowDown`/`ArrowUp`/`Home`/`End` focus movement,
   - `Escape` closes overflow menu and restores focus to the overflow trigger.
2. Hardened overflow dismissal lifecycle:
   - added robust outside pointer dismissal across `mousedown`/`pointerdown`/`touchstart` capture paths,
   - aligned overflow trigger/menu ARIA linkage (`aria-controls` to menu id) for controller contract parity.
3. Added overflow menu focused/hovered state wiring to match Spectrum state class lifecycle in keyboard/pointer paths.
4. Added regression coverage in `starters/vue/src/components.spec.ts` for keyboard open strategy, menu focus navigation, Escape close+focus restore, and outside-click dismissal.

### February 27, 2026 — `DatePicker`/`DateRangePicker` dismissal parity remediation

1. Closed dismiss-lifecycle parity gaps in `@vue-spectrum/datepicker` for popover-backed fields:
   - added `Escape` dismissal handling for open picker dialogs,
   - added outside pointer dismissal handling (`mousedown`/`pointerdown`/`touchstart`) for open dialogs.
2. Added focus restoration to picker trigger buttons on keyboard dismissal to keep controller-owned focus behavior aligned with React expectations.
3. Applied the same dismissal behavior class to both single `DatePicker` and `DateRangePicker` implementations (shared failure mode).
4. Added regressions in:
   - `starters/vue/src/components.spec.ts` for Escape/outside-close behavior and focus restoration,
   - `starters/vue/src/storybook-parity.spec.ts` for default DatePicker/DateRangePicker story dismissal flows.

### February 27, 2026 — `ComboBox` outside-dismiss parity remediation

1. Closed outside-dismiss parity gap in `@vue-spectrum/combobox` by moving pointer dismissal ownership into component internals:
   - added document-level outside pointer capture handling (`mousedown`/`pointerdown`/`touchstart`) while expanded,
   - ignored in-component targets so trigger/list interactions are not incorrectly dismissed.
2. Added regression coverage in `starters/vue/src/components.spec.ts` for:
   - keyboard `Escape` close path,
   - outside pointer dismissal path,
   - emitted `openChange` contract on both paths.
3. Added integration regression coverage in `starters/vue/src/storybook-parity.spec.ts` for combobox story-level Escape and outside-dismiss behavior.

### February 27, 2026 — Remaining package-surface parity closure (`dnd`, `virtualizer`)

1. Closed previously unreviewed package-surface gaps by adding explicit contract tests for:
   - `@vue-spectrum/dnd` API compatibility exports (`DropZone`, `DIRECTORY_DRAG_TYPE`, `useDragAndDrop`),
   - `@vue-aria/virtualizer` helper/component contracts (`useVirtualizer`, `useScrollView`, `useVirtualizerItem`, RTL scroll helpers, wrapper slot passthrough components).
2. Added coverage in:
   - `starters/vue/src/api-compat.spec.ts` (`dnd` export contract),
   - `starters/vue/src/composition.spec.ts` (`virtualizer` helper + wrapper behavior).

### February 27, 2026 — Storybook build-gate blocker remediation (`@vue-stately/table`)

1. Unblocked Vue Storybook production build by fixing an export-contract gap in `@vue-stately/table`:
   - `packages/@vue-stately/table/src/index.ts` imported `buildHeaderRows` from `TableCollection.ts`,
   - `TableCollection.ts` did not export `buildHeaderRows`, causing Vite/Rollup build failure.
2. Added a concrete `buildHeaderRows` export in `TableCollection.ts` to satisfy the package index contract and restore build-time symbol resolution.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for `buildHeaderRows` output shape from column definitions.
4. Validation after fix:
   - `CI=1 yarn build:vue:storybook` passed again (build artifacts emitted to `starters/vue/dist/storybook`),
   - Vue test gate still passed (`yarn test:vue`).

### February 27, 2026 — Systemic outside-interaction parity remediation (`@vue-aria/interactions`)

1. Aligned `useInteractOutside` behavior with React reference implementation in shared interaction internals:
   - added owner-document listener binding (`ref` document instead of always global `document`),
   - added non-pointer fallback listeners (`mousedown`/`mouseup`/`touchstart`/`touchend`) for environments without `PointerEvent`,
   - added touch emulated-mouse suppression parity (`ignoreEmulatedMouseEvents`),
   - registered automatic cleanup on Vue scope disposal while preserving explicit stop-function returns.
2. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - pointer-disabled fallback behavior,
   - owner-document listener attachment for iframe-bound refs,
   - listener cleanup on scope disposal.
3. Validation after fix:
   - targeted interact-outside slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "interact-outside|PointerEvent|owner document|scope is disposed|keyboard move events"`,
   - full Vue tests: `yarn test:vue` (459 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic overlay dismissal parity remediation (`@vue-aria/overlays`)

1. Aligned shared `useOverlay` behavior with React interaction semantics:
   - added composing-aware Escape handling (do not dismiss while IME composition is active),
   - switched outside dismissal to press-start/press-end semantics with top-layer race protection,
   - added non-pointer fallback outside handling (`mousedown`/`mouseup`/`touchstart`/`touchend`) for environments without `PointerEvent`,
   - bound global listeners to the overlay owner document instead of always using global `document`,
   - registered scope-disposal cleanup for watcher/listener lifecycle parity.
2. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - composing Escape non-dismiss behavior,
   - outside dismissal behavior across pointer/non-pointer paths,
   - owner-document listener attachment for iframe overlays,
   - `isDismissable` and `shouldCloseOnInteractOutside` predicate behavior,
   - top-most overlay-only outside dismissal behavior,
   - Escape dismissal when `isDismissable` is false (React parity).
3. Validation after fix:
   - targeted overlay slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "overlay trigger, popover|composing Escape|owner document|interact-outside"`,
   - full Vue tests: `yarn test:vue` (464 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic press interaction parity remediation (`@vue-aria/interactions`)

1. Aligned shared `usePress` behavior with React owner-window semantics:
   - switched pointer-up/cancel global listeners from fixed `window` to the press target owner window,
   - added scope-disposal cleanup so active pointer listeners are removed if composables are disposed mid-press.
2. Hardened cross-realm (iframe) target resolution in `usePress`:
   - replaced strict `instanceof Element/Node` checks with realm-safe node detection,
   - preserved press start/end/up dispatch semantics for iframe-hosted targets.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - owner-window pointer listener binding for iframe targets,
   - listener cleanup on scope disposal while press is active.
4. Validation after fix:
   - targeted press slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "press global pointer listeners|scope is disposed mid-press|pointer exits and cancellation|handles vue-aria interactions focus, keyboard, and press callbacks"`,
   - full Vue tests: `yarn test:vue` (466 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic move interaction parity remediation (`@vue-aria/interactions`)

1. Aligned shared `useMove` behavior with React owner-window semantics:
   - switched pointer move/up/cancel global listeners from fixed `window` to the move target owner window,
   - added scope-disposal cleanup to remove active move listeners and restore text selection on disposal.
2. Hardened cross-realm (iframe) target resolution in `useMove`:
   - replaced strict `instanceof Element` checks with realm-safe node detection so iframe-hosted targets are handled correctly.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - owner-window pointer listener binding for iframe move targets,
   - listener cleanup on scope disposal while move tracking is active.
4. Validation after fix:
   - targeted move slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "move global pointer listeners|scope is disposed mid-move|move pointer events with deltas"`,
   - full Vue tests: `yarn test:vue` (468 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic long-press interaction parity remediation (`@vue-aria/interactions`)

1. Aligned shared `useLongPress` behavior with React interaction semantics:
   - moved `continuePropagation()` to run before pointer-type gating (matching React press propagation behavior),
   - dispatched `pointercancel` at threshold and focused target (if needed) before firing `onLongPress`,
   - added touch context-menu suppression lifecycle during long-press with post-`pointerup` cleanup timing parity,
   - added scope-disposal cleanup for pending long-press timers and touch context-menu listeners.
2. Hardened pointer-cancel handling in `usePress` for synthetic/no-`PointerEvent` fallback parity:
   - allow cancel handling when fallback `pointercancel` events omit `pointerId`.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - long-press callback ordering parity (`start` -> `end` -> `press`),
   - canceling regular `usePress` `onPress` after long-press threshold,
   - touch context-menu suppression and cleanup timing.
4. Validation after fix:
   - targeted long-press slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "long press|longpress|context menu"`,
   - full Vue tests: `yarn test:vue` (470 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic hover interaction parity remediation (`@vue-aria/interactions`)

1. Aligned shared `useHover` behavior with React interaction semantics:
   - added global emulated-mouse suppression window after touch interactions (Safari/iOS parity behavior),
   - added hover-end recovery when `pointerleave` is skipped (pointer transitions outside target via global `pointerover` capture),
   - aligned disabled-state teardown to force hover-end callbacks/state reset when hover is active.
2. Hardened shared interaction utilities used by hover/focus paths:
   - updated `getEventTarget` fallback to include native `event.target` semantics,
   - made `nodeContains` realm-safe so iframe/cross-realm node checks do not fail on strict `instanceof` boundaries.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - emulated mouse-hover suppression timing immediately after touch end,
   - hover-end dispatch when pointer exits target without native `pointerleave`.
4. Validation after fix:
   - targeted hover slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "hover|focus-within|emulated mouse|pointer moves outside without pointerleave"`,
   - full Vue tests: `yarn test:vue` (472 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic focus lifecycle parity remediation (`@vue-aria/interactions`)

1. Aligned shared `useFocus` behavior with React focus contract:
   - added active-element ownership gating so focus callbacks only fire when the event target is the document active element,
   - preserved immediate-target filtering (`eventTarget === currentTarget`) for non-descendant focus handling parity.
2. Aligned shared `useFocusWithin` behavior with React focus-within lifecycle semantics:
   - added active-element gating on focus-in paths,
   - added global capture `focus` fallback listener to close focus-within state when native `focusout` is skipped (for example on DOM removal),
   - added disabled-state teardown that emits blur-within lifecycle changes when focus-within is active,
   - added scope-disposal cleanup for global focus listeners.
3. Aligned shared `useFocusable` autofocus timing with React lifecycle expectations:
   - moved autofocus to next-tick lifecycle timing so refs resolved after setup can still receive initial autofocus.
4. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - active-element mismatch suppression in `useFocus`,
   - focus-within disabled teardown and outside-focus fallback without `focusout`,
   - `useFocusable` next-tick autofocus with late ref resolution.
5. Validation after fix:
   - targeted focus slices: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "focus callbacks|focus-within|focusable|focus visibility|handles vue-aria interactions focus"` and `-t "visually hidden props and focus reveal behavior"`,
   - full Vue tests: `yarn test:vue` (475 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### Validation summary (end of current evidence window)

1. Validation gate repeatedly passed through the cleanup window, with the latest logged snapshot:
   - latest typecheck run: `yarn typecheck:vue`
   - component suite: `yarn workspace vue-spectrum-starter test src/components.spec.ts`
   - story parity suite: `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts`
   - full Vue tests: `yarn test:vue` (latest logged: 475 tests passed)
   - latest Storybook build run: `yarn build:vue:storybook`
2. Story/index parity checks remained zero-diff where logged against the React artifact.
3. Known non-blocking warnings remained unchanged throughout (jsdom navigation warning in composition tests; Storybook CSS/chunk-size warnings).
