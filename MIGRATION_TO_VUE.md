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

### February 27, 2026 — Systemic keyboard propagation parity remediation (`@vue-aria/interactions`)

1. Aligned shared event-wrapper semantics in `createEventHandler` with React interaction behavior:
   - keyboard/focus handler wrappers now stop propagation by default,
   - handlers can explicitly opt-in to bubbling via `continuePropagation()`,
   - wrapper lifecycle now cleans temporary compatibility methods after each dispatch.
2. Closed keyboard bubbling contract drift in `useKeyboard` call paths by relying on the updated event wrapper semantics.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - default keyboard non-bubbling behavior,
   - explicit bubbling behavior when `continuePropagation()` is used.
4. Validation after fix:
   - targeted keyboard slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "keyboard bubbling|handles vue-aria interactions focus, keyboard, and press callbacks"`,
   - full Vue tests: `yarn test:vue` (476 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Press responder context parity remediation (`@vue-aria/interactions`)

1. Closed responder-context parity gap in shared press internals:
   - `usePress` now consumes `PressResponder` context and merges responder handlers with local press handlers (React-like chaining order),
   - responder `ref` fallback is now honored when local `ref` is not provided,
   - responder `register` callbacks are now invoked when context is consumed.
2. Updated `PressResponder` context wiring:
   - responder context now provides a `register` implementation that composes parent responder registration.
3. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - responder-context + local handler merge behavior,
   - `ClearPressResponder` behavior that removes responder-context handlers from subsequent `usePress` consumers.
4. Validation after fix:
   - targeted responder slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "press responder|local usePress handlers|clears vue-aria press responder"`,
   - full Vue tests: `yarn test:vue` (478 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Systemic focus-visible modality parity remediation (`@vue-aria/interactions`)

1. Aligned shared `useFocusVisible` global-modality tracking with React interaction semantics:
   - added virtual-click detection (`click` with `detail === 0`) to drive virtual modality updates,
   - ignored untrusted/global focus targets for virtual-modality inference (`window`/`document` focus edge cases),
   - added pointer/mouse move + up modality tracking to prevent stale keyboard modality after pointer movement,
   - added per-window `HTMLElement.prototype.focus` patching to mark pre-focus input activity, with teardown restore.
2. Hardened global listener lifecycle for tracked windows:
   - added `beforeunload` cleanup to remove iframe/window listeners deterministically,
   - aligned teardown to remove all newly introduced listeners and restore patched focus behavior.
3. Closed handler-leak parity gaps:
   - added scope-dispose cleanup for reactive `useInteractionModality` subscribers,
   - added scope-dispose cleanup for `useFocusVisibleListener` subscribers.
4. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - virtual-click modality behavior in `useFocusVisible`,
   - iframe `beforeunload` teardown behavior for cross-window focus tracking,
   - reactive interaction-modality handler cleanup on Vue scope disposal.
5. Validation after fix:
   - targeted focus-visible slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "focus ring modality|virtual clicks|beforeunload|interaction-modality handlers|focus-visible"`,
   - full Vue tests: `yarn test:vue` (481 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `focusSafely`/text-selection/scroll-wheel parity remediation (`@vue-aria/interactions`)

1. Aligned shared `focusSafely` behavior with React interaction contract:
   - focus now always uses prevent-scroll semantics (`focusWithoutScrolling` behavior),
   - virtual-modality focus now waits for post-transition scheduling before moving focus,
   - delayed focus now guards disconnected targets (no focus call when element is removed before callback).
2. Aligned shared text-selection state machine with React move-gesture behavior:
   - replaced iOS counter logic with explicit `default -> disabled -> restoring` lifecycle to avoid race conditions,
   - restored iOS delay + post-transition restore timing (`300ms` + transition callback),
   - retained per-element non-iOS `user-select` save/restore behavior.
3. Closed shared listener lifecycle drift in `useScrollWheel`:
   - added scope-dispose cleanup so composables remove wheel listeners on unmount even when caller does not keep the returned stop function.
4. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - delayed virtual `focusSafely` behavior and disconnected-element guard,
   - iOS and non-iOS text-selection restore behavior,
   - `useScrollWheel` listener cleanup on scope disposal.
5. Validation after fix:
   - targeted interaction slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "focusSafely|text selection|scroll wheel|long press|move"`,
   - full Vue tests: `yarn test:vue` (485 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `useMove` fallback parity remediation (`@vue-aria/interactions`)

1. Closed shared pointer-availability parity gap in `useMove`:
   - added `mousemove`/`mouseup` fallback path when `PointerEvent` is unavailable,
   - added `touchstart`/`touchmove`/`touchend`/`touchcancel` fallback path with touch-identifier tracking.
2. Kept owner-window listener behavior consistent across pointer and fallback modes:
   - global listeners now bind/remove on the pressed element’s owner window for both pointer and mouse fallback flows.
3. Extended move cleanup parity:
   - scope disposal now removes whichever global listener set is active (pointer or mouse fallback).
4. Added regression coverage in `starters/vue/src/composition.spec.ts` for:
   - explicit mouse and touch fallback move paths with `PointerEvent` unavailable,
   - owner-window listener binding/removal in both pointer and fallback modes,
   - disposal cleanup assertions in both pointer and fallback modes.
5. Validation after fix:
   - targeted move slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "move pointer events|falls back to vue-aria mouse move|falls back to vue-aria touch move|move global listeners|move global pointer listeners"`,
   - full Vue tests: `yarn test:vue` (487 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `useFocusable` disabled-context parity remediation (`@vue-aria/interactions`)

1. Closed shared disabled-state context drift in `useFocusable`:
   - context-provided focus/keyboard handlers from `FocusableProvider` are now skipped when `isDisabled` is true, matching React’s disabled interaction contract.
2. Added regression coverage in `starters/vue/src/composition.spec.ts`:
   - disabled focusables no longer trigger provider context handlers,
   - disabled focusables keep undefined tab stop semantics.
3. Validation after fix:
   - targeted focusable slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "auto-focuses vue-aria focusable|skips vue-aria focusable provider handlers|falls back to vue-aria mouse move|falls back to vue-aria touch move|move global listeners"`,
   - full Vue tests: `yarn test:vue` (488 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Pressable` focusability parity remediation (`@vue-aria/interactions`)

1. Aligned shared `Pressable` behavior with React expectations:
   - `Pressable` now composes `usePress` with `useFocusable` instead of returning raw `usePress`,
   - merged keyboard/focus handlers and `tabindex` focusability semantics are now included in returned `pressProps`.
2. Expanded shared press-props contract typing:
   - `PressDOMProps` now includes optional `onFocus` and `tabindex` keys to reflect merged focusable behavior.
3. Added regression coverage in `starters/vue/src/composition.spec.ts`:
   - non-native `Pressable` targets now expose `tabindex` and focus handlers,
   - keyboard activation still triggers `onPress` with merged props.
4. Validation after fix:
   - targeted pressable slice: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "pressable|focusable provider|auto-focuses vue-aria focusable|press callbacks"`,
   - full Vue tests: `yarn test:vue` (489 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `useMove` parity test-surface expansion (`@vue-aria/interactions`)

1. Expanded regression coverage in `starters/vue/src/composition.spec.ts` by porting additional React `useMove` contracts:
   - right-click starts are ignored,
   - click-without-move produces no move lifecycle events,
   - nested parent/child move handlers do not both fire (child interaction does not bubble to parent move start).
2. Validation after coverage expansion:
   - targeted move assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "right click|only clicks without movement|bubble vue-aria move starts|falls back to vue-aria mouse move|move pointer events"`,
   - full Vue tests: `yarn test:vue` (492 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `usePress` disabled-click and focus parity remediation (`@vue-aria/interactions`)

1. Closed shared disabled-click ordering drift in `usePress`:
   - `props.onClick` is now invoked only after disabled and ignored-click guards,
   - disabled press targets no longer trigger user click callbacks.
2. Expanded regression coverage in `starters/vue/src/composition.spec.ts`:
   - press targets focus on pointer interaction by default,
   - `preventFocusOnPress` suppresses pointer focus transfer,
   - disabled press targets do not invoke `onPress` or `onClick`.
3. Validation after fix:
   - targeted press assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "focuses vue-aria press targets|preventFocusOnPress|does not fire vue-aria press or click callbacks when disabled"`,
   - full Vue tests: `yarn test:vue` (495 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `TooltipTrigger` delay/default-mode parity remediation (`@vue-aria/tooltip`, `@vue-spectrum/tooltip`)

1. Closed shared trigger-mode and disabled-close drift in `@vue-aria/tooltip`:
   - `useTooltipTrigger` now defaults to hover+focus behavior (React-like default),
   - close paths are no longer blocked when `isDisabled` is true (only opening is blocked),
   - hook now supports delegated `open`/`close` handlers so state timing behavior can be sourced from stately state.
2. Rewired `@vue-spectrum/tooltip` trigger internals to use `useTooltipTriggerState` timing semantics:
   - `delay` and `closeDelay` now drive hover warmup/cooldown behavior through shared state,
   - trigger open/close emits remain aligned through the shared state `onOpenChange` lifecycle.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: default tooltip trigger hover-open behavior when `trigger` is unspecified,
   - `starters/vue/src/components.spec.ts`: hover delay/closeDelay timing and close-while-disabled behavior for `TooltipTrigger`.
4. Validation after fix:
   - targeted tooltip hook assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "defaults vue-aria tooltip trigger to hover behavior|computes vue-aria tooltip trigger and tooltip hover/focus linkage"`,
   - targeted tooltip component assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "tooltip trigger delay and closeDelay timing|closes tooltip trigger when disabled after opening|supports defaultOpen and isOpen control aliases on tooltip trigger|emits close updates from tooltip trigger keyboard interactions"`,
   - full Vue tests: `yarn test:vue` (498 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `FileTrigger` directory-attribute contract parity (`vue-aria-components`, `@vue-spectrum/filetrigger`)

1. Closed hidden-input directory attribute drift in `VueFileTrigger`:
   - `webkitdirectory` now follows boolean-attribute parity (`""` when enabled),
   - removed Vue-only `directory` attribute that React does not emit.
2. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: explicit `acceptDirectory` DOM-contract assertions for hidden file input,
   - `starters/vue/src/storybook-parity.spec.ts`: React-aria story parity now asserts boolean `webkitdirectory` contract.
3. Validation after fix:
   - targeted file-trigger assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "file trigger"`,
   - full Vue tests: `yarn test:vue` (499 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `DropZone` modality + disabled-drop parity (`vue-aria-components`)

1. Closed shared dropzone interaction drift in `VueDropZone`:
   - keyboard modality now resets on pointer/mouse down,
   - pointer-focused drop zones no longer keep stale keyboard `data-focus-visible` state,
   - disabled RAC dropzones no longer emit `drop` events.
2. Added regression coverage:
   - `starters/vue/src/storybook-parity.spec.ts` asserts `data-focus-visible` appears after keyboard focus and clears after pointer interaction + refocus for RAC dropzone stories,
   - `starters/vue/src/components.spec.ts` asserts disabled RAC dropzones do not emit `drop`.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "drop zone|file trigger"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "dropzone stories|file trigger stories"`,
   - full Vue tests: `yarn test:vue` (500 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ContextualHelp` trigger-labeling/class parity (`@vue-spectrum/contextualhelp`)

1. Closed trigger-labeling and attribute-target drift in `ContextualHelp` internals:
   - default info trigger label now matches React contract (`aria-label="Information"`),
   - trigger `aria-label` now defers to explicit `aria-labelledby` when provided,
   - user-provided `aria-label` overrides default labels on the trigger.
2. Closed custom class forwarding drift:
   - component-level `class` now lands on the trigger button (React-like behavior), not the wrapper shell.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct parity assertions for default/custom trigger labeling and class forwarding,
   - `starters/vue/src/storybook-parity.spec.ts`: story-level assertions for info label, `aria-labelledby`, and `with button` class forwarding.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "contextual help"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "contextual help"`,
   - full Vue tests: `yarn test:vue` (502 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Picker` aria-labelling ownership parity (`@vue-spectrum/picker`)

1. Closed picker trigger-labelling drift so accessibility attributes land on the interactive control:
   - `aria-labelledby` now applies to the internal `<select>` (not the wrapper shell),
   - visible label wiring now uses a deterministic label id and contributes to `aria-labelledby`,
   - `aria-label` is suppressed when any `aria-labelledby` source exists.
2. Hardened root-attribute passthrough:
   - prevented `aria-label`, `aria-labelledby`, and `autofocus` from being duplicated on the wrapper label element.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: picker aria-label vs aria-labelledby precedence and ownership assertions,
   - `starters/vue/src/storybook-parity.spec.ts`: `LabelledBy` story now asserts select-level `aria-labelledby` parity.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "picker aria"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "picker labelledby"`,
   - full Vue tests: `yarn test:vue` (504 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — single `DatePicker` aria-labelling ownership parity (`@vue-spectrum/datepicker`)

1. Closed single-date-picker accessibility-label drift:
   - stopped deriving input `aria-label` from visible `label` text,
   - `aria-label` is now only sourced from explicit attribute usage when no `aria-labelledby` sources exist,
   - preserved/combined visible label and external `aria-labelledby` wiring on the input.
2. Hardened root attribute passthrough:
   - removed `aria-label`, `aria-labelledby`, and `autofocus` passthrough from the wrapper label to avoid duplicated/non-interactive labeling.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: single DatePicker aria-label/aria-labelledby precedence and ownership assertions,
   - `starters/vue/src/storybook-parity.spec.ts`: custom-calendar DatePicker story now asserts labelledby/no-label contract on the input.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "datepicker aria"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "date picker custom calendar stories"`,
   - full Vue tests: `yarn test:vue` (505 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `DateRangePicker` aria-labelling ownership parity (`@vue-spectrum/datepicker`)

1. Closed date-range labeling ownership drift in component internals:
   - added explicit field-level aria contract (`aria-label` or `aria-labelledby`) on the root fieldset from external props/visible label context,
   - start/end inputs now derive `aria-labelledby` from the same field-level label source instead of label-only wiring,
   - preserved semantic start/end input labels (`aria-label="Start date"` / `aria-label="End date"`).
2. Hardened root attribute passthrough:
   - filtered `aria-label`, `aria-labelledby`, and `autofocus` from blind wrapper passthrough to avoid duplicate/leaked contracts.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: DateRangePicker aria precedence/ownership assertions for visible label, external `aria-labelledby`, and external `aria-label`,
   - `starters/vue/src/storybook-parity.spec.ts`: DateRangePicker custom-calendar story asserts labelledby ownership and semantic start-label contract.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "date range picker aria"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "date picker custom calendar stories"`,
   - full Vue tests: `yarn test:vue` (506 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `SearchAutocomplete` aria-labelling ownership parity (`@vue-spectrum/autocomplete`)

1. Closed search-autocomplete labelling ownership drift:
   - visible labels now contribute through `aria-labelledby` on the interactive search input,
   - external `aria-labelledby` now composes with visible-label ids,
   - explicit `aria-label` is only applied when no `aria-labelledby` source is present.
2. Hardened root attribute passthrough:
   - filtered `aria-label`, `aria-labelledby`, and `autofocus` from wrapper passthrough so accessibility attributes are not duplicated on non-interactive wrapper nodes.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct aria precedence/ownership assertions for SearchAutocomplete (`aria-label` vs `aria-labelledby`),
   - `starters/vue/src/storybook-parity.spec.ts`: SearchAutocomplete story parity now asserts labeled and no-visible-label ARIA contracts.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "search autocomplete aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "search autocomplete icon and avatar scenarios"`,
   - full Vue tests: `yarn test:vue` (507 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ColorField` aria-labelling ownership parity (`@vue-spectrum/color`)

1. Closed `ColorField` accessibility ownership drift:
   - visible label text now contributes through input-level `aria-labelledby`,
   - external `aria-labelledby` composes with visible label ids,
   - explicit `aria-label` only applies when no `aria-labelledby` source exists.
2. Hardened root attribute passthrough:
   - filtered `aria-label`, `aria-labelledby`, and `autofocus` from wrapper passthrough to avoid duplicate/non-interactive label ownership.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: ColorField aria precedence/ownership assertions for external `aria-labelledby`, visible label + external label composition, and `aria-label` fallback,
   - `starters/vue/src/storybook-parity.spec.ts`: Spectrum `ColorField` stories now assert input-level labelledby/label contracts for default, `AriaLabelledBy`, and no-visible-label cases.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "color field aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "spectrum color field stories with input-level aria labelling parity"`,
   - full Vue tests: `yarn test:vue` (509 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ColorSlider` aria-labelling ownership parity (`@vue-spectrum/color`)

1. Closed `ColorSlider` accessibility ownership drift:
   - visible slider labels now contribute through input-level `aria-labelledby`,
   - external `aria-labelledby` composes with visible slider label ids,
   - explicit `aria-label` now applies only when no `aria-labelledby` source exists.
2. Hardened root attribute passthrough:
   - filtered `aria-label`, `aria-labelledby`, and `autofocus` from wrapper passthrough to prevent duplicate/non-interactive label ownership.
3. Closed story arg passthrough drift in `ColorSlider` stories:
   - `aria-label`/`aria-labelledby` args now flow through `toSliderProps` into live component rendering instead of being dropped.
4. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: ColorSlider aria precedence/ownership assertions for external `aria-labelledby`, visible label composition, and `aria-label` fallback,
   - `starters/vue/src/storybook-parity.spec.ts`: Spectrum ColorSlider story parity now asserts labelled and no-visible-label ARIA contracts.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "color slider aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "spectrum color slider stories with input-level aria labelling parity"`,
   - full Vue tests: `yarn test:vue` (511 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `NumberField` aria-labelling ownership parity (`@vue-spectrum/numberfield`)

1. Closed `NumberField` accessibility ownership drift:
   - visible labels now contribute through input-level `aria-labelledby`,
   - external `aria-labelledby` now composes with visible label ids,
   - explicit `aria-label` is only applied when no `aria-labelledby` source exists.
2. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: NumberField aria precedence/ownership assertions for external `aria-labelledby`, visible label + external composition, and `aria-label` fallback,
   - `starters/vue/src/storybook-parity.spec.ts`: Spectrum NumberField stories now assert labelled/default/no-visible-label ARIA contracts.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "numberfield aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "spectrum numberfield stories with input-level aria labelling parity"`,
   - full Vue tests: `yarn test:vue` (513 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ComboBox` aria-label precedence parity (`@vue-spectrum/combobox`)

1. Closed `ComboBox` aria precedence drift when visible label ids are present:
   - `aria-label` is now suppressed whenever computed `aria-labelledby` exists (visible label and/or external `aria-labelledby`),
   - input-level ownership now mirrors React precedence for external label ids, visible label ids, and explicit `aria-label`.
2. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct `ComboBox` aria precedence/ownership assertions for external `aria-labelledby`, visible-label composition, and `aria-label` fallback,
   - `starters/vue/src/storybook-parity.spec.ts`: `UserProvidedLabel` story now asserts input-level combined labelledby ownership and no wrapper-level aria leakage.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "combobox aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "combobox"`,
   - full Vue tests: `yarn test:vue` (515 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Slider`/`RangeSlider` group-input ARIA ownership parity (`@vue-spectrum/slider`)

1. Closed slider group/input labeling drift against React:
   - slider and range slider roots now expose explicit `role="group"` ownership with group-level `aria-label`/`aria-labelledby`,
   - visible slider labels now get deterministic ids and participate in group labeling,
   - single-slider thumb input now uses `aria-labelledby` ownership (label id when visible, otherwise group id), with no direct `aria-label` fallback from `label`.
2. Closed range-slider thumb labeling drift:
   - range thumbs now keep React-like semantic names (`aria-label="Minimum"` / `aria-label="Maximum"`),
   - each range thumb now composes `aria-labelledby` as `"<thumb-id> <group-or-label-id>"` to align with React thumb naming behavior.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct Slider/RangeSlider aria ownership assertions for visible labels, external `aria-labelledby`, and no-visible-label `aria-label` flows,
   - `starters/vue/src/storybook-parity.spec.ts`: slider story parity now asserts group/input aria ownership contracts for both single and range stories.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "slider aria label and labelledby ownership|range slider aria label and labelledby ownership"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "slider stories"`,
   - full Vue tests: `yarn test:vue` (518 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `TextField`/`SearchField` labelledby composition parity (`@vue-spectrum/textfield`, `@vue-spectrum/searchfield`)

1. Closed label composition drift in both field components:
   - external `aria-labelledby` now composes with visible label ids on the input instead of replacing visible-label ownership,
   - explicit `aria-label` is now only applied when no `aria-labelledby` source exists.
2. Preserved ownership target parity:
   - accessibility attributes continue to land on the interactive input/search elements,
   - wrapper shells remain free of duplicated `aria-label`/`aria-labelledby` leakage.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct TextField and SearchField precedence/ownership assertions for visible label + external `aria-labelledby` composition and `aria-label` fallback,
   - `starters/vue/src/storybook-parity.spec.ts`: spectrum TextField/SearchField stories now assert default visible-label and no-visible-label input-level aria contracts.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "textfield aria label and labelledby precedence|searchfield aria label and labelledby precedence"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "textfield and searchfield stories with input-level aria labelling parity"`,
   - full Vue tests: `yarn test:vue` (521 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Checkbox`/`Radio` label composition parity (`@vue-spectrum/checkbox`, `@vue-spectrum/radio`)

1. Closed individual control labelling drift:
   - visible checkbox/radio labels now get deterministic ids,
   - input-level `aria-labelledby` now composes visible-label ids with external `aria-labelledby`,
   - explicit `aria-label` is now only used when no composed `aria-labelledby` source exists.
2. Closed group-level label composition drift:
   - `CheckboxGroup` and `RadioGroup` now compose visible group-label ids with external `aria-labelledby` on the interactive group node (`role="group"` / `role="radiogroup"`),
   - group `aria-label` now defers when a composed `aria-labelledby` exists.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: parity assertions for individual and group controls across checkbox/radio, including visible label + external `aria-labelledby` composition and `aria-label` fallback.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "checkbox aria label and labelledby precedence|checkbox group aria label and labelledby precedence|radio aria label and labelledby precedence|radio group aria label and labelledby precedence"`,
   - full Vue tests: `yarn test:vue` (525 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Switch` label composition parity (`@vue-spectrum/switch`)

1. Closed switch input-labelling drift:
   - visible switch labels now get deterministic ids and contribute to input-level `aria-labelledby`,
   - external `aria-labelledby` now composes with visible label ids on the input,
   - explicit `aria-label` is now only applied when no composed `aria-labelledby` exists.
2. Hardened ownership target behavior:
   - filtered `aria-label`/`aria-labelledby` from wrapper passthrough so accessibility ownership remains on the interactive switch input.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: direct switch parity assertions for visible label + external `aria-labelledby` composition and no-visible-label `aria-label` fallback.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "switch aria label and labelledby precedence|updates model value from switch change|maps switch hovered, focus-ring, and disabled states"`,
   - full Vue tests: `yarn test:vue` (526 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ProgressBar`/`ProgressCircle` ARIA + DOM-prop parity (`@vue-spectrum/progress`, `@vue-aria/progress`)

1. Closed shared progress labelling composition drift in `@vue-aria/progress`:
   - visible progress labels now compose with external `aria-labelledby` instead of replacing it,
   - when both `aria-label` and composed `aria-labelledby` are present, progressbar id now participates in `aria-labelledby` to match React `useLabels` semantics.
2. Closed DOM-prop passthrough drift in `@vue-spectrum/progress`:
   - root progress elements now forward labelable/custom DOM attributes (for example `data-testid`, `aria-describedby`) like React.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: progress parity assertions for composed `aria-labelledby` ownership and custom DOM prop passthrough on both bar/circle surfaces.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "progress bar DOM contract|progress aria-labelledby composition and custom DOM prop passthrough|progress circle DOM contract"`,
   - full Vue tests: `yarn test:vue` (527 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `Meter` ARIA + value-format parity (`@vue-spectrum/meter`, `@vue-aria/meter`)

1. Closed shared meter labelling composition drift in `@vue-aria/meter`:
   - visible meter labels now compose with external `aria-labelledby`,
   - when both `aria-label` and composed `aria-labelledby` are present, meter id now participates in `aria-labelledby` to match React `useLabels` semantics.
2. Closed meter value-text parity drift in `@vue-spectrum/meter`:
   - switched component ownership to shared `useMeter` semantics for `aria-valuetext` formatting and labeling,
   - fixed percent-format behavior so `formatOptions.style: 'percent'` uses normalized percentage semantics instead of formatting raw absolute values.
3. Preserved/extended DOM contract parity:
   - root meter still forwards labelable/custom DOM props (`data-testid`, `aria-describedby`) while keeping meter role/value ownership on the interactive root.
4. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: meter aria composition + percent-format + DOM-prop passthrough assertions,
   - `starters/vue/src/composition.spec.ts`: `useMeter` composition assertions for visible label + external `aria-labelledby` + `aria-label`.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "maps meter variant state classes|maps meter aria composition, percent formatting, and DOM prop passthrough"` and `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria meter range, labels, and value text"`,
   - full Vue tests: `yarn test:vue` (528 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — `ContextualHelp` useLabels parity (`@vue-spectrum/contextualhelp`)

1. Closed `aria-label` + `aria-labelledby` composition drift on the help trigger:
   - when both are provided, trigger `aria-labelledby` now composes the trigger id with external ids (React `useLabels` parity),
   - trigger id is now explicit and stable (user-provided `id` honored, generated fallback otherwise).
2. Preserved existing trigger-label contracts:
   - default `Help`/`Information` labels remain unchanged,
   - `aria-labelledby`-only usage still suppresses `aria-label`.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: explicit `aria-label` + `aria-labelledby` + `id` composition assertions on ContextualHelp trigger,
   - `starters/vue/src/storybook-parity.spec.ts`: contextual help story parity now asserts the same composed trigger labeling contract.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "contextual help trigger aria labeling and class forwarding"` and `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "contextual help stories with trigger aria and class parity contracts"`,
   - full Vue tests: `yarn test:vue` (528 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Shared `useLabels`/`useLabel` parity remediation (`@vue-aria/utils`, `@vue-aria/label`)

1. Aligned shared ARIA label-composition semantics with React:
   - `useLabels` now composes the element id into `aria-labelledby` when both `aria-label` and `aria-labelledby` are present,
   - preserved default-label fallback behavior only when both `aria-label` and `aria-labelledby` are absent.
2. Aligned `useLabel` field prop behavior with shared semantics:
   - `useLabel` now routes final field labeling through `useLabels`, preserving visible-label id composition plus React-like self-id inclusion for dual-label cases.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit assertions for composed `useLabel` field semantics and shared `useLabels` id-composition behavior.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria label and field accessibility relationships|computes vue-aria utility helpers"`,
   - full Vue tests: `yarn test:vue` (528 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Shared `useSelect` ARIA labelling parity (`@vue-aria/select`)

1. Aligned trigger/menu labelling semantics with React dual-label behavior:
   - composed visible label ids with external `aria-labelledby`,
   - added trigger-id participation when `aria-label` and labelledby sources coexist,
   - aligned aria-label-only flows so trigger/menu `aria-labelledby` still reference trigger ownership.
2. Preserved select interaction contracts:
   - open/toggle/keyboard/selection behavior unchanged while labelling ownership was corrected.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit `useSelect` assertions for combined `label` + `aria-label` + `aria-labelledby` and aria-label-only ownership contracts.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria select trigger, menu selection, and hidden select wiring"`,
   - full Vue tests: `yarn test:vue` (528 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Shared `useSearchField` ARIA labelling parity (`@vue-aria/searchfield`)

1. Aligned searchfield input labelling semantics with React dual-label behavior:
   - visible label ids now compose with external `aria-labelledby`,
   - input id now participates in `aria-labelledby` when `aria-label` coexists with labelledby sources.
2. Preserved search interaction contracts:
   - submit/clear/readOnly/required behavior unchanged; only ownership and aria composition updated.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit `useSearchField` assertions for combined `label` + `aria-label` + `aria-labelledby` and no-visible-label dual-label flows.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria search field submit and clear behavior"`,
   - full Vue tests: `yarn test:vue` (528 passed),
   - typecheck: `yarn typecheck:vue`,
   - Storybook build: `CI=1 yarn build:vue:storybook`.

### February 27, 2026 — Shared `useNumberField` ARIA + stepper-labelling parity (`@vue-aria/numberfield`)

1. Aligned numberfield input labelling semantics with React dual-label behavior:
   - visible label id now composes with external `aria-labelledby`,
   - input id now participates in `aria-labelledby` when `aria-label` coexists with labelledby sources.
2. Aligned stepper button labelling semantics with React:
   - default button names now derive from field label ownership (`Increase <fieldLabel>` / `Decrease <fieldLabel>`),
   - labelledby-only flows now generate stepper button ids and compose `aria-labelledby` as `"<button-id> <field-labelledby>"`,
   - both stepper buttons now expose `aria-controls` pointing at the input id.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: numberfield assertions for composed input `aria-labelledby` ownership and stepper button aria-label/labelledby/controls behavior.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "number field"`,
   - full Vue tests: `yarn test:vue` (529 passed).

### February 27, 2026 — Shared `useRadioGroup`/`useRadio` ARIA composition parity (`@vue-aria/radio`)

1. Aligned radio-group labeling semantics with React dual-label behavior:
   - visible group label id now composes with external `aria-labelledby`,
   - group id now participates in `aria-labelledby` when `aria-label` coexists with labelledby sources.
2. Closed shared radio input prop-surface drift:
   - `useRadio` now accepts and forwards `aria-labelledby` on the input, matching React radio input labeling support.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: radio-group assertions for composed `aria-labelledby` ownership and radio input `aria-labelledby` passthrough.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "radio group|radio input labelling"`,
   - full Vue tests: `yarn test:vue` (530 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useSlider`/`useSliderThumb` ARIA composition parity (`@vue-aria/slider`)

1. Aligned slider group labeling semantics with React dual-label behavior:
   - visible slider label id now composes with external `aria-labelledby`,
   - slider id now participates in group `aria-labelledby` when `aria-label` coexists with labelledby sources.
2. Aligned slider-thumb labeling semantics with React `useLabel` ownership:
   - `sliderData` id now follows label ownership (`labelId` when visible label exists, otherwise slider id),
   - thumb `aria-labelledby` now composes slider label ownership + external ids,
   - thumb id now participates in `aria-labelledby` when thumb `aria-label` coexists with labelledby sources.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: slider/slider-thumb assertions for composed group and thumb `aria-labelledby` ownership, including self-id composition.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "slider track and thumb interactions|slider and thumb labelledby ownership"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useListBox` ARIA composition parity (`@vue-aria/listbox`)

1. Aligned listbox labeling semantics with React dual-label behavior:
   - visible listbox label id now composes with external `aria-labelledby`,
   - listbox id now participates in `aria-labelledby` when `aria-label` coexists with labelledby sources.
2. Preserved list contract behavior:
   - listbox role/selection semantics and list-data wiring remain unchanged while labeling ownership is corrected.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit listbox assertions for combined visible-label + external `aria-labelledby` + `aria-label` ownership.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "listbox options, sections, and list data ids"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useTabList`/`useTabPanel` label-composition parity (`@vue-aria/tabs`)

1. Aligned tablist label ownership semantics with React `useLabels` behavior:
   - tablist now preserves explicit `aria-label` even when `aria-labelledby` is present,
   - when both are present, tablist id now participates in `aria-labelledby`.
2. Aligned tabpanel label ownership semantics with React `useLabels` behavior:
   - tabpanel now preserves explicit `aria-label` while still composing selected-tab ownership,
   - when `aria-label` coexists with panel/tab `aria-labelledby` sources, panel id now participates in `aria-labelledby`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit tablist/tabpanel assertions for dual-label composition and self-id ownership.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tabs semantics and manual activation behavior"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useTreeItem` expander-label parity (`@vue-aria/tree`)

1. Aligned tree-item expander labeling with React `useLabels` behavior:
   - expander button now composes `aria-label` + row `aria-labelledby` through shared label semantics,
   - expander id now participates in `aria-labelledby` when label + labelledby coexist.
2. Preserved tree interaction behavior:
   - expand/collapse action, disabled gating, and row/grid semantics remain unchanged.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: tree-item assertions for expander `aria-labelledby` composition (`row-id` + expander id).
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "treegrid semantics and expandable tree item behavior"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useGridListSection` label-composition parity (`@vue-aria/gridlist`)

1. Aligned gridlist section rowgroup labeling with React `useLabels` behavior:
   - rowgroup now composes section heading ownership through shared label semantics,
   - rowgroup id now participates in `aria-labelledby` when `aria-label` coexists with heading `aria-labelledby`.
2. Preserved section structure semantics:
   - section row/rowheader/rowgroup roles and item behavior remain unchanged.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: section rowgroup assertions for composed `aria-labelledby` ownership (`rowheader-id` + rowgroup id).
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "gridlist semantics, item state, and section props"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useStepList` label precedence parity (`@vue-aria/steplist`)

1. Aligned steplist label precedence with React behavior:
   - list now keeps `aria-label` (explicit or default `"Step list"`) even when `aria-labelledby` is present,
   - external `aria-labelledby` is preserved without suppressing the list label.
2. Preserved steplist interaction behavior:
   - item selection/disabled/current-step semantics and keyboard handling remain unchanged.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: steplist assertions for labelledby-only and explicit-label-plus-labelledby combinations.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "steplist list and step item semantics"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useAutocomplete` collection-labelling parity (`@vue-aria/autocomplete`)

1. Aligned autocomplete collection labelling with React `useLabels` behavior:
   - listbox collection now exposes stable labelable props (`id`, `aria-label`, `aria-labelledby`) instead of role-only output,
   - default collection label now matches React intent (`"Suggestions"`),
   - when `aria-label` and `aria-labelledby` coexist, collection id now participates in `aria-labelledby`.
2. Preserved autocomplete filtering behavior:
   - item filtering and focused-key behavior remain unchanged.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions for default collection label and composed `aria-label` + `aria-labelledby` ownership.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "filters autocomplete items and exposes focused key"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared grid/table selection-checkbox id/label parity (`@vue-aria/grid`, `@vue-aria/table`)

1. Aligned row-selection checkbox contract with React:
   - `useGridSelectionCheckbox` now emits stable checkbox ids and `onChange` handlers on checkbox props,
   - `useTableSelectionCheckbox` now composes `aria-labelledby` as `"<checkbox-id> <row-labelledby>"` when row labelling is provided.
2. Preserved selection behavior:
   - toggle selection semantics remain unchanged for row and table selection flows.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: table-wrapper assertions for checkbox id presence and composed row-labelledby ownership.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "grid semantics plus row and cell selection behavior|table wrappers and selection helpers"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared color area/wheel label-ownership parity (`@vue-aria/color`)

1. Aligned `useColorArea` labelling ownership with shared `useLabels` semantics:
   - area now supports `id`, `aria-label`, and `aria-labelledby` inputs,
   - default area label now matches React intent (`"Color picker"`),
   - when `aria-label` and `aria-labelledby` coexist, area id now participates in `aria-labelledby`.
2. Aligned `useColorWheel` labelling ownership with shared `useLabels` semantics:
   - wheel now supports `id`, `aria-label`, and `aria-labelledby` inputs,
   - default wheel label now resolves to `"Hue"` when no explicit label is provided,
   - dual-label flows now compose wheel id into `aria-labelledby`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions for default labels and dual-label ownership on both color area and color wheel hooks.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "updates vue-aria color area, wheel, and swatch props"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared calendar label-ownership parity (`@vue-aria/calendar`)

1. Aligned `useCalendar` and `useRangeCalendar` accessibility ownership with React calendar-base semantics:
   - calendar roots now expose labelable props (`id`, `aria-label`, `aria-labelledby`) via shared `useLabels`,
   - visible-range text now contributes to computed `aria-label`,
   - dual-label flows now compose calendar id into `aria-labelledby`.
2. Aligned `useCalendarGrid` accessibility ownership with React calendar-grid semantics:
   - grid now exposes labelable props (`id`, `aria-label`, `aria-labelledby`) via shared `useLabels`,
   - visible-range text now contributes to the grid label,
   - dual-label flows now compose grid id into `aria-labelledby`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit calendar/range/grid assertions for role + composed label ownership (`aria-label` + `aria-labelledby` + self-id composition).
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "calendar navigation and date selection|builds calendar grid and cell selection for date and range flows"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 27, 2026 — Shared `useGrid` aria prop-surface parity (`@vue-aria/grid`)

1. Aligned grid labelable prop surface with React:
   - `useGrid` now accepts both dashed and camel ARIA naming (`aria-label`/`aria-labelledby` and aliases),
   - emitted grid props now resolve labels from either path.
2. Added missing accessibility warning parity:
   - in development, `useGrid` now warns when neither `aria-label` nor `aria-labelledby` is provided.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions for dashed `aria-label` passthrough and missing-label warning behavior.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "grid semantics plus row and cell selection behavior"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Shared `useGridList`/`useMenu` label-warning parity (`@vue-aria/gridlist`, `@vue-aria/menu`)

1. Aligned `useGridList` label prop forwarding and id behavior with React expectations:
   - `useGridList` now accepts and forwards dashed label props (`aria-label`/`aria-labelledby`) in addition to camel aliases,
   - row id derivation now uses the resolved grid id contract instead of a static fallback id.
2. Aligned `useGridListSection` label input surface with React:
   - section hooks now accept dashed `aria-label` and compose it consistently with existing label logic.
3. Closed missing accessibility warning parity in `useMenu`:
   - `useMenu` now emits the React warning when neither `aria-label` nor `aria-labelledby` is provided (dev only),
   - menu label resolution now uses shared computed label paths for camel/dashed aliases.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: new assertions for dashed gridlist/menu/section labels and missing-label warning behavior.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria gridlist semantics, item state, and section props|computes vue-aria menu trigger and item selection semantics"`,
   - full Vue tests: `yarn test:vue` (531 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `Radio` roving-tabindex and label-warning parity (`@vue-spectrum/radio`)

1. Aligned group keyboard tab-stop ownership with React `useRadio` behavior:
   - radios inside `RadioGroup` now use roving tabindex semantics (`0` only for selected option, otherwise first enabled/last focused option; non-active options get `-1`),
   - disabled options no longer expose a tabbable `tabindex`.
2. Added group-level option registry/focus tracking in component internals:
   - `RadioGroup` now tracks option order/disabled state and last-focused option to support React-like fallback behavior when no value is selected.
3. Closed missing accessibility warning parity in `Radio`:
   - in development, unlabeled radios (no visible label + no aria label props) now emit the React warning.
4. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: roving tabindex assertions (selected/no-selection/disabled-leading option) and missing-label warning assertion.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "maps radio group field contract and radio state classes|matches radio roving tabindex behavior with group selection parity|maps radio aria label and labelledby precedence to react parity"`,
   - full Vue tests: `yarn test:vue` (532 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Placeholder deprecation warning parity (`@vue-spectrum/*` text-entry components)

1. Aligned placeholder deprecation warnings with React for Spectrum text-entry components:
   - `@vue-spectrum/textfield` now warns for `TextField` and `TextArea` placeholder usage with React-matching messages/docs links,
   - `@vue-spectrum/searchfield`, `@vue-spectrum/combobox`, and `@vue-spectrum/autocomplete` now emit matching placeholder deprecation warnings,
   - `@vue-spectrum/color` `ColorField` now emits the matching placeholder warning when placeholder is explicitly provided.
2. Preserved component behavior contracts:
   - no input/event/state ownership changes; this patch only closes missing dev-warning parity.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: explicit warning assertions across TextField/TextArea/SearchField/ComboBox/SearchAutocomplete/ColorField placeholder scenarios.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "warns on deprecated placeholder usage for text entry components|maps searchfield field contract, aria wiring, icon variants, and clear behavior|maps search autocomplete icon variants and clear behavior|maps combobox interaction states, aria wiring, and hidden key input|maps color field aria label and labelledby precedence to react parity"`,
   - full Vue tests: `yarn test:vue` (533 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `DialogTrigger` unmount-warning parity (`@vue-spectrum/dialog`)

1. Aligned `DialogTrigger` lifecycle guardrails with React:
   - in development, `DialogTrigger` now warns when unmounted while still open for modal-like dialog types (non-`popover`/`tray`), matching React guidance to prefer `DialogContainer` in conditional/unmounting flows.
2. Preserved dialog behavior:
   - no open/close/focus-dismiss contract changes; this patch only adds missing warning parity.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: assertion that unmounting an open modal `DialogTrigger` emits the React warning text.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "restores trigger focus when dialog trigger closes from Escape|warns when dialog trigger unmounts while open for modal-like types"`,
   - full Vue tests: `yarn test:vue` (534 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `Card` focusable-content warning parity (`@vue-spectrum/card`)

1. Aligned `Card` dev warning behavior with React:
   - `Card` now warns when focusable descendants are rendered inside card content (`Card does not support focusable elements...`), matching React guardrails.
2. Implemented warning checks with lifecycle-safe DOM probing:
   - warning evaluation now runs on mount/update against rendered card DOM without triggering slot-evaluation warnings.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: warning assertion for focusable card content.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "emits press events from standalone cards|warns when card content contains focusable elements|maps card hovered/focused/selected classes and aria labels"`,
   - targeted parity assertions: `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts -t "renders card view disabled keys story with disabled-card contracts"`,
   - full Vue tests: `yarn test:vue` (535 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Provider nested-direction warning parity (`@vue-spectrum/provider`)

1. Aligned `Provider` nested-direction guardrail with React:
   - in development, nested providers now warn when `dir` conflicts with an ancestor direction (`Language directions cannot be nested...`).
2. Implemented warning in provider internals using mounted/update checks against resolved provider DOM direction context.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: nested `Provider dir="ltr"` + child `Provider dir="rtl"` now asserts React warning text.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "applies provider theme classes and metadata for token variants|warns when provider direction is nested with an opposite parent direction"`,
   - full Vue tests: `yarn test:vue` (536 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Utility warning parity (`@vue-spectrum/utils`)

1. Aligned warning contracts with React Spectrum utility behavior:
   - `keepSpectrumClassNames()` now emits the legacy spectrum-class compatibility warning in development.
   - `useStyleProps()` now warns when unsafe `className` or `style` props are passed (matching React guidance to use `UNSAFE_*`).
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: utility helper test now asserts the `keepSpectrumClassNames` warning and both `useStyleProps` unsafe-prop warnings.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "exposes vue-spectrum utils helpers for classes, media query state, and dom refs"`,
   - full Vue tests: `yarn test:vue` (536 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Table nested-resize warning parity (`@vue-spectrum/table`)

1. Aligned `Table` header guardrails with React:
   - in development, a warning now emits when a resizable column includes child columns (`Column key: ... Columns with child columns don't allow resizing.`).
2. Preserved existing table behavior:
   - no sort/selection/open-state behavior changes; warning is additive and dev-only.
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`: warning assertion for a resizable grouped/nested column configuration.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "maps table state classes, aria metadata, and hidden drop indicators|warns when resizable table columns include child columns"`,
   - full Vue tests: `yarn test:vue` (537 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `useBreadcrumbs` prop-surface parity (`@vue-aria/breadcrumbs`)

1. Aligned breadcrumb hook label/id prop surface with React DOM-prop behavior:
   - `useBreadcrumbs` now accepts dashed `aria-label` in addition to camel alias,
   - breadcrumb nav props now support explicit `id` passthrough while preserving default label fallback (`"Breadcrumbs"`).
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: default, camel, and dashed-label + id assertions for breadcrumb nav props.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "provides breadcrumb nav props with default and custom labels"`,
   - full Vue tests: `yarn test:vue` (537 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `Image` warning environment parity (`@vue-spectrum/image`)

1. Aligned image alt-warning environment behavior with React:
   - missing-`alt` warning now emits only outside production builds (`process.env.NODE_ENV !== 'production'`), matching React behavior.
2. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "renders image src/alt and handles image load errors"`,
   - full Vue tests: `yarn test:vue` (537 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Landmark role/label warning parity (`@vue-aria/landmark`)

1. Aligned landmark-manager guardrails with React:
   - emits error when more than one `main` landmark is registered,
   - emits warning when duplicate-role landmarks are missing labels,
   - emits warning when duplicate-role landmarks reuse the same label.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: asserts duplicate-`main` error and duplicate-`navigation` unlabeled warning behavior.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "navigates vue-aria landmarks with the landmark controller|warns on landmark role conflicts and duplicate unlabeled roles"`,
   - full Vue tests: `yarn test:vue` (538 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — SSR warning-message parity (`@vue-aria/ssr`)

1. Aligned `useSSRSafeId` no-provider warning text with React:
   - when SSR id generation runs without an active provider in non-production, warning text now matches React verbatim.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: simulates non-DOM capability and asserts the exact SSRProvider warning message.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria ssr provider scopes and safe ids"`,
   - full Vue tests: `yarn test:vue` (538 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Shared utility warning parity (`@vue-stately/utils`, `@vue-aria/interactions`, `@vue-aria/utils`)

1. Aligned shared controlled/uncontrolled warning behavior with React stately utils:
   - `useControlledState` now emits React-matching warnings when state ownership toggles (`controlled -> uncontrolled` or `uncontrolled -> controlled`) in development.
   - controlled-state writes now follow React semantics when a ref-backed value exists but is currently `undefined` (updates stay internal until the value becomes controlled).
2. Aligned shared event-wrapper warning behavior with React interactions:
   - `createEventHandler` now emits the React warning when wrapped handlers call `stopPropagation()` directly, while preserving `continuePropagation()` opt-in flow.
3. Aligned deprecated utility warning behavior with React aria utils:
   - `useDrag1D` now emits the React deprecation warning in development (`useDrag1D is deprecated, please use useMove instead...`).
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - controlled/uncontrolled transition warnings for `useControlledState`,
     - uncontrolled-ref write semantics,
     - `useDrag1D` deprecation warning text,
     - `createEventHandler` stopPropagation warning text.
   - `packages/@vue-stately/utils/README.md`: removed stale limitation note claiming `useControlledState` lacks transition warnings.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately utility state and numeric helper behavior|warns when vue-stately controlled state toggles between controlled and uncontrolled|warns that vue-aria useDrag1D is deprecated|stops vue-aria keyboard bubbling by default and allows continuePropagation opt-in|warns when wrapped vue-aria keyboard handlers call stopPropagation directly"`,
   - full Vue tests: `yarn test:vue` (541 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — List/Table drag-drop warning parity (`@vue-spectrum/list`, `@vue-spectrum/table`)

1. Aligned `ListView` dev warning behavior with React drag/drop lifecycle guardrails:
   - added hook-presence transition warnings when `dragAndDropHooks` draggable support toggles across renders,
   - added hook-presence transition warnings when `dragAndDropHooks` droppable support toggles across renders.
2. Aligned `Table` dev warning behavior with React drag/drop lifecycle guardrails:
   - added matching drag/drop hook-presence transition warnings across renders,
   - added React warning parity when drag/drop hooks are present alongside expandable rows (`children` rows).
3. Added regression coverage:
   - `starters/vue/src/components.spec.ts`:
     - list drag/drop hook toggling warning assertions,
     - table drag/drop hook toggling warning assertions,
     - table expandable-row drag/drop warning assertion.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts -t "warns when list view drag/drop hooks toggle across renders|warns when table drag/drop hooks toggle and with expandable rows|warns when resizable table columns include child columns|maps list view item state classes and hidden insertion indicators|maps table state classes, aria metadata, and hidden drop indicators"`,
   - full Vue tests: `yarn test:vue` (543 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — `useDrag` drop-target warning parity (`@vue-aria/dnd`)

1. Aligned `useDrag` warning behavior with React:
   - drags that end with non-cancel operations now warn when no `useDrop` target handled the drop (`Drags initiated from the React Aria useDrag hook may only be dropped on a target created with useDrop...`).
2. Added shared drag-session tracking between `useDrag` and `useDrop`:
   - introduced lightweight internal session state to mark active drags and whether a `useDrop` target consumed the drop.
   - `useDrop.drop()` now marks the active drag session as handled before resolving the drop operation.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - direct `useDrag` warning assertion for non-`useDrop` completion,
     - no-warning assertion when drop flows through `useDrop`,
     - updated stately draggable-collection test to assert warning parity and suppress console noise in the suite.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tracks vue-aria dnd drag lifecycle callbacks and operation state|does not warn when vue-aria drags end via a useDrop target|manages vue-stately draggable collection keys and drag lifecycle|filters vue-aria dnd drops by accepted drag types"`,
   - full Vue tests: `yarn test:vue` (544 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Interaction/tabs warning parity (`@vue-aria/interactions`, `@vue-aria/tabs`)

1. Aligned wrapper guardrail warnings with React for `Focusable`/`Pressable`:
   - added development warnings when wrapper refs do not resolve to DOM elements (`child must forward its ref...`),
   - added development warnings when targets are not focusable (`tabIndex` passthrough guidance),
   - added development warnings for missing interactive roles and invalid roles (`Got "<role>"` variants).
2. Added shared warning helper in `@vue-aria/interactions`:
   - centralized role/native-element contract checks for both wrappers, matching React role allowlists for each wrapper surface.
3. Aligned tab-panel missing-id warning with React:
   - `useTabPanel` now emits `There is no tab id...` when used without tab list state in development, while preserving fallback `vue-tabpanel` id behavior.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for `Focusable`/`Pressable` ref, focusability, and role contracts,
     - tab-panel missing-state warning assertion,
     - updated non-native Pressable merge test to pass a role+ref contract (avoids false-positive warnings in parity tests).
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "warns for vue-aria Focusable and Pressable ref, focusable, and role contracts|merges vue-aria pressable with focusable props for non-native targets|warns when vue-aria tab panel is used without tab list state|computes vue-aria tabs semantics and manual activation behavior"`,
   - full Vue tests: `yarn test:vue` (546 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Toggle-store controlled-state warning parity (`@vue-stately/toggle`)

1. Aligned toggle-store controlled/uncontrolled transition warnings with React stately behavior:
   - `useToggleState` now emits `WARN: A component changed from ...` when `isSelected` ownership switches between controlled and uncontrolled.
   - `useToggleGroupState` now emits the same warning when `selectedKeys` ownership switches between controlled and uncontrolled.
2. Preserved existing toggle selection behavior:
   - no selection semantics changes were introduced; this patch adds dev-only warning parity for ownership transitions.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: new assertions for both single-toggle and toggle-group controlled/uncontrolled transitions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately toggle and toggle-group selection behavior|warns when vue-stately toggle hooks switch between controlled and uncontrolled"`,
   - full Vue tests: `yarn test:vue` (547 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — SearchField store controlled-state parity (`@vue-stately/searchfield`)

1. Aligned controlled/uncontrolled ownership semantics with React `useSearchFieldState`:
   - ref-backed values are now treated as controlled only when `value.value !== undefined` (matching React `useControlledState` behavior),
   - ref-backed undefined values now use uncontrolled fallback state instead of being treated as controlled.
2. Aligned controlled/uncontrolled transition warnings:
   - `useSearchFieldState` now emits `WARN: A component changed from ...` when ownership switches between controlled and uncontrolled.
3. Aligned change emission guardrails:
   - `setValue` now skips updates/callbacks when the new value is unchanged, matching shared controlled-state semantics.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - ref-backed undefined searchfield state remains uncontrolled and keeps fallback value semantics,
     - controlled/uncontrolled transition warning assertions for searchfield state.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately search field controlled and uncontrolled value state|warns when vue-stately search field switches between controlled and uncontrolled"`,
   - full Vue tests: `yarn test:vue` (548 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Slider/StepList controlled-state warning parity (`@vue-stately/slider`, `@vue-stately/steplist`)

1. Aligned controlled/uncontrolled transition warnings with React stately behavior:
   - `useSliderState` now emits `WARN: A component changed from ...` when `value` ownership transitions between controlled and uncontrolled.
   - `useStepListState` now emits the same warning when `lastCompletedStep` ownership transitions between controlled and uncontrolled.
2. Preserved selection/value behavior:
   - no slider thumb math or steplist completion logic changes were introduced; patch is warning-only parity for ownership transitions.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: controlled/uncontrolled transition warning assertions for both slider and steplist state hooks.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately slider thumb values, constraints, and drag lifecycle|manages vue-stately step list completion and selection eligibility|warns when vue-stately slider and steplist switch between controlled and uncontrolled"`,
   - full Vue tests: `yarn test:vue` (549 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Radio/Toggle/PressResponder warning parity (`@vue-aria/radio`, `@vue-aria/toggle`, `@vue-aria/interactions`)

1. Aligned `useRadio` warning behavior with React:
   - added development warning parity when neither visible children nor `aria-label`/`aria-labelledby` are provided (`If you do not provide children, you must specify an aria-label for accessibility`).
2. Aligned `useToggle` warning message contract with React:
   - preserved visible-label detection while updating the emitted warning string to React wording (`If you do not provide children, you must specify an aria-label for accessibility`).
3. Aligned `PressResponder` no-child guardrail with React:
   - added deferred registration check that warns when a press responder context is created without a descendant `usePress` registration (`A PressResponder was rendered without a pressable child...`).
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - direct warning assertions for missing-label `useRadio`,
     - direct warning assertions for missing-label `useToggle`,
     - direct warning assertions for `PressResponder` without a pressable child,
     - updated existing radio hook tests to provide explicit `children` where warnings are not expected.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "computes vue-aria radio group selection and keyboard movement|composes vue-aria radio group and radio input labelling parity|warns when vue-aria radio is missing visible children and aria label|computes vue-aria toggle press behavior and accessibility props|warns when vue-aria toggle is missing visible children and aria label|merges vue-aria press responder context handlers with local usePress handlers|clears vue-aria press responder context handlers|warns when vue-aria press responder has no pressable child"`,
   - full Vue tests: `yarn test:vue` (552 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Multiple-selection controlled ownership parity (`@vue-stately/selection`)

1. Aligned `useMultipleSelectionState` controlled-state semantics with React `useControlledState` behavior:
   - `selectedKeys` is now treated as controlled only when the prop ref exists and `selectedKeys.value !== undefined`,
   - ref-backed-`undefined` values now stay uncontrolled (internal state updates) instead of forcing controlled writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useMultipleSelectionState` now emits `WARN: A component changed from ...` on ownership transitions in development.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that a ref-backed-`undefined` `selectedKeys` prop remains uncontrolled during `setSelectedKeys` updates.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately multiple selection state and selection-manager helpers|warns when vue-stately multiple selection switches between controlled and uncontrolled|keeps vue-stately multiple selection uncontrolled when selectedKeys ref is undefined"`,
   - full Vue tests: `yarn test:vue` (554 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Overlay/Disclosure controlled ownership parity (`@vue-stately/overlays`, `@vue-stately/disclosure`)

1. Aligned controlled-state semantics for overlay/disclosure stores with React `useControlledState` behavior:
   - `useOverlayTriggerState`, `useDisclosureState`, and `useDisclosureGroupState` now treat ref-backed props as controlled only when the ref value is not `undefined`,
   - ref-backed `undefined` control refs now remain uncontrolled (internal state updates) instead of forcing prop writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - all three hooks now emit `WARN: A component changed from ...` when ownership transitions between controlled and uncontrolled in development.
3. Closed disclosure no-op emission drift:
   - `useDisclosureState.setExpanded` now no-ops when the next value matches current state, matching React controlled-state behavior and avoiding duplicate `onExpandedChange` emissions.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled/uncontrolled transitions in overlay, disclosure, and disclosure-group hooks,
     - assertions that ref-backed `undefined` control refs remain uncontrolled for all three hooks,
     - updated disclosure transition test to assert React-like no-op emission behavior.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately disclosure expansion state transitions|manages vue-stately disclosure group expanded keys for single and multiple modes|warns when vue-stately disclosure hooks switch between controlled and uncontrolled|keeps vue-stately overlay and disclosure hooks uncontrolled when control refs are undefined|manages vue-stately overlay trigger open, close, and toggle state"`,
   - full Vue tests: `yarn test:vue` (556 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Radio-group controlled ownership parity (`@vue-stately/radio`)

1. Aligned `useRadioGroupState` controlled-state semantics with React `useControlledState` behavior:
   - `value` is now treated as controlled only when the ref exists and `value.value !== undefined`,
   - ref-backed `undefined` values now stay uncontrolled (internal updates) rather than forcing prop writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useRadioGroupState` now emits `WARN: A component changed from ...` on ownership transitions in development.
3. Closed no-op emission drift:
   - `setSelectedValue` now no-ops when the requested value matches current state, preventing duplicate `onChange` emissions.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that ref-backed-`undefined` `value` stays uncontrolled during selection updates,
     - updated base radio-group state test to assert no duplicate `onChange` on no-op selection.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately radio group selection, focus tracking, and required validation|warns when vue-stately radio group switches between controlled and uncontrolled|keeps vue-stately radio group uncontrolled when value ref is undefined"`,
   - full Vue tests: `yarn test:vue` (558 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Autocomplete controlled ownership parity (`@vue-stately/autocomplete`)

1. Aligned `useAutocompleteState` controlled-state semantics with React `useControlledState` behavior:
   - controlled mode is now only active when `inputValue` exists and resolves to a non-`undefined` value,
   - ref-backed `undefined` values now remain uncontrolled (internal updates) rather than behaving as controlled.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useAutocompleteState` now emits `WARN: A component changed from ...` on ownership transitions in development.
3. Closed no-op emission drift:
   - `setInputValue` now no-ops when the new value equals current input value, matching React controlled-state behavior and avoiding duplicate `onInputChange` emissions.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that ref-backed-`undefined` `inputValue` stays uncontrolled during updates,
     - updated base autocomplete state test to assert no duplicate `onInputChange` on no-op value sets.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately autocomplete input and focused node state|warns when vue-stately autocomplete switches between controlled and uncontrolled|keeps vue-stately autocomplete uncontrolled when input ref is undefined"`,
   - full Vue tests: `yarn test:vue` (560 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Checkbox-group controlled ownership parity (`@vue-stately/checkbox`)

1. Aligned `useCheckboxGroupState` controlled-state semantics with React `useControlledState` behavior:
   - `value` is now treated as controlled only when the ref exists and `value.value !== undefined`,
   - ref-backed `undefined` values now remain uncontrolled (internal updates) instead of forcing controlled writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useCheckboxGroupState` now emits `WARN: A component changed from ...` when ownership transitions in development.
3. Closed default-value drift for controlled groups:
   - `defaultValue` now mirrors React behavior by falling back to the initial effective selection when no explicit default is provided.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that ref-backed-`undefined` `value` stays uncontrolled during updates,
     - base checkbox-group state test now asserts controlled default-value parity.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately checkbox-group values and invalid flags|warns when vue-stately checkbox group switches between controlled and uncontrolled|keeps vue-stately checkbox group uncontrolled when value ref is undefined"`,
   - full Vue tests: `yarn test:vue` (562 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Single-select list controlled ownership parity (`@vue-stately/list`)

1. Aligned `useSingleSelectListState` controlled-state semantics with React `useControlledState` behavior:
   - `selectedKey` is now treated as controlled only when the ref exists and `selectedKey.value !== undefined`,
   - ref-backed `undefined` `selectedKey` values now remain uncontrolled (internal state updates) rather than forcing prop writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useSingleSelectListState` now emits `WARN: A component changed from ...` when ownership transitions in development.
3. Preserved selection-change emission contract:
   - existing behavior that always calls `onSelectionChange` for same-key selection interactions remains intact.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that ref-backed-`undefined` `selectedKey` stays uncontrolled during selection updates.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately single-select list state and selected item lookups|warns when vue-stately single-select list switches between controlled and uncontrolled|keeps vue-stately single-select list uncontrolled when selectedKey ref is undefined"`,
   - full Vue tests: `yarn test:vue` (564 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree expandedKeys controlled ownership parity (`@vue-stately/tree`)

1. Aligned `useTreeState` expanded-keys controlled semantics with React `useControlledState` behavior:
   - `expandedKeys` is now treated as controlled only when the ref exists and `expandedKeys.value !== undefined`,
   - ref-backed `undefined` expanded-keys refs now remain uncontrolled (internal updates) instead of forcing prop writes.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useTreeState` now emits `WARN: A component changed from ...` when `expandedKeys` ownership transitions in development.
3. Preserved tree selection/focus behavior:
   - no selection-manager, focus-reset, or toggle contract changes were introduced beyond controlled-state ownership handling.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled `expandedKeys` transitions,
     - assertion that ref-backed-`undefined` `expandedKeys` remains uncontrolled while expansion toggles update internal tree state.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tree collection expansion and selection behavior|warns when vue-stately tree expandedKeys switches between controlled and uncontrolled|keeps vue-stately tree expansion uncontrolled when expandedKeys ref is undefined"`,
   - full Vue tests: `yarn test:vue` (566 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Select controlled ownership parity (`@vue-stately/select`)

1. Aligned `useSelectState` controlled-state ownership semantics with React `useControlledState` behavior:
   - controlled mode now activates only when `value` (or single-select `selectedKey`) refs resolve to non-`undefined` values,
   - ref-backed `undefined` control refs now remain uncontrolled, using internal state updates instead of writing through control refs.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useSelectState` now emits `WARN: A component changed from ...` when select ownership transitions between controlled and uncontrolled in development.
3. Preserved existing select interaction contracts:
   - selection-change and trigger-close behavior remain unchanged for single/multiple mode actions.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for both `value`-controlled and `selectedKey`-controlled transition paths,
     - assertions that ref-backed-`undefined` control refs (`value`, `selectedKey`) remain uncontrolled during updates,
     - updated baseline select state test to avoid incidental ownership-transition warnings in non-warning scenarios.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately select selection, trigger state, and value normalization|warns when vue-stately select switches between controlled and uncontrolled|keeps vue-stately select uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (568 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — ComboBox controlled ownership parity (`@vue-stately/combobox`)

1. Aligned `useComboBoxState` ownership semantics for both controlled refs:
   - `inputValue` is now treated as controlled only when `inputValue.value !== undefined`,
   - `selectedKey` is now treated as controlled only when `selectedKey.value !== undefined`,
   - ref-backed `undefined` control refs now remain uncontrolled with internal fallback state.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useComboBoxState` now emits `WARN: A component changed from ...` on ownership transitions for both input-value and selected-key control channels in development.
3. Closed no-op input-change drift:
   - `setInputValue` now no-ops when the next value matches current input value, avoiding duplicate `onInputChange` emissions.
4. Improved default-snapshot parity:
   - `defaultInputValue` and `defaultSelectedKey` now fall back to initial effective state when explicit defaults are omitted.
5. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled/uncontrolled transitions on both `inputValue` and `selectedKey`,
     - assertions that ref-backed-`undefined` control refs remain uncontrolled while state updates proceed internally.
6. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately combobox state for filtering, selection, and revert|warns when vue-stately combobox switches between controlled and uncontrolled|keeps vue-stately combobox uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (570 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color controlled ownership parity (`@vue-stately/color`)

1. Aligned controlled-state semantics for React-parity color hooks that map to `useControlledState`:
   - `useColorPickerState` and `useColorChannelFieldState` now treat value refs as controlled only when `value.value !== undefined`,
   - ref-backed `undefined` values now remain uncontrolled with internal fallback state.
2. Aligned controlled/uncontrolled transition warning behavior:
   - both hooks now emit `WARN: A component changed from ...` on ownership transitions in development.
3. Closed no-op emission drift:
   - `useColorPickerState.setColorValue` now no-ops when the parsed next color equals current color,
   - `useColorChannelFieldState` now avoids duplicate change emissions when channel updates resolve to the same color value.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions in picker/channel hooks,
     - assertions that ref-backed-`undefined` value refs remain uncontrolled while color updates proceed internally.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately color area/slider/field/channel/picker state baselines|warns when vue-stately color picker and channel-field switch between controlled and uncontrolled|keeps vue-stately color picker and channel-field uncontrolled when value refs are undefined"`,
   - full Vue tests: `yarn test:vue` (572 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Calendar controlled ownership parity (`@vue-stately/calendar`)

1. Aligned controlled-state ownership semantics for calendar value refs:
   - `useCalendarState` and `useRangeCalendarState` now treat `value` as controlled only when the ref exists and resolves to a non-`undefined` value,
   - ref-backed `undefined` value refs now remain uncontrolled with internal fallback state.
2. Aligned controlled/uncontrolled transition warning behavior:
   - both hooks now emit `WARN: A component changed from ...` when value ownership transitions in development.
3. Preserved calendar/range interactions:
   - date selection, focused-date movement, visible-range navigation, and range highlighting behavior remain unchanged beyond ownership handling.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled value transitions in both hooks,
     - assertions that ref-backed-`undefined` value refs remain uncontrolled while calendar/range updates proceed internally.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately calendar and range-calendar state transitions|warns when vue-stately calendar and range-calendar switch between controlled and uncontrolled|keeps vue-stately calendar and range-calendar uncontrolled when value refs are undefined"`,
   - full Vue tests: `yarn test:vue` (574 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Menu-trigger controlled ownership parity (`@vue-stately/menu`)

1. Aligned `useMenuTriggerState` controlled-state semantics with shared overlay contracts:
   - `isOpen` is now treated as controlled only when the control ref exists and `isOpen.value !== undefined`,
   - ref-backed `undefined` `isOpen` refs now remain uncontrolled, using internal open state.
2. Aligned controlled/uncontrolled transition warning behavior:
   - `useMenuTriggerState` now emits `WARN: A component changed from ...` on ownership transitions in development.
3. Preserved menu trigger behavior contracts:
   - focus-strategy updates, submenu stack management, and root-close behavior remain unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled `isOpen` transitions,
     - assertion that ref-backed-`undefined` `isOpen` stays uncontrolled while open/focus behavior updates internal state.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately menu trigger open state and submenu stack|warns when vue-stately menu trigger switches between controlled and uncontrolled|keeps vue-stately menu trigger uncontrolled when isOpen ref is undefined|manages vue-stately submenu trigger level, focus strategy, and close-all behavior"`,
   - full Vue tests: `yarn test:vue` (576 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree-grid expanded ownership parity (`@vue-stately/table`)

1. Closed `UNSTABLE_useTreeGridState` ownership gap in Vue table stately surface:
   - added explicit expanded-key state ownership (`UNSTABLE_expandedKeys` / `UNSTABLE_defaultExpandedKeys` / `UNSTABLE_onExpandedChange`) to replace the previous placeholder-only behavior.
2. Aligned controlled-state semantics and warnings:
   - expanded keys are now treated as controlled only when `UNSTABLE_expandedKeys.value !== undefined`,
   - ref-backed `undefined` expanded-key refs now stay uncontrolled,
   - ownership transitions now emit `WARN: A component changed from ...` in development.
3. Added basic tree-grid expansion state mutators:
   - implemented `setExpandedKeys` and `toggleKey` with set-based state transitions and callback emission parity for non-`all` updates.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - expanded-key toggle/update assertions,
     - warning assertions for controlled->uncontrolled and uncontrolled->controlled transitions,
     - assertion that ref-backed-`undefined` expanded-key refs remain uncontrolled.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately table collection filtering, row selection, and sort descriptor state|manages vue-stately tree grid expanded key state|warns when vue-stately tree grid expanded keys switch between controlled and uncontrolled|keeps vue-stately tree grid expansion uncontrolled when expanded key ref is undefined|builds vue-stately table header rows from column definitions"`,
   - full Vue tests: `yarn test:vue` (579 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Toggle-group controlled ownership + same-selection emission parity (`@vue-stately/toggle`)

1. Closed `useToggleGroupState` uncontrolled-write drift:
   - ref-backed `selectedKeys` now behaves as controlled only when `selectedKeys.value !== undefined`,
   - ref-backed `undefined` control refs now remain uncontrolled (internal state updates), matching React `useControlledState` ownership semantics.
2. Closed same-selection emission drift:
   - removed deep set-equality suppression that prevented selection-change emissions for new `Set` instances with unchanged members,
   - update no-op checks now use identity semantics (`Object.is`) to match React controlled-state behavior.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - toggle-group disallow-empty path now asserts repeated selected-key interaction still emits selection-change parity,
     - new assertion that ref-backed-`undefined` `selectedKeys` remains uncontrolled during updates.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately toggle and toggle-group selection behavior|warns when vue-stately toggle hooks switch between controlled and uncontrolled|keeps vue-stately toggle group uncontrolled when selectedKeys ref is undefined"`,
   - full Vue tests: `yarn test:vue` (580 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tooltip-store parity test-surface expansion (`@vue-stately/tooltip`)

1. Expanded React-aligned regression coverage in `starters/vue/src/composition.spec.ts` for tooltip trigger state:
   - repeated `open(false)` warmup calls reset the pending warmup timer instead of opening early,
   - `closeDelay` immediate-close behavior is asserted for both `0` and negative values,
   - opening a second controlled tooltip closes the previously open controlled tooltip.
2. Hardened test cleanup for tooltip global warmup/cooldown shared state:
   - tooltip-state tests now drain timers in cleanup to avoid cross-test global warmup leakage.
3. Validation after coverage expansion:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tooltip trigger warmup and close delay behavior|resets vue-stately tooltip warmup when open is called repeatedly|closes vue-stately tooltip immediately when closeDelay is zero or negative|closes previously opened vue-stately controlled tooltip when another opens"`,
   - full Vue tests: `yarn test:vue` (580 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree expanded-set identity parity (`@vue-stately/tree`)

1. Closed `useTreeState` expanded-set update semantics drift:
   - `setExpandedKeys` no-op checks now use identity semantics (`Object.is`) instead of deep set-equality comparisons.
2. Aligned callback payload parity with React:
   - `onExpandedChange` now receives the actual next expanded-keys set instead of an always-cloned set payload.
3. Preserved controlled/uncontrolled ownership behavior:
   - ref-backed `undefined` `expandedKeys` refs remain uncontrolled,
   - ownership-transition warnings remain unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: tree state test now asserts repeated `setExpandedKeys(new Set([...sameKeys]))` still emits `onExpandedChange` (React parity).
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tree collection expansion and selection behavior|warns when vue-stately tree expandedKeys switches between controlled and uncontrolled|keeps vue-stately tree expansion uncontrolled when expandedKeys ref is undefined"`,
   - full Vue tests: `yarn test:vue` (583 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Disclosure-group expanded-set identity parity (`@vue-stately/disclosure`)

1. Closed `useDisclosureGroupState` set-expanded no-op/emission drift:
   - `setExpandedKeys` now uses identity no-op checks (`Object.is`) instead of always cloning and emitting.
2. Aligned callback payload parity with React:
   - `onExpandedChange` now receives the normalized next set directly instead of an always-cloned payload.
3. Preserved disclosure-group ownership behavior:
   - controlled/uncontrolled transition warnings and ref-backed-`undefined` uncontrolled behavior remain unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: new disclosure-group test asserts same-reference `setExpandedKeys` is a no-op while a new `Set` with same keys still emits (React parity).
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately disclosure group expanded keys for single and multiple modes|matches vue-stately disclosure group expanded-set identity semantics|warns when vue-stately disclosure hooks switch between controlled and uncontrolled|keeps vue-stately overlay and disclosure hooks uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (583 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Select value no-op emission parity (`@vue-stately/select`)

1. Closed select controlled-state no-op drift:
   - `useSelectState` now applies identity no-op semantics (`Object.is`) before committing value updates, matching React `useControlledState`.
2. Aligned change-emission behavior:
   - `onChange` is no longer emitted for same-value writes (including repeated same-key single selection and same-reference multiple-value writes).
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: select state test now asserts repeated same-key `setSelectedKey` and same-reference multiple `setValue` calls do not emit duplicate changes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately select selection, trigger state, and value normalization|warns when vue-stately select switches between controlled and uncontrolled|keeps vue-stately select uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree-grid expanded-set identity parity (`@vue-stately/table`)

1. Closed `UNSTABLE_useTreeGridState` expanded-set normalization drift:
   - set normalization now preserves existing `Set` references instead of always cloning.
2. Aligned expanded update semantics with React `useControlledState` behavior:
   - expanded no-op checks now use identity semantics (`Object.is`) rather than deep set-equality.
3. Aligned expanded-change callback payload behavior:
   - `UNSTABLE_onExpandedChange` now receives the normalized expanded set directly (no forced clone).
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: tree-grid state test now asserts same-reference `setExpandedKeys` is a no-op while a new `Set` with identical keys still emits expanded-change parity.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tree grid expanded key state|warns when vue-stately tree grid expanded keys switch between controlled and uncontrolled|keeps vue-stately tree grid expansion uncontrolled when expanded key ref is undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Single-select setter no-op parity (`@vue-stately/list`)

1. Closed `useSingleSelectListState` setter semantics drift:
   - `setSelectedKey` now updates the controlled/uncontrolled selected-key channel directly, matching React’s `useControlledState`-backed API semantics.
2. Preserved immediate state synchronization:
   - selected-key to selection-manager synchronization now uses a synchronous watcher flush so `selectionManager` reflects setter updates immediately in the same tick.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: single-select list test now asserts repeated same-key `setSelectedKey` calls do not emit duplicate `onSelectionChange` events while selection-manager state remains in sync.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately single-select list state and selected item lookups|warns when vue-stately single-select list switches between controlled and uncontrolled|keeps vue-stately single-select list uncontrolled when selectedKey ref is undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color area/slider no-op and coalesced change parity (`@vue-stately/color`)

1. Closed `useColorAreaState` duplicate-change drift:
   - `setValue`, `setXValue`, and `setYValue` now no-op for unchanged values.
   - `setColorFromPoint` now coalesces x/y channel updates into a single state commit and single `onChange` emission when both channels change.
2. Closed `useColorSliderState` same-value emission drift:
   - `setValue` now no-ops for same parsed color values instead of emitting duplicate `onChange`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: color state baseline test now asserts single-emission behavior for area point updates and no duplicate emission for same-value slider sets.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately color area/slider/field/channel/picker state baselines|warns when vue-stately color picker and channel-field switch between controlled and uncontrolled|keeps vue-stately color picker and channel-field uncontrolled when value refs are undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color wheel/field no-op and drag-end parity (`@vue-stately/color`)

1. Closed `useColorWheelState` parity gaps:
   - added `onChangeEnd` support on drag end (`setDragging(true -> false)`),
   - `setValue` now no-ops for unchanged parsed colors to avoid duplicate `onChange` emissions.
2. Closed `useColorFieldState` same-value emission drift:
   - `setColorValue` now no-ops when the parsed next color equals current color, avoiding duplicate `onChange`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: color state baseline test now asserts wheel same-hue no-op behavior, drag-end `onChangeEnd` emission, and color-field same-value no-op behavior.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately color area/slider/field/channel/picker state baselines"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — ComboBox direct setter no-op parity (`@vue-stately/combobox`)

1. Closed direct setter emission drift:
   - `useComboBoxState.setSelectedKey` now no-ops when the requested key is already selected, matching React `setValue`/`useControlledState` no-op semantics for same-key writes.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: combobox state test now asserts repeated same-value `setValue` calls do not emit duplicate selection-change events.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately combobox state for filtering, selection, and revert|warns when vue-stately combobox switches between controlled and uncontrolled|keeps vue-stately combobox uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Checkbox-group setter identity parity (`@vue-stately/checkbox`)

1. Closed checkbox-group setter no-op drift:
   - `useCheckboxGroupState.setValue` now no-ops when called with the exact same value array reference, matching React `useControlledState` identity semantics.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: checkbox-group test now asserts same-reference `setValue` is a no-op while a new array instance with identical values still emits change.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately checkbox-group values and invalid flags|matches vue-stately checkbox-group setValue identity semantics|warns when vue-stately checkbox group switches between controlled and uncontrolled|keeps vue-stately checkbox group uncontrolled when value ref is undefined"`,
   - full Vue tests: `yarn test:vue` (584 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Toast timer/clear lifecycle parity (`@vue-stately/toast`)

1. Closed toast-timer start lifecycle drift:
   - `Timer` instances in `useToastState` now start paused by default and only begin counting down after `resumeAll()`, matching React queue behavior.
2. Closed `clear()` callback lifecycle drift:
   - `ToastQueue.clear()` now mirrors React by clearing queue visibility without invoking queued toast `onClose` callbacks.
3. Preserved close behavior and queue ordering:
   - `close(key)` still invokes `onClose` for the removed toast and keeps queue visibility ordering unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`:
     - timers do not auto-expire before `resumeAll()` and expire after resume,
     - `ToastQueue.clear()` does not fire `onClose` callbacks.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "toast queue visibility|toast timers only after resumeAll|toast queues without firing onClose"`,
   - full Vue tests: `yarn test:vue` (587 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Async-list cursor-aware action parity (`@vue-stately/data`)

1. Closed stale-cursor behavior drift in async list actions:
   - list actions created by `useAsyncList` now read the current pagination cursor dynamically instead of capturing the initial cursor snapshot.
2. Aligned selection-clearing semantics with React list actions:
   - `remove()` now preserves `'all'` selection when the loaded page is emptied but a next-page cursor still exists.
3. Implementation alignment details:
   - `createListActions` now references `opts.cursor` at action time,
   - `useAsyncList` now provides a live cursor getter in action options.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: async-list test that removes the last loaded item while cursor remains and asserts `'all'` selection is preserved.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "async list data|all-selection when removing last loaded item"`,
   - full Vue tests: `yarn test:vue` (588 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — List move-key edge-case ordering parity (`@vue-stately/data`)

1. Aligned list reordering semantics with React for missing move keys:
   - `moveBefore` and `moveAfter` now keep React’s index derivation behavior when provided keys are missing from the current list, rather than filtering them out.
2. Preserved existing list action contracts:
   - insertion, removal, selection, and filtering behavior remain unchanged outside the missing-key move edge path.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit missing-key `moveBefore`/`moveAfter` assertions for React-matching ordering outcomes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "list data insertion|move ordering semantics when move keys are missing"`,
   - full Vue tests: `yarn test:vue` (589 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — ComboBox open-trigger reason parity (`@vue-aria/combobox`, `@vue-stately/combobox`)

1. Closed combobox `onOpenChange` trigger-reason drift against React behavior:
   - `open` and `toggle` now support passing open trigger reasons (`focus`/`input`/`manual`),
   - `onOpenChange` now receives `(isOpen, trigger)` on open transitions and `(false, undefined)` on close.
2. Aligned combobox method signatures for parity:
   - `useComboBox` now exposes `open(focus?, trigger?)` and `toggle(focus?, trigger?)` trigger-aware APIs.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit `useComboBox` and `useStatelyComboBoxState` assertions for trigger-reason propagation across `open`, `toggle`, and `close` flows.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "combobox composable state|open trigger reasons"`,
   - full Vue tests: `yarn test:vue` (591 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree move edge-case parity test-surface expansion (`@vue-stately/data`)

1. Expanded React-aligned tree-data regression coverage for move edge paths:
   - added self-target move invariants for `moveBefore` and `moveAfter` (no-op semantics when target key is included in moved keys),
   - added descendant-cycle guard assertion for invalid `moveBefore` operations (`Cannot move an item to be a child of itself.`).
2. Result of parity probe:
   - current Vue tree-data move implementation already matches these React contracts; no additional implementation patch was required in this batch.
3. Validation after coverage expansion:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tree moveBefore and moveAfter self-target semantics|tree moveBefore attempts to move a parent"`,
   - full Vue tests: `yarn test:vue` (593 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Checkbox-group duplicate-value parity (`@vue-stately/checkbox`)

1. Closed checkbox-group value-normalization drift against React:
   - removed Vue-only dedupe/coercion normalization for `defaultValue`, controlled `value`, and `setValue`,
   - checkbox-group state now preserves array shape/order exactly as provided by caller, matching React behavior.
2. Preserved existing selection helpers:
   - `addValue`/`removeValue`/`toggleValue` behavior remains unchanged (single-add semantics still enforced via `isSelected` checks).
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit assertions that controlled and uncontrolled checkbox-group paths preserve duplicate values for `value/defaultValue/setValue`.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "checkbox-group values and invalid flags|checkbox-group setValue identity semantics|duplicate values"`,
   - full Vue tests: `yarn test:vue` (594 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Radio-group null-change emission parity (`@vue-stately/radio`)

1. Closed radio-group change-emission drift against React:
   - `setSelectedValue(null)` now emits `onChange(null)` instead of suppressing callback dispatch for null selections.
2. Updated radio-group option typing for parity:
   - `onChange` now accepts `string | null` to reflect actual state transitions (`selected` and `cleared`) in the state API.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit assertion that radio-group emits `onChange` for both non-null and null selection transitions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "radio group selection, focus tracking, and required validation|null selection parity"`,
   - full Vue tests: `yarn test:vue` (595 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Async-list loadMore concurrency coverage expansion (`@vue-stately/data`)

1. Expanded async-list concurrency regression coverage:
   - added assertion that `loadMore()` is ignored while the initial `loading` request is still in flight,
   - added assertion that rapid duplicate `loadMore()` calls only apply one appended page and end in `idle`.
2. Parity probe outcome:
   - visible state parity is preserved (`items`, `loadingState`, and single-page append semantics),
   - Vue suppresses duplicate rapid calls synchronously before invoking extra `load` requests, while React can invoke duplicate requests and cancel them during reducer resolution due render-cycle timing.
3. Validation after coverage expansion:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "prevents vue-stately async list loadMore while initial load is in progress|handles vue-stately async list duplicate loadMore calls in quick succession"`,
   - full Vue tests: `yarn test:vue` (597 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Toggle-group setter/disabled parity (`@vue-stately/toggle`)

1. Closed toggle-group state-layer behavior drift against React:
   - removed Vue-only `isDisabled` early return in `toggleKey` so state helpers remain callable regardless of disabled presentation state,
   - removed Vue-only normalization/guarding in `setSelectedKeys` so direct setter writes are not altered by `selectionMode` or `disallowEmptySelection`.
2. Preserved interaction-level invariants from React:
   - `toggleKey` still enforces `disallowEmptySelection` for user-style toggle interactions in both selection modes.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions that disabled groups still update through direct state calls, direct `setSelectedKeys` writes preserve caller-provided sets in single mode, and empty sets are allowed via setter even when `disallowEmptySelection` is true.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "toggle-group setter and disabled semantics|toggle and toggle-group selection behavior"`,
   - full Vue tests: `yarn test:vue` (598 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Controlled tree expansion sync parity (`@vue-stately/tree`)

1. Closed controlled tree expansion sync drift against React:
   - `useTreeState` now watches controlled `expandedKeys` changes and rebuilds `collection`/`SelectionManager.collection` immediately, matching React re-render behavior when controlled props change externally.
2. Closed data-source sync drift:
   - `useTreeState` now watches `collection`/`items` reactive inputs and rebuilds the internal `TreeCollection` with current expansion state when those sources change.
3. Preserved expansion contract:
   - `setExpandedKeys` still emits `onExpandedChange` on non-identical set writes and keeps Object.is no-op behavior.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: controlled tree test asserting that external `expandedKeys` updates reveal newly expanded descendants in `collection.getKeys()`.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tree collection expansion and selection behavior|controlled expandedKeys change externally"`,
   - full Vue tests: `yarn test:vue` (599 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Slider controlled drag callback parity (`@vue-stately/slider`)

1. Closed controlled-slider drag callback drift against React:
   - `useSliderState` now tracks in-flight drag values in an internal value ref, and uses that source when computing drag-end payloads.
2. Aligned drag lifecycle behavior:
   - starting a drag now snapshots the current rendered values into the internal drag value ref,
   - drag-end `onChangeEnd` now emits the latest drag value even if the controlled parent writes stale values during intermediate `onChange` callbacks.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: controlled slider test where `onChange` intentionally rewrites the controlled value to stale data during drag, asserting `onChangeEnd` still reports the latest dragged value.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "slider thumb values, constraints, and drag lifecycle|slider drag callbacks aligned in controlled mode without parent sync"`,
   - full Vue tests: `yarn test:vue` (600 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Async-list filter-text refetch parity coverage (`@vue-stately/data`)

1. Expanded async-list filtering regression coverage from React parity tests:
   - added a case where a filtering load returns a different `filterText`, which must trigger a second filtering fetch using the updated text.
2. Parity probe outcome:
   - current Vue async-list implementation already matches this React contract (`filterText` update + follow-up fetch + final idle state with latest items); no implementation patch was required.
3. Validation after coverage expansion:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "loads, paginates, and filters vue-stately async list data|filter text when load returns a new filter and refetches"`,
   - full Vue tests: `yarn test:vue` (601 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Disclosure-group setter/disabled parity (`@vue-stately/disclosure`)

1. Closed disclosure-group state-layer drift against React:
   - removed Vue-only `isDisabled` early return in `toggleKey` so programmatic state calls behave like React state helpers,
   - removed Vue-only single-mode key normalization inside `setExpandedKeys`.
2. Preserved single-expand invariant behavior:
   - the existing single-mode normalization effect remains in place, so multi-key writes in single mode are normalized after the initial state write, matching React’s effect-driven behavior.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions that disabled groups still respond to direct toggle calls and that single-mode direct multi-key writes emit the initial write followed by normalization.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "disclosure group expanded keys for single and multiple modes|disclosure group disabled and single-mode setter semantics with React"`,
   - full Vue tests: `yarn test:vue` (602 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Controlled-state callback parity (`@vue-stately/utils`)

1. Closed core controlled-state contract drift against React:
   - `useControlledState` no longer writes directly to controlled refs when `setValue` is called,
   - controlled writes now follow React semantics: emit `onChange` with the candidate value while leaving the externally controlled value source authoritative.
2. Aligned callback sequencing behavior:
   - function-form `setValue` now uses a tracked internal value ref so back-to-back callback writes in one tick compose correctly,
   - the tracked value ref resets to the externally controlled value on the next microtask, matching React’s render-cycle reset behavior.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: controlled `useControlledState` test for callback composition in one tick and repeated callback updates across subsequent ticks after controlled prop changes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "utility state and numeric helper behavior|controlled-state callback semantics for controlled props"`,
   - full Vue tests: `yarn test:vue` (603 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Search-field controlled contract parity (`@vue-stately/searchfield`)

1. Closed search-field controlled-mode drift against React:
   - `useSearchFieldState.setValue` no longer mutates controlled refs directly,
   - controlled mode now emits `onChange` while keeping `value` driven solely by external controlled input.
2. Expanded coercion parity coverage:
   - added explicit assertions for numeric/array coercion in both controlled and uncontrolled paths (`toString` semantics).
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: controlled-no-parent-update assertion plus string coercion assertions matching React stately test cases.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "search field controlled and uncontrolled value state|search field controlled and coercion semantics with React"`,
   - full Vue tests: `yarn test:vue` (604 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color invalid-initial fallback parity (`@vue-stately/color`)

1. Closed invalid-default color fallback drift:
   - `useColor` now treats non-color strings as invalid and returns `undefined` rather than coercing to a concrete fallback color.
2. Aligned color-field initialization behavior:
   - `useColorFieldState` now initializes invalid defaults to an empty color state (`null` + empty input) instead of coercing to `#000000`.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit assertion that invalid default colors produce empty color-field state.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "color area/slider/field/channel/picker state baselines|color field empty when initialized with an invalid default value"`,
   - full Vue tests: `yarn test:vue` (605 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Disclosure controlled contract parity (`@vue-stately/disclosure`)

1. Closed controlled disclosure-state drift against React:
   - `useDisclosureState` no longer mutates controlled `isExpanded` refs during `expand`/`collapse`/`toggle`,
   - controlled updates now flow through `onExpandedChange` only.
2. Closed controlled disclosure-group drift:
   - `useDisclosureGroupState.setExpandedKeys` no longer mutates controlled `expandedKeys` refs directly,
   - group callbacks now emit requested next keys while controlled state remains externally owned.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit assertions that controlled disclosure and disclosure-group refs remain unchanged unless parent updates control refs, while callbacks still emit the requested transitions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "disclosure expansion state transitions|disclosure hooks controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (606 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Checkbox-group controlled ownership parity (`@vue-stately/checkbox`)

1. Closed checkbox-group controlled ownership drift against React:
   - `useCheckboxGroupState` no longer mutates controlled `value` refs directly from `setValue`/`addValue`/`removeValue`/`toggleValue` flows.
2. Preserved controlled callback contract:
   - state updates still emit `onChange` with requested next values; controlled state remains externally owned and only changes when parent updates the control ref.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions that controlled checkbox groups emit `onChange` without mutating control refs when parent does not mirror changes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "checkbox-group values and invalid flags|checkbox-group controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (607 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Radio-group controlled ownership parity (`@vue-stately/radio`)

1. Closed radio-group controlled ownership drift:
   - `useRadioGroupState` no longer mutates controlled `value` refs directly from `setSelectedValue`.
2. Preserved callback/validation behavior:
   - `onChange` and validation commit semantics remain unchanged; controlled updates are now callback-driven and externally owned.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertion that controlled radio-group refs remain unchanged when parent does not mirror `onChange`, while callbacks still emit the requested selection.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "radio group selection, focus tracking, and required validation|radio group controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (608 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Select controlled ownership parity (`@vue-stately/select`)

1. Closed select controlled ownership drift:
   - `useSelectState` no longer mutates controlled `value` or `selectedKey` refs directly during `setValue`/`setSelectedKey` flows.
2. Preserved emitted selection contract:
   - `onChange` and single-select `onSelectionChange` still emit requested next selection payloads; controlled state remains externally owned.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions that controlled single- and multi-select refs remain unchanged when parent does not mirror callbacks, while callback payloads continue to emit.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "select selection, trigger state, and value normalization|select controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (609 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Toggle controlled ownership parity (`@vue-stately/toggle`)

1. Closed controlled ownership drift in toggle hooks:
   - `useToggleState` no longer mutates controlled `isSelected` refs directly,
   - `useToggleGroupState` no longer mutates controlled `selectedKeys` refs directly.
2. Preserved emitted change contract:
   - controlled toggles still emit `onChange`/`onSelectionChange` payloads for requested transitions; state remains externally owned when controlled.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertions that controlled single toggle and toggle-group refs remain unchanged when parent does not mirror callbacks, while callbacks still emit requested values.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "toggle and toggle-group selection behavior|toggle hooks controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (610 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree controlled ownership parity (`@vue-stately/tree`)

1. Closed tree expansion controlled ownership drift:
   - `useTreeState` no longer mutates controlled `expandedKeys` refs from `setExpandedKeys`/`toggleKey`.
2. Preserved controlled callback behavior:
   - controlled tree expansion requests still emit `onExpandedChange` with requested key sets; collection expansion only updates when parent mirrors controlled ref changes.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: assertion that controlled tree expansion refs remain unchanged without parent updates while `onExpandedChange` still emits requested expanded keys.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tree collection when controlled expandedKeys change externally|tree controlled without mutating expanded key refs"`,
   - full Vue tests: `yarn test:vue` (611 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Single-select list controlled ownership parity (`@vue-stately/list`)

1. Closed single-select list controlled ownership drift:
   - `useSingleSelectListState` no longer mutates controlled `selectedKey` refs directly from `setSelectedKey` or selection-manager events.
2. Aligned callback semantics with React behavior:
   - `onSelectionChange` still fires for same-key selection manager updates,
   - direct `setSelectedKey` same-value writes remain no-ops.
3. Removed duplicate callback emission feedback:
   - added internal sync guard so selected-key-to-selection-manager synchronization does not recursively re-emit selection changes.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertion for single-select list state.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "single-select list state and selected item lookups|single-select list controlled without mutating control refs|tab list selection and focused-tab synchronization"`,
   - full Vue tests: `yarn test:vue` (612 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Calendar controlled ownership parity (`@vue-stately/calendar`)

1. Closed calendar controlled ownership drift:
   - `useCalendarState` no longer mutates controlled `value` refs directly from `setValue`/`selectDate`.
2. Closed range-calendar controlled ownership drift:
   - `useRangeCalendarState` no longer mutates controlled `value` refs directly from `setValue`/`selectDate`,
   - controlled range selection now preserves anchor-based two-click range completion and emits callback payloads without parent write-through.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled tests to mirror parent updates and added explicit controlled-no-parent-update assertions for both calendar and range-calendar.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately calendar and range-calendar state transitions|keeps vue-stately calendar and range-calendar controlled without mutating control refs|warns when vue-stately calendar and range-calendar switch between controlled and uncontrolled|keeps vue-stately calendar and range-calendar uncontrolled when value refs are undefined"`,
   - full Vue tests: `yarn test:vue` (613 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color picker/channel controlled ownership parity (`@vue-stately/color`)

1. Closed controlled ownership drift in color picker/channel field hooks:
   - `useColorPickerState` no longer mutates controlled `value` refs directly,
   - `useColorChannelFieldState` no longer mutates controlled `value` refs directly.
2. Aligned picker default fallback with React:
   - `useColorPickerState` now defaults to black (`#000000`) when neither `value` nor `defaultValue` is provided.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled tests to mirror parent updates, added explicit controlled-no-parent-update assertions, and added default-black picker assertion.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "color area/slider/field/channel/picker state baselines|keeps vue-stately color picker and channel-field controlled without mutating control refs|uses vue-stately color picker default black value when no value is provided|warns when vue-stately color picker and channel-field switch between controlled and uncontrolled|keeps vue-stately color picker and channel-field uncontrolled when value refs are undefined"`,
   - full Vue tests: `yarn test:vue` (615 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Slider controlled ownership parity (`@vue-stately/slider`)

1. Closed slider controlled ownership drift:
   - `useSliderState` no longer mutates controlled `value` refs directly from thumb updates.
2. Aligned controlled callback equality semantics with React:
   - change suppression now compares against rendered `values` (controlled source) rather than internal drag-tracking refs,
   - repeated same target writes still emit in controlled-no-parent-update mode, matching React controlled behavior.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertion for slider thumb updates and repeated same-value callback emissions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately slider thumb values, constraints, and drag lifecycle|keeps vue-stately slider drag callbacks aligned in controlled mode without parent sync|keeps vue-stately slider controlled without mutating control refs|warns when vue-stately slider and steplist switch between controlled and uncontrolled"`,
   - full Vue tests: `yarn test:vue` (616 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Multiple-selection controlled ownership parity (`@vue-stately/selection`)

1. Closed controlled ownership drift in base selection state:
   - `useMultipleSelectionState` no longer mutates controlled `selectedKeys` refs directly.
2. Preserved controlled callback behavior:
   - `onSelectionChange` continues to emit requested selections, including repeated same requested sets when parent does not mirror controlled updates.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertion for multiple-selection state.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (617 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — ComboBox controlled ownership parity (`@vue-stately/combobox`)

1. Closed combobox controlled ownership drift:
   - `useComboBoxState` no longer mutates controlled `inputValue` or `selectedKey` refs directly.
2. Aligned input callback flow with React-like controlled ownership:
   - `inputValue` writes now emit `onInputChange` from the computed setter path, so internal combobox operations (`selectKey`, `commit`, `revert`) emit controlled input updates without direct ref write-through.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled combobox test to mirror parent callbacks and added explicit controlled-no-parent-update assertions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately combobox state for filtering, selection, and revert|keeps vue-stately combobox controlled without mutating control refs|warns when vue-stately combobox switches between controlled and uncontrolled|keeps vue-stately combobox uncontrolled when control refs are undefined"`,
   - full Vue tests: `yarn test:vue` (618 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Step-list controlled ownership parity (`@vue-stately/steplist`)

1. Closed step-list controlled ownership drift:
   - `useStepListState` no longer mutates controlled `lastCompletedStep` refs directly from `setLastCompletedStep`.
2. Preserved callback semantics:
   - `onLastCompletedStepChange` continues to emit requested transitions while controlled state remains externally owned.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertions for `lastCompletedStep` writes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately step list completion and selection eligibility|keeps vue-stately step list controlled without mutating control refs|warns when vue-stately slider and steplist switch between controlled and uncontrolled"`,
   - full Vue tests: `yarn test:vue` (619 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Menu-trigger controlled ownership parity (`@vue-stately/menu`)

1. Closed menu-trigger controlled ownership drift:
   - `useMenuTriggerState` no longer mutates controlled `isOpen` refs directly from `open`/`close`/`toggle`/`setOpen`.
2. Preserved callback semantics:
   - `onOpenChange` continues to emit requested open/close transitions while controlled state remains externally owned.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled menu-trigger test to mirror parent updates and added explicit controlled-no-parent-update assertions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately menu trigger open state and submenu stack|keeps vue-stately menu trigger controlled without mutating control refs|warns when vue-stately menu trigger switches between controlled and uncontrolled|keeps vue-stately menu trigger uncontrolled when isOpen ref is undefined|manages vue-stately submenu trigger level, focus strategy, and close-all behavior"`,
   - full Vue tests: `yarn test:vue` (620 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree-grid expanded-keys controlled ownership parity (`@vue-stately/table`)

1. Closed tree-grid controlled ownership drift:
   - `UNSTABLE_useTreeGridState` no longer mutates controlled `UNSTABLE_expandedKeys` refs directly.
2. Aligned tree-grid expanded key reads:
   - returned `expandedKeys` now reads from the current computed source, keeping controlled reads in sync with externally owned refs.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled tree-grid test to mirror parent updates and added explicit controlled-no-parent-update assertions.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tree grid expanded key state|keeps vue-stately tree grid controlled without mutating control refs|warns when vue-stately tree grid expanded keys switch between controlled and uncontrolled|keeps vue-stately tree grid expansion uncontrolled when expanded key ref is undefined"`,
   - full Vue tests: `yarn test:vue` (621 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Overlay trigger controlled ownership parity (`@vue-stately/overlays`, tooltip integration)

1. Closed overlay-trigger controlled ownership drift:
   - `useOverlayTriggerState` no longer mutates controlled `isOpen` refs directly from `open`/`close`/`toggle`/`setOpen`,
   - overlay trigger `isOpen` input now accepts computed refs (`MaybeRef<boolean | undefined>`) for controlled/uncontrolled bridging without writable ref assumptions.
2. Aligned tooltip integration with controlled ownership:
   - `VueTooltipTrigger` now passes controlled open state only when `isOpen`/`modelValue` are explicitly provided; otherwise it relies on overlay uncontrolled state,
   - restored uncontrolled `defaultOpen` behavior by wiring `defaultOpen` through tooltip trigger state options.
3. Expanded regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertion for `useOverlayTriggerState`,
   - `starters/vue/src/components.spec.ts`: tooltip controlled tests now mirror parent updates where required and avoid uncontrolled-to-controlled warning transitions in alias coverage.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/components.spec.ts` and `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately overlay trigger open, close, and toggle state|keeps vue-stately overlay trigger controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (622 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Datepicker controlled ownership parity (`@vue-stately/datepicker`)

1. Closed controlled ownership drift in datepicker state hooks:
   - `useDatePickerState` no longer mutates controlled `value` refs directly,
   - `useDateRangePickerState` no longer mutates controlled `value` refs directly.
2. Added controlled-mode transition diagnostics:
   - both hooks now warn on controlled/uncontrolled transitions in development, matching the rest of the Vue stately controlled-state surface.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: updated baseline controlled datepicker tests to mirror parent updates and added explicit controlled-no-parent-update assertions for both single and range picker state.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately date picker open and selection state|manages vue-stately date range picker date and time range state|keeps vue-stately date picker and date range picker controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (623 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Number-field controlled ownership parity (`@vue-stately/numberfield`)

1. Closed number-field controlled ownership drift:
   - `useNumberFieldState` no longer mutates controlled `value` refs directly.
2. Added controlled-mode transition diagnostics:
   - number-field state now warns on controlled/uncontrolled transitions in development.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts`: explicit controlled-no-parent-update assertions for number-field increment behavior.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately number field parsing, stepping, and clamped min/max helpers|keeps vue-stately number field controlled without mutating control refs"`,
   - full Vue tests: `yarn test:vue` (624 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Controlled state helper parity sweep (`@vue-stately/autocomplete`, `searchfield`, `toggle`, `disclosure`, `radio`)

1. Closed remaining ad hoc controlled-state ownership drift in single-value hooks by aligning with shared helper semantics:
   - `useAutocompleteState`, `useSearchFieldState`, `useToggleState`, `useDisclosureState`, and `useRadioGroupState` now route controlled/uncontrolled behavior through `@vue-stately/utils/useControlledState`.
2. Preserved existing public contracts while matching React callback/equality behavior:
   - removed direct per-hook controlled write-through branches,
   - retained read-only/disabled guards where applicable (`toggle`, `radio`),
   - retained existing validation commit behavior in `radio`.
3. Expanded regression coverage for duplicate controlled callbacks without parent sync:
   - `starters/vue/src/composition.spec.ts` now asserts one-turn duplicate suppression for controlled `autocomplete`, `searchfield`, `toggle`, `disclosure`, and `radio` updates.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "autocomplete|search field|toggle hooks controlled|disclosure hooks controlled|radio group controlled"`,
   - full Vue tests: `yarn test:vue` (625 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Set/collection controlled ownership parity sweep (`@vue-stately/checkbox`, `disclosure`, `toggle`, `list`, `tree`)

1. Closed remaining ad hoc controlled-state ownership drift in set/collection hooks:
   - `useCheckboxGroupState`, `useDisclosureGroupState`, `useToggleGroupState`, `useSingleSelectListState`, and `useTreeState` now route controlled/uncontrolled behavior through `@vue-stately/utils/useControlledState`.
2. Preserved React-style callback contracts while keeping Vue-specific guards:
   - retained duplicate selection event behavior in single-select list (`onSelectionChange` still fires when list selection reselects current key),
   - retained existing disabled/read-only gating for checkbox/radio/toggle families,
   - retained tree/list collection synchronization behavior while removing direct controlled ref mutation branches.
3. Expanded regressions for controlled no-parent-sync edge cases:
   - `starters/vue/src/composition.spec.ts` now covers same-turn duplicate suppression for identical controlled update payload references across checkbox group, disclosure group, toggle group, single-select list, and tree expansion state.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "checkbox-group|disclosure group|toggle-group|single-select list|tree collection"` and `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "checkbox-group controlled callbacks|disclosure-group controlled callbacks|single-select controlled callbacks|toggle-group controlled callbacks|tree controlled callbacks"`,
   - full composition suite: `yarn workspace vue-spectrum-starter test src/composition.spec.ts` (278 passed),
   - full Vue tests: `yarn test:vue` (630 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Select controlled ownership parity remediation (`@vue-stately/select`)

1. Closed remaining controlled ownership drift in `useSelectState`:
   - replaced ad hoc controlled/uncontrolled value management with shared `useControlledState`,
   - removed direct controlled write-through branches while preserving `value`/`selectedKey` compatibility behavior for single and multiple selection modes.
2. Preserved React-style event behavior:
   - `onChange` now follows helper equality semantics for repeated same-value writes in controlled no-parent-sync scenarios,
   - `onSelectionChange` intent semantics for repeated controller calls remain intact.
3. Updated regression expectation to match React helper behavior:
   - `starters/vue/src/composition.spec.ts` controlled select test now expects `onChange` duplicate suppression for repeated same-key writes in one turn.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately select"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (630 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Shared controlled helper identity parity remediation (`@vue-stately/utils`)

1. Closed a cross-hook identity mismatch in `useControlledState` affecting object values (`Array`, `Set`, object payloads):
   - switched internal `stateValue` and `valueRef` storage from `ref` to `shallowRef` so `Object.is` equality checks use caller-provided references instead of deep-reactive proxy wrappers.
2. Impact:
   - controlled no-parent-sync duplicate callback suppression now matches React helper semantics for object payloads,
   - fixes applied centrally for all hooks using `useControlledState`, not only the hooks touched in this batch.
3. Validation:
   - covered by the new controlled callback regressions listed above and full Vue gate (`yarn test:vue`, `yarn typecheck:vue`).

### February 28, 2026 — Multiple-selection helper parity remediation (`@vue-stately/selection`)

1. Closed residual controlled-callback drift in base multiple-selection state:
   - `useMultipleSelectionState` now routes controlled selection ownership through shared `useControlledState`,
   - normalized selection logic preserves passed set references when possible, matching React helper equality behavior in controlled no-parent-sync paths.
2. Preserved existing multiple-selection behavior contracts:
   - disallow-empty and single-mode normalization logic remains intact,
   - duplicate-selection-event behavior still works for distinct set writes (`allowDuplicateSelectionEvents`).
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now asserts one-turn duplicate suppression when the same controlled selection object is written repeatedly.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "multiple selection"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (631 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Overlay/menu trigger helper parity remediation (`@vue-stately/overlays`, `@vue-stately/menu`)

1. Closed residual ad hoc controlled-state ownership drift in open-state trigger hooks:
   - `useOverlayTriggerState` now routes controlled/uncontrolled `isOpen` through shared `useControlledState`,
   - `useMenuTriggerState` now routes controlled/uncontrolled root menu open state through shared `useControlledState` while preserving submenu stack reset on close.
2. Preserved existing trigger contracts:
   - `isDisabled` guard remains in menu trigger open-state writes,
   - focus strategy and submenu expansion stack behavior remain unchanged.
3. Updated controlled no-parent-sync regression expectation:
   - `starters/vue/src/composition.spec.ts` now expects one-turn duplicate suppression for repeated identical `open()` calls in controlled `menu trigger` and `overlay trigger` scenarios.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "menu trigger|overlay trigger"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (631 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Color picker/channel helper parity remediation (`@vue-stately/color`)

1. Closed residual ad hoc controlled ownership drift in color state hooks:
   - `useColorPickerState` now routes controlled/uncontrolled `colorValue` through shared `useControlledState`,
   - `useColorChannelFieldState` now routes controlled/uncontrolled channel color state through shared `useControlledState`.
2. Preserved color behavior contracts:
   - picker open/close/toggle lifecycle remains unchanged,
   - channel field input parsing/clamping behavior and range stepping remain unchanged.
3. Expanded controlled no-parent-sync regression assertions:
   - `starters/vue/src/composition.spec.ts` now verifies one-turn duplicate suppression for repeated identical controlled updates in color picker and channel field.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "color picker and channel-field"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (631 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — ComboBox helper parity remediation (`@vue-stately/combobox`)

1. Closed residual ad hoc controlled ownership drift in `useComboBoxState`:
   - `inputValue` and `selectedKey` are now sourced from shared `useControlledState`,
   - writable computed bridges are retained so `@vue-aria/combobox` can keep writing to refs directly while controlled callback semantics remain helper-driven.
2. Preserved combobox behavior contracts:
   - filtering, commit/revert, and selection APIs remain unchanged,
   - open-change and selection-change integration with aria combobox remains intact.
3. Updated controlled no-parent-sync assertion:
   - `starters/vue/src/composition.spec.ts` combobox controlled test now expects one-turn duplicate suppression for repeated identical `setValue` writes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "combobox"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (631 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Expanded color helper parity remediation (`@vue-stately/color`)

1. Extended helper-based controlled ownership alignment across the remaining color state hooks:
   - `useColorAreaState`,
   - `useColorFieldState`,
   - `useColorSliderState`,
   - `useColorWheelState`.
2. Closed direct controlled-ref mutation paths in these hooks by routing value updates through shared `useControlledState`.
3. Added regression coverage for controlled no-parent-sync behavior:
   - `starters/vue/src/composition.spec.ts` now asserts one-turn duplicate suppression and no controlled-ref mutation across color area/field/slider/wheel.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "color area|color field|color slider|color wheel|color picker and channel-field"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (632 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Date/time field helper parity remediation (`@vue-stately/datepicker`)

1. Closed direct controlled-ref mutation paths in string-based date/time field hooks:
   - `useDateFieldState` now routes value ownership through shared `useControlledState`,
   - `useTimeFieldState` now routes value ownership through shared `useControlledState`.
2. Preserved existing aria date/time field behavior:
   - clamping, clear, increment/decrement, and validation state behavior remain unchanged.
3. Updated and expanded regression coverage:
   - `starters/vue/src/composition.spec.ts` baseline date/time field test now mirrors parent updates via `onChange` in controlled mode,
   - added explicit controlled no-parent-sync assertions for date/time fields.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "date and time field"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Date picker helper parity remediation (`@vue-stately/datepicker`)

1. Closed direct controlled-ref mutation paths in picker state hooks:
   - `useDatePickerState` now routes value ownership through shared `useControlledState`,
   - `useDateRangePickerState` now routes range value ownership through shared `useControlledState`.
2. Preserved picker behavior contracts:
   - open/close/toggle behavior and `shouldCloseOnSelect` handling remain unchanged,
   - date/time sub-state behavior (`dateValue`, `timeValue`, `timeRange`) remains unchanged.
3. Expanded controlled no-parent-sync regression assertions:
   - `starters/vue/src/composition.spec.ts` controlled date picker test now asserts one-turn duplicate suppression for repeated identical `setDateValue` writes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "date picker and date range picker|date picker open and selection|date range picker date and time range|keeps vue-stately date picker and date range picker controlled without mutating control refs"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Step-list helper parity remediation (`@vue-stately/steplist`)

1. Closed residual ad hoc controlled ownership drift in `useStepListState`:
   - `lastCompletedStep` now routes through shared `useControlledState`.
2. Preserved step-list behavior contracts:
   - selection gating, completion logic, and fallback-selection behavior remain unchanged.
3. Updated controlled no-parent-sync assertion:
   - `starters/vue/src/composition.spec.ts` step-list controlled test now expects one-turn duplicate suppression for repeated identical `setLastCompletedStep` writes.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "step list"` and full `src/composition.spec.ts`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Slider controlled-callback identity parity remediation (`@vue-stately/slider`)

1. Closed a controlled callback parity gap in `useSliderState`:
   - replaced ad hoc controlled/uncontrolled ownership with shared `useControlledState`,
   - aligned `onChange`/`onChangeEnd` value-shape mapping with React `createOnChange` semantics for single vs range slider outputs.
2. Closed a Vue proxy identity mismatch that caused duplicate controlled emissions:
   - switched slider internal `valuesRef` to `shallowRef` so same-reference array writes preserve `Object.is` semantics (matching React helper behavior).
3. Updated regression coverage:
   - `starters/vue/src/composition.spec.ts` slider controlled test now asserts repeated same-turn writes to the same snapped value emit `onChange` only once when the parent does not sync.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately slider"`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Number-field controlled callback parity remediation (`@vue-stately/numberfield`)

1. Closed controlled callback ownership drift in `useNumberFieldState`:
   - routed controlled/uncontrolled number value ownership through shared `useControlledState`,
   - normalized controlled ref inputs through existing min/max/step clamping before helper ownership.
2. Removed duplicate callback path:
   - `useNumberFieldState` no longer forwards `onChange` directly into `@vue-aria/numberfield`; helper-owned writable state now serves as the single callback channel (prevents duplicate `onChange` for same-turn repeated controlled writes).
3. Updated regression coverage:
   - `starters/vue/src/composition.spec.ts` controlled number-field test now asserts repeated same-turn increments that resolve to the same controlled next value emit only once when the parent does not sync.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately number field"`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree-grid expanded-keys helper parity remediation (`@vue-stately/table`)

1. Closed residual ad hoc expanded-keys ownership drift in `UNSTABLE_useTreeGridState`:
   - replaced manual controlled/uncontrolled tracking with shared `useControlledState` for `expandedKeys`.
2. Preserved tree-grid expanded change contracts:
   - `UNSTABLE_onExpandedChange` still fires only for concrete set payloads (never for `'all'`),
   - uncontrolled/controlled expanded key reads continue to normalize to `'all' | Set<Key>`.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tree grid"`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Calendar helper ownership parity remediation (`@vue-stately/calendar`)

1. Closed remaining ad hoc controlled ownership paths in calendar hooks:
   - `useCalendarState` now routes selected date ownership through shared `useControlledState`,
   - `useRangeCalendarState` now routes selected range ownership through shared `useControlledState`.
2. Preserved calendar/range behavior contracts:
   - controlled range anchor semantics (first click start, second click close range) remain intact even when parent does not sync immediately,
   - visible month synchronization on controlled range selection remains preserved.
3. Removed direct manual warning ownership:
   - controlled/uncontrolled transition warnings now come from the shared helper rather than per-hook watchers.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "calendar and range-calendar"`,
   - full Vue tests: `yarn test:vue` (633 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Grid/table selection ownership parity remediation (`@vue-stately/grid`, `@vue-stately/table`)

1. Closed controlled selection ownership drift in `useGridState`:
   - replaced ad hoc direct `selectedKeys` ref mutation with `useMultipleSelectionState` ownership,
   - wired `onSelectionChange` emission for grid selection updates, matching shared stately selection contracts.
2. Preserved grid-specific focus behavior:
   - retained cell-focus redirect semantics (`focusMode: 'cell'` row focus now maps to first/last child cell before delegating focus updates).
3. Aligned table selection prop-surface passthrough:
   - `useTableState` now forwards selection ownership props (`defaultSelectedKeys`, `onSelectionChange`, `selectionBehavior`, `disallowEmptySelection`, `allowDuplicateSelectionEvents`, and `disabledBehavior` defaulting to `'selection'`) into `useGridState`, matching React table-state composition.
4. Added controlled regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a controlled no-parent-sync grid selection test asserting selected-key refs remain externally owned while change callbacks emit requested next selections.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately grid"`,
   - full Vue tests: `yarn test:vue` (634 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tab-list fallback initialization parity remediation (`@vue-stately/tabs`)

1. Closed fallback-selection initialization drift in `useTabListState`:
   - aligned with React by computing fallback `defaultSelectedKey` during state creation rather than selecting via post-init mutation.
2. Preserved tab-list fallback behavior while preventing mount-time callback noise:
   - uncontrolled tab lists with no explicit default still select the first enabled tab,
   - fallback initialization no longer emits `onSelectionChange` during mount.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` tab-list state test now asserts fallback initialization does not emit `onSelectionChange`.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "manages vue-stately tab list selection and focused-tab synchronization"`,
   - full Vue tests: `yarn test:vue` (634 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Multiple-selection behavior-prop parity remediation (`@vue-stately/selection`)

1. Closed `selectionBehavior` lifecycle drift in `useMultipleSelectionState`:
   - added prop-sync behavior so runtime `selectionBehavior` prop updates are reflected in state (React parity).
2. Closed replace-mode reset drift:
   - when `selectionBehavior` prop is `replace` and state is temporarily toggled to `toggle`, emptying selection now restores `replace` behavior automatically.
3. Preserved existing controlled selection ownership semantics:
   - selected-keys ownership remains helper-driven via `useControlledState`,
   - duplicate-change suppression and allow-duplicate override behavior remain unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes prop-update and replace-reset assertions for `useMultipleSelectionState`.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "multiple selection"`,
   - full Vue tests: `yarn test:vue` (636 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Grid focused-row removal parity remediation (`@vue-stately/grid`)

1. Closed focused-key lifecycle drift in `useGridState`:
   - added React-like focused-row recovery when the currently focused row/cell disappears from the collection.
2. Preserved focus behavior contracts during recovery:
   - row focus re-targets to the nearest available non-disabled row,
   - cell focus preserves the prior column index when moving to replacement rows.
3. Improved reactive parity for derived grid state:
   - `collection`/`disabledKeys` now read through reactive getters so runtime option changes stay in sync with state readers.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes focused-row removal behavior with disabled-row fallback.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately grid"`,
   - full Vue tests: `yarn test:vue` (637 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tree disabled-keys reactive parity remediation (`@vue-stately/tree`)

1. Closed reactive disabled-keys drift in `useTreeState`:
   - tree selection state now reads `disabledKeys` from the live tree props source instead of a setup-time snapshot.
2. Preserved tree ownership and expansion contracts:
   - controlled/uncontrolled expanded key behavior remains unchanged,
   - selection manager collection sync and focused-key reset behavior remain intact.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a tree disabled-keys update test that changes `disabledKeys` after state creation and asserts `selectionManager.isDisabled` + `state.disabledKeys` parity.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately tree"`,
   - full Vue tests: `yarn test:vue` (638 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Form server-error clear parity remediation (`@vue-stately/form`)

1. Closed server-validation lifecycle drift in `useFormValidationState`:
   - added server-error cleared tracking so server errors clear on `commitValidation`/`resetValidation` like React.
2. Preserved server-error reappearance semantics:
   - new server error payload references now re-enable display after a clear operation.
3. Preserved existing validation behavior contracts:
   - native-mode commit path remains intact,
   - aria-mode realtime validation behavior remains unchanged.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a server-error clear/re-show lifecycle test for form validation state.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "form validation"`,
   - full Vue tests: `yarn test:vue` (639 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — List collection reactivity + focus-reset parity remediation (`@vue-stately/list`)

1. Closed collection lifecycle drift in `useListState`:
   - list state now reacts to runtime collection/input/filter changes and updates the internal selection-manager collection reference.
2. Closed focused-key removal drift:
   - focused key now repositions to the nearest available item when the focused item is removed after state creation (React parity behavior).
3. Closed dynamic prop drift in core selection context wiring:
   - `disabledKeys`, selection mode, and selection callbacks now resync into list selection context when inputs change.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes list focused-item removal behavior for reactive item updates.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately list"`,
   - full Vue tests: `yarn test:vue` (640 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Table sort/show-checkbox controlled parity remediation (`@vue-stately/table`)

1. Closed controlled sort-descriptor ownership drift in `useTableState`:
   - sorting now emits through `onSortChange` without mutating controlled `sortDescriptor` refs (React parity).
2. Closed checkbox-visibility drift:
   - `showSelectionCheckboxes` now reflects the explicit prop value without Vue-only `selectionMode !== 'none'` gating.
3. Preserved keyboard-navigation gating semantics:
   - table keyboard-navigation disabled state still includes empty-collection gating plus explicit local disable toggles.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes controlled no-parent-sync sort assertions and `showSelectionCheckboxes` parity when `selectionMode` is `none`.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately table"`,
   - full Vue tests: `yarn test:vue` (642 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Single-select + step-list collection-reactivity parity remediation (`@vue-stately/list`, `@vue-stately/steplist`)

1. Closed reactive prop-forwarding drift in single-select/list wrappers:
   - `useSingleSelectListState` now forwards upstream list props via live getters instead of setup-time spread snapshots.
2. Closed step-list reactive collection drift:
   - `useStepListState` now forwards list props via live getters and resynchronizes completion/selection state on collection updates.
3. Preserved step-list completion semantics while restoring collection-update behavior:
   - when a selected step is removed from the collection, fallback selection now resolves against the updated step order and completion map.
4. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a reactive collection update test for step-list selected-step removal.
5. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "step list"` and `-t "single-select list"`,
   - full Vue tests: `yarn test:vue` (643 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Tab-list collection-reactivity forwarding parity remediation (`@vue-stately/tabs`)

1. Closed reactive prop-forwarding drift in `useTabListState`:
   - tab-list now forwards list-state inputs via live getters instead of setup-time spread snapshots.
2. Closed stale-state projection drift on returned tab state:
   - returned tab state now exposes base list state through live getters to keep collection/selection-manager reads synchronized.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes selected-tab removal behavior for reactive collection updates.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "tab list"`,
   - full Vue tests: `yarn test:vue` (644 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Select/list live-forwarding + collection-normalization parity remediation (`@vue-stately/select`, `@vue-stately/list`)

1. Closed reactive forwarding drift in `useSelectState`:
   - select now forwards list-state inputs via live getters rather than setup-time option snapshots.
2. Closed collection-normalization callback drift in `useListState`:
   - collection/disabled/selection-mode normalization now routes through selection-manager setters, preserving selection-change callback semantics expected by higher-level state hooks.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a reactive select collection-update test asserting selected value/key fallback when the selected option is removed.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately select"`,
   - full Vue tests: `yarn test:vue` (645 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Table selection-mode reactive parity follow-up (`@vue-stately/table`)

1. Closed selection-mode snapshot drift in `useTableState`:
   - table `selectionMode` now resolves from live props instead of setup-time snapshots.
2. Preserved table collection/show-checkbox reactive reads:
   - table collection and `showSelectionCheckboxes` reads now flow through live getters for prop updates.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a table `selectionMode` prop-change synchronization assertion.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "vue-stately table"`,
   - full Vue tests: `yarn test:vue` (646 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Radio-group validation-name reactive parity remediation (`@vue-stately/radio`, `@vue-stately/form`)

1. Closed reactive validation-name drift for radio-group form state:
   - `useFormValidationState` now accepts reactive `name` inputs and resolves server-error scopes from live name refs.
   - `useRadioGroupState` now forwards validation `name` as a computed source rather than an eagerly unwrapped value.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a radio-group server-validation test asserting error-scope updates when `name` changes.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "radio group"`,
   - full Vue tests: `yarn test:vue` (647 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Number-field validation-name reactive parity remediation (`@vue-stately/numberfield`, `@vue-stately/form`)

1. Closed reactive validation-name drift for number-field form state:
   - `useNumberFieldState` now accepts reactive `name` inputs (`MaybeRef`) when forwarding to `useFormValidationState`.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes a number-field server-validation test asserting error-scope updates when `name` changes.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "number field|number-field server validation scope"`,
   - full Vue tests: `yarn test:vue` (648 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Async-list default key fallback parity remediation (`@vue-stately/data`)

1. Closed default `getKey` fallback drift in `useAsyncList`:
   - Vue now matches React fallback semantics (`item.id || item.key`) for async-list default key resolution.
2. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now includes an async-list test asserting default key lookup/removal behavior when `id` is falsy (`0`) and `key` is provided.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "async list"`,
   - full Vue tests: `yarn test:vue` (649 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — Formatted textfield `beforeinput` deletion parity remediation (`@vue-aria/textfield`)

1. Closed `useFormattedTextField` `beforeinput` parity drift:
   - Vue now computes next values for deletion-oriented input types (`deleteContent*`, cut/drag deletes, line deletes) and blocks invalid edits like React.
   - explicit pass-through behavior for undo/redo and line-break input types now matches React semantics.
2. Improved composition fallback parity:
   - composition start now snapshots value + selection range,
   - composition end rollback restores both value and selection range when composed input is invalid.
3. Added regression coverage:
   - `starters/vue/src/composition.spec.ts` now asserts invalid `deleteContentBackward` edits are prevented by formatted textfield `onBeforeInput`.
4. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "textfield validation and formatted input guards"`,
   - full Vue tests: `yarn test:vue` (649 passed),
   - typecheck: `yarn typecheck:vue`.

### February 28, 2026 — I18n filter default-sensitivity parity remediation (`@vue-aria/i18n`)

1. Closed `useFilter` default-collator drift:
   - removed Vue-only default `sensitivity: 'base'` override so default `useFilter()` collation now matches React (`usage: 'search'` with platform/default collator sensitivity).
2. Added/updated regression coverage:
   - `starters/vue/src/composition.spec.ts` i18n helper assertions now verify:
     - default filter behavior is case-sensitive by default (React parity),
     - explicitly passing `{sensitivity: 'base'}` restores case-insensitive matching.
3. Validation after fix:
   - targeted assertions: `yarn workspace vue-spectrum-starter test src/composition.spec.ts -t "locale-sensitive values with vue-aria i18n helpers"`,
   - full Vue tests: `yarn test:vue` (649 passed),
   - typecheck: `yarn typecheck:vue`.

### Validation summary (end of current evidence window)

1. Validation gate repeatedly passed through the cleanup window, with the latest logged snapshot:
   - latest typecheck run: `yarn typecheck:vue`
   - component suite: `yarn workspace vue-spectrum-starter test src/components.spec.ts`
   - story parity suite: `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts`
   - full Vue tests: `yarn test:vue` (latest logged: 649 tests passed)
   - latest Storybook build run: `yarn build:vue:storybook`
2. Story/index parity checks remained zero-diff where logged against the React artifact.
3. Known non-blocking warnings remained unchanged throughout (jsdom navigation warning in composition tests; Storybook CSS/chunk-size warnings).
