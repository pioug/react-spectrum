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

### Validation summary (end of current evidence window)

1. Validation gate repeatedly passed through the cleanup window, with the latest logged snapshot:
   - latest typecheck run: `yarn typecheck:vue`
   - component suite: `yarn workspace vue-spectrum-starter test src/components.spec.ts`
   - story parity suite: `yarn workspace vue-spectrum-starter test src/storybook-parity.spec.ts`
   - full Vue tests: `yarn test:vue` (latest logged: 518 tests passed)
   - latest Storybook build run: `yarn build:vue:storybook`
2. Story/index parity checks remained zero-diff where logged against the React artifact.
3. Known non-blocking warnings remained unchanged throughout (jsdom navigation warning in composition tests; Storybook CSS/chunk-size warnings).
