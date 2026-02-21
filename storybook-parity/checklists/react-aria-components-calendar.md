# react-aria-components-calendar

## Scope

- Story group: `React Aria Components/Calendar`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Calendar.stories.tsx`
- `packages/react-aria-components/src/Calendar.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Calendar.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueCalendar.ts`

## Gap List

1. Audit grid/cell composition parity and keyboard navigation behavior.
2. Audit multi-month rendering and selection alignment parity.
3. Audit locale/first-day-of-week behavior parity and range selection semantics.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `CalendarExample`
   - `CalendarResetValue`
   - `CalendarMultiMonth`
   - `CalendarFirstDayOfWeekExample`
   - `RangeCalendarExample`
   - `RangeCalendarMultiMonthExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue calendar currently uses native date inputs instead of React calendar grid contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
